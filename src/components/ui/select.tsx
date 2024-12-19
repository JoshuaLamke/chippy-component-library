"use client";

import type { CollectionItem } from "@chakra-ui/react";
import { Badge, Select as ChakraSelect, Portal, Box } from "@chakra-ui/react";
import { CloseButton } from "./close-button";
import { forwardRef } from "react";

interface SelectTriggerProps extends ChakraSelect.ControlProps {
  clearable?: boolean;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(props, ref) {
    const { children, clearable, ...rest } = props;
    return (
      <ChakraSelect.Control {...rest}>
        <ChakraSelect.Trigger ref={ref}>{children}</ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          {clearable && <SelectClearTrigger />}
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
    );
  }
);

const SelectClearTrigger = forwardRef<
  HTMLButtonElement,
  ChakraSelect.ClearTriggerProps
>(function SelectClearTrigger(props, ref) {
  return (
    <ChakraSelect.ClearTrigger asChild {...props} ref={ref}>
      <CloseButton
        size="xs"
        variant="plain"
        focusVisibleRing="inside"
        focusRingWidth="2px"
        pointerEvents="auto"
      />
    </ChakraSelect.ClearTrigger>
  );
});

interface SelectContentProps extends ChakraSelect.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props, ref) {
    const { portalled = true, portalRef, ...rest } = props;
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content {...rest} ref={ref} />
        </ChakraSelect.Positioner>
      </Portal>
    );
  }
);

export const SelectItem = forwardRef<HTMLDivElement, ChakraSelect.ItemProps>(
  function SelectItem(props, ref) {
    const { item, children, ...rest } = props;
    return (
      <ChakraSelect.Item key={item.value} item={item} {...rest} ref={ref}>
        {children}
        <ChakraSelect.ItemIndicator />
      </ChakraSelect.Item>
    );
  }
);

interface SelectValueTextProps
  extends Omit<ChakraSelect.ValueTextProps, "children"> {
  children?(items: CollectionItem[]): React.ReactNode;
}

export const SelectValueText = forwardRef<
  HTMLSpanElement,
  SelectValueTextProps
>(function SelectValueText(props, ref) {
  const { children, ...rest } = props;
  return (
    <ChakraSelect.ValueText
      {...rest}
      ref={ref}
      display={"flex"}
      flexWrap={"wrap"}
    >
      <ChakraSelect.Context>
        {(select) => {
          const items = select.selectedItems;
          if (items.length === 0)
            return (
              <Box as={"span"} marginStart={"1"}>
                {props.placeholder}
              </Box>
            );
          if (children) return children(items);
          if (items.length === 1)
            return (
              <Box as={"span"} marginStart={"1"}>
                {select.collection.stringifyItem(items[0])}
              </Box>
            );
          const handleRemoveItem = (item: unknown) => {
            const newValue = items
              .filter(
                (selectedItem) =>
                  select.collection.stringifyItem(selectedItem) !==
                  select.collection.stringifyItem(item)
              )
              .map((i) => select.collection.getItemValue(i)) as string[];
            select.setValue(newValue);
          };
          return items.map((item) => (
            <Badge
              margin={"1"}
              paddingStart={"4"}
              key={JSON.stringify(item)}
              display="flex"
              alignItems="center"
            >
              {select.collection.stringifyItem(item)}
              <CloseButton
                size={"xs"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  // Allow keyboard users to remove single item with enter
                  if (e.key === "Enter") {
                    handleRemoveItem(item);
                  }
                }}
                aria-label={`Remove ${select.collection.stringifyItem(item)}`}
                as="div"
                tabIndex={0}
              />
            </Badge>
          ));
        }}
      </ChakraSelect.Context>
    </ChakraSelect.ValueText>
  );
});

export const SelectRoot = forwardRef<HTMLDivElement, ChakraSelect.RootProps>(
  function SelectRoot(props, ref) {
    return (
      <ChakraSelect.Root
        {...props}
        ref={ref}
        positioning={{ sameWidth: true, ...props.positioning }}
      >
        {props.asChild ? (
          props.children
        ) : (
          <>
            <ChakraSelect.HiddenSelect />
            {props.children}
          </>
        )}
      </ChakraSelect.Root>
    );
  }
) as ChakraSelect.RootComponent;

interface SelectItemGroupProps extends ChakraSelect.ItemGroupProps {
  label: React.ReactNode;
}

export const SelectItemGroup = forwardRef<HTMLDivElement, SelectItemGroupProps>(
  function SelectItemGroup(props, ref) {
    const { children, label, ...rest } = props;
    return (
      <ChakraSelect.ItemGroup {...rest} ref={ref}>
        <ChakraSelect.ItemGroupLabel>{label}</ChakraSelect.ItemGroupLabel>
        {children}
      </ChakraSelect.ItemGroup>
    );
  }
);

export const SelectLabel = ChakraSelect.Label;
export const SelectItemText = ChakraSelect.ItemText;
