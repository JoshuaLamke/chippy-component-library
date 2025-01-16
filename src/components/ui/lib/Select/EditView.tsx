import { Field } from "../../field";
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import {
  Badge,
  Box,
  ConditionalValue,
  Input,
  Span,
  Spinner,
} from "@chakra-ui/react";
import { SelectOption } from "./types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectFieldProps } from "./Field";
import LabelWithTooltip from "../Tooltip/LabelWithTooltip";
import {
  useCombobox,
  UseComboboxState,
  UseComboboxStateChange,
  UseComboboxStateChangeOptions,
  useMultipleSelection,
  UseMultipleSelectionState,
  UseMultipleSelectionStateChange,
  UseMultipleSelectionStateChangeOptions,
} from "downshift";
import { CloseButton } from "../../close-button";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../../popover";
import { FaCaretDown, FaCheck } from "react-icons/fa";

export const getErrorText = (
  errorObj: FieldErrors<FieldValues>,
  baseKeyName: string,
  optionValueName: string,
  optionLabelName: string
) => {
  const keyError = errorObj[baseKeyName] as
    | FieldError
    | Record<string, FieldError>[]
    | Record<string, FieldError>
    | undefined;

  if (!keyError) {
    return "";
  }

  // If keyError is an array or has keys that are fieldErrors, it means the schema is likely expecting different keys
  if (
    Array.isArray(keyError) ||
    Object.values(keyError).some(
      (possibleErrObj) =>
        typeof possibleErrObj === "object" &&
        (possibleErrObj as FieldError).message
    )
  ) {
    const expectedKeys = Array.isArray(keyError)
      ? Object.keys(keyError[0])
      : Object.keys(keyError);
    return `Expecting option(s) to have keys: ${expectedKeys.join(
      ", "
    )}. Received keys: ${optionValueName}, ${optionLabelName}.`;
  }

  // Should only be possible for it to be a regular error at this point
  return (keyError as FieldError).message;
};

export interface SelectEditViewProps<
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> extends Omit<
    SelectFieldProps<FormKeyNames, OptionValueName, OptionLabelName>,
    "EditView" | "ReadView" | "state" | "noValueMessage"
  > {
  formMethods: UseFormReturn<any>;
}

const SelectEditView = <
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  label,
  name,
  formMethods,
  required,
  helperText,
  warningText,
  tooltip,
  optionValueName,
  optionLabelName,
  isMulti,
  ...props
}: SelectEditViewProps<FormKeyNames, OptionValueName, OptionLabelName>) => {
  const {
    formState: { errors },
    control,
  } = formMethods;

  return (
    <Field
      label={<LabelWithTooltip tooltip={tooltip} label={label} />}
      invalid={!!errors[name]}
      errorText={getErrorText(errors, name, optionValueName, optionLabelName)}
      required={required}
      helperText={helperText}
      warningText={warningText}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          isMulti ? (
            <HookFormSelectMulti
              name={name}
              optionValueName={optionValueName}
              optionLabelName={optionLabelName}
              field={field}
              formMethods={formMethods}
              {...props}
            />
          ) : (
            <HookFormSelectSingle
              name={name}
              optionValueName={optionValueName}
              optionLabelName={optionLabelName}
              field={field}
              formMethods={formMethods}
              {...props}
            />
          )
        }
      />
    </Field>
  );
};

const sizeMap = {
  sm: {
    totalHeight: "9",
    inputHeight: "5",
    fontSize: "2xs",
    chipCloseButtonSize: "2xs",
    mainCloseButtonSize: "xs",
    singleSelectFontSize: "sm",
    spinnerSize: "xs",
    spinnerTopPosition: "33%",
  },
  md: {
    totalHeight: "10",
    inputHeight: "6",
    fontSize: "xs",
    chipCloseButtonSize: "2xs",
    mainCloseButtonSize: "sm",
    singleSelectFontSize: "md",
    spinnerSize: "sm",
    spinnerTopPosition: "31%",
  },
  lg: {
    totalHeight: "11",
    inputHeight: "7",
    fontSize: "sm",
    chipCloseButtonSize: "xs",
    mainCloseButtonSize: "sm",
    singleSelectFontSize: "lg",
    spinnerSize: "md",
    spinnerTopPosition: "29%",
  },
  xl: {
    totalHeight: "12",
    inputHeight: "8",
    fontSize: "md",
    chipCloseButtonSize: "sm",
    mainCloseButtonSize: "sm",
    singleSelectFontSize: "xl",
    spinnerSize: "md",
    spinnerTopPosition: "29%",
  },
};

interface HookFormSelectProps<
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> extends SelectEditViewProps<FormKeyNames, OptionValueName, OptionLabelName> {
  field: ControllerRenderProps<any, FormKeyNames>;
}

const HookFormSelectSingle = <
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  formMethods,
  field,
  options,
  optionLabelName,
  optionValueName,
  size,
  placeholder,
  onChange,
  onBlur,
  onCreateOption = (createdOption) => createdOption,
  createable,
  disabled,
  readOnly,
  name,
}: HookFormSelectProps<FormKeyNames, OptionValueName, OptionLabelName>) => {
  const {
    formState: { errors },
  } = formMethods;
  const isInvalid = !!errors[name];

  const [mergedOptions, setMergedOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState<SelectOption<
    OptionValueName,
    OptionLabelName
  > | null>(field.value ?? null);

  const [inputValue, setInputValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const getFilteredOptions = (inputValue: string) => {
    const lowerCasedInputValue = inputValue.toLowerCase();
    const filteredOptionsObj = mergedOptions.reduce(
      (prev, curr) => {
        const filterMatch = curr[optionLabelName]
          .toLowerCase()
          .includes(lowerCasedInputValue);
        const exactMatch =
          curr[optionLabelName].toLowerCase() === lowerCasedInputValue;
        if (filterMatch) {
          return {
            options: [...prev.options, curr],
            exactMatch: prev.exactMatch || exactMatch,
          };
        }
        return prev;
      },
      {
        options: [] as SelectOption<OptionValueName, OptionLabelName>[],
        exactMatch: false,
      }
    );

    const newOption = {
      __isCreatedSelectOptionChippyCL__: true,
      [optionLabelName]: `Create: ${inputValue}`,
      [optionValueName]: lowerCasedInputValue,
    } as SelectOption<OptionValueName, OptionLabelName>;

    return createable && !filteredOptionsObj.exactMatch && inputValue.trim()
      ? [newOption, ...filteredOptionsObj.options]
      : filteredOptionsObj.options;
  };

  const filteredOptions = useMemo(
    () => getFilteredOptions(inputValue),
    [inputValue, mergedOptions]
  );

  const handleCreateOption = useCallback(
    async (newOption: SelectOption<OptionValueName, OptionLabelName>) => {
      try {
        setIsLoading(true);
        const result = await Promise.resolve(onCreateOption(newOption));
        setIsLoading(false);
        return result;
      } catch (error) {
        console.error("Error in onCreateOption:", error);
        setIsLoading(false);
        return undefined;
      }
    },
    [onCreateOption]
  );

  const comboboxStateReducer = (
    _state: UseComboboxState<SelectOption<OptionValueName, OptionLabelName>>,
    actionAndChanges: UseComboboxStateChangeOptions<
      SelectOption<OptionValueName, OptionLabelName>
    >
  ) => {
    const { changes, type } = actionAndChanges;
    switch (type) {
      case useCombobox.stateChangeTypes.InputKeyDownEscape:
        return {
          ...changes,
          isOpen: false,
          highlightedIndex: -1,
        };
      default:
        return changes;
    }
  };

  const comboboxStateChange = ({
    inputValue: newInputValue,
    type,
    selectedItem: newSelectedOption,
  }: UseComboboxStateChange<
    SelectOption<OptionValueName, OptionLabelName>
  >) => {
    switch (type) {
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
        /* v8 ignore next 3*/
        if (!newSelectedOption) {
          break;
        }

        const wasCreated =
          newSelectedOption["__isCreatedSelectOptionChippyCL__"];
        // Add option normally if it wasnt created
        if (!wasCreated) {
          setSelectedOption(newSelectedOption);
          setInputValue("");
          break;
        }

        const newOption = {
          [optionValueName]: newSelectedOption[optionValueName],
          [optionLabelName]: (
            newSelectedOption[optionLabelName] as string
          ).substring(8), // remove Create: from label when saving
        } as SelectOption<OptionValueName, OptionLabelName>;

        // Creating a new option
        handleCreateOption(newOption).then((formattedOption) => {
          // If no error happens, create
          if (formattedOption) {
            setMergedOptions([formattedOption, ...mergedOptions]);
            setSelectedOption(formattedOption);
          }
        });
        setInputValue("");
        break;
      case useCombobox.stateChangeTypes.InputChange:
        setInputValue(newInputValue!.trimStart());
        break;
      default:
        break;
    }
  };

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    isItemDisabled() {
      return !!(isLoading || disabled || readOnly);
    },
    selectedItem: selectedOption,
    defaultHighlightedIndex: 0,
    items: filteredOptions,
    itemToString(option) {
      return option ? option[optionLabelName] : "";
    },
    inputValue,
    stateReducer: comboboxStateReducer,
    onStateChange: comboboxStateChange,
  });

  useEffect(() => {
    field.onChange(selectedOption);
    onChange?.(selectedOption);
  }, [selectedOption]);

  return (
    <PopoverRoot
      open={isOpen}
      positioning={{
        sameWidth: true,
        placement: "bottom",
      }}
    >
      <PopoverTrigger width={"full"} as={"div"}>
        <Box
          position="relative"
          display="inline-flex"
          width="100%"
          {...getToggleButtonProps()}
        >
          <Input
            paddingStart={"3"}
            paddingEnd={"16"}
            size={size}
            placeholder={
              !selectedOption && !inputValue && !isLoading
                ? placeholder
                : undefined
            }
            disabled={disabled}
            readOnly={isLoading || readOnly}
            {...getInputProps({
              onClick: (e) => e.stopPropagation(),
              onBlur: () => {
                field.onBlur();
                onBlur?.();
              },
            })}
          />
          {isLoading && (
            <Spinner
              position="absolute"
              left="3"
              top={sizeMap[size ?? "md"]["spinnerTopPosition"]}
              size={
                sizeMap[size ?? "md"]["spinnerSize"] as ConditionalValue<
                  "sm" | "md" | "lg" | "xs"
                >
              }
            />
          )}
          {!!selectedOption && !inputValue && !isLoading && (
            <Box
              position="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              fontSize={sizeMap[size ?? "md"]["singleSelectFontSize"]}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              width="calc(100% - 76px)"
            >
              {selectedOption[optionLabelName]}
            </Box>
          )}
          <Box
            position="absolute"
            right="0"
            top="0"
            bottom="0"
            display="flex"
            alignItems="center"
          >
            {!!selectedOption && (
              <Box display={"flex"} alignItems={"center"}>
                <CloseButton
                  disabled={isLoading || disabled || readOnly}
                  size={
                    sizeMap[size ?? "md"][
                      "mainCloseButtonSize"
                    ] as ConditionalValue<"xs" | "sm">
                  }
                  background={"none"}
                  onClick={() => setSelectedOption(null)}
                  aria-label="Remove selected option"
                />
              </Box>
            )}
            <Span
              width="0.5px"
              background="border"
              height="calc(100% - 14px)"
            />
            <Box display="flex" alignItems="center" paddingX="2">
              <FaCaretDown
                size={20}
                color={
                  isInvalid
                    ? "var(--chakra-colors-border-error)"
                    : "var(--chakra-colors-fg-emphasized)"
                }
              />
            </Box>
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        width={"full"}
        marginTop={"1"}
        maxHeight={"80"}
        overflowY={"scroll"}
        padding={"0"}
        {...getMenuProps()}
      >
        {filteredOptions.map((option, index) => (
          <Box
            bg={
              highlightedIndex === index ? "colorPalette.emphasized" : "inherit"
            }
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            paddingY={"2"}
            paddingX={"3"}
            key={option[optionValueName]}
            {...getItemProps({ item: option, index })}
          >
            <Box
              as="span"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              flex="1"
              marginRight="2"
            >
              {option[optionLabelName]}
            </Box>
            {option[optionValueName] === selectedOption?.[optionValueName] && (
              <FaCheck />
            )}
          </Box>
        ))}
      </PopoverContent>
    </PopoverRoot>
  );
};

export const calculateContainerBorderStyles = (
  isInvalid: boolean,
  isInputFocused: boolean
) => {
  if (isInvalid) {
    return {
      borderWidth: "thin",
      borderColor: "border.error",
      ...(isInputFocused
        ? {
            outlineColor: "border.error",
            outlineWidth: "thin",
            outlineStyle: "solid",
          }
        : undefined),
    };
  } else if (isInputFocused) {
    return {
      borderWidth: "thin",
      borderColor: "border.inverted",
      outlineColor: "colorPalette.focusRing",
      outlineWidth: "thin",
      outlineStyle: "solid",
    };
  } else {
    return {
      borderWidth: "thin",
    };
  }
};

const HookFormSelectMulti = <
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  formMethods,
  field,
  options,
  optionLabelName,
  optionValueName,
  size,
  placeholder,
  onChange,
  onBlur,
  onCreateOption = (createdOption) => createdOption,
  createable,
  disabled,
  readOnly,
  name,
}: HookFormSelectProps<FormKeyNames, OptionValueName, OptionLabelName>) => {
  const {
    formState: { errors },
  } = formMethods;
  const isInvalid = !!errors[name];

  const [mergedOptions, setMergedOptions] = useState(options);
  const [selectedOptions, setSelectedOptions] = useState<
    SelectOption<OptionValueName, OptionLabelName>[]
  >(field.value ?? []);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const containerRef = useRef<HTMLButtonElement>(null);

  const [inputValue, setInputValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const getFilteredOptions = (inputValue: string) => {
    const lowerCasedInputValue = inputValue.toLowerCase();
    const filteredOptionsObj = mergedOptions.reduce(
      (prev, curr) => {
        const filterMatch =
          curr[optionLabelName].toLowerCase().includes(lowerCasedInputValue) &&
          !selectedOptions.find(
            (opt) => curr[optionValueName] === opt[optionValueName]
          );
        const exactMatch =
          curr[optionLabelName].toLowerCase() === lowerCasedInputValue;
        if (filterMatch) {
          return {
            options: [...prev.options, curr],
            exactMatch: prev.exactMatch || exactMatch,
          };
        }
        return prev;
      },
      {
        options: [] as SelectOption<OptionValueName, OptionLabelName>[],
        exactMatch: false,
      }
    );

    const newOption = {
      __isCreatedSelectOptionChippyCL__: true,
      [optionLabelName]: `Create: ${inputValue}`,
      [optionValueName]: lowerCasedInputValue,
    } as SelectOption<OptionValueName, OptionLabelName>;

    return createable && !filteredOptionsObj.exactMatch && inputValue.trim()
      ? [newOption, ...filteredOptionsObj.options]
      : filteredOptionsObj.options;
  };

  const filteredOptions = useMemo(
    () => getFilteredOptions(inputValue),
    [inputValue, mergedOptions, selectedOptions]
  );

  const multiSelectStateChange = ({
    selectedItems: newSelectedOptions,
    type,
  }: UseMultipleSelectionStateChange<
    SelectOption<OptionValueName, OptionLabelName>
  >) => {
    switch (type) {
      case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
      case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
      case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
      case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
        if (!(isLoading || disabled || readOnly)) {
          setSelectedOptions(newSelectedOptions ?? /* v8 ignore next */ []);
        }
        break;
      default:
        break;
    }
  };

  const multiSelectStateReducer = (
    state: UseMultipleSelectionState<
      SelectOption<OptionValueName, OptionLabelName>
    >,
    actionAndChanges: UseMultipleSelectionStateChangeOptions<
      SelectOption<OptionValueName, OptionLabelName>
    >
  ) => {
    switch (actionAndChanges.type) {
      case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
      case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
      case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
      case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
        const prevActiveIndex = state.activeIndex;
        const nextActiveIndex = prevActiveIndex - 1;
        return {
          ...actionAndChanges.changes,
          activeIndex: nextActiveIndex,
        };
      default:
        return { ...actionAndChanges.changes };
      /* v8 ignore next */
    }
  };

  const {
    getSelectedItemProps,
    getDropdownProps,
    removeSelectedItem,
    activeIndex,
  } = useMultipleSelection({
    selectedItems: selectedOptions,
    onStateChange: multiSelectStateChange,
    stateReducer: multiSelectStateReducer,
  });

  const handleCreateOption = useCallback(
    async (newOption: SelectOption<OptionValueName, OptionLabelName>) => {
      try {
        setIsLoading(true);
        const result = await Promise.resolve(onCreateOption(newOption));
        setIsLoading(false);
        return result;
      } catch (error) {
        console.error("Error in onCreateOption:", error);
        setIsLoading(false);
        return undefined;
      }
    },
    [onCreateOption]
  );

  const comboboxStateReducer = (
    state: UseComboboxState<SelectOption<OptionValueName, OptionLabelName>>,
    actionAndChanges: UseComboboxStateChangeOptions<
      SelectOption<OptionValueName, OptionLabelName>
    >
  ) => {
    const { changes, type } = actionAndChanges;
    switch (type) {
      case useCombobox.stateChangeTypes.InputKeyDownEscape:
        inputRef.current?.focus();
        return {
          ...changes,
          isOpen: false,
          highlightedIndex: -1,
        };

      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
        return {
          ...changes,
          isOpen: true,
          highlightedIndex:
            state.highlightedIndex! >= filteredOptions.length - 1 // If it was the last option
              ? state.highlightedIndex - 1
              : state.highlightedIndex,
        };
      default:
        return changes;
    }
  };

  const comboboxStateChange = ({
    inputValue: newInputValue,
    type,
    selectedItem: newSelectedOption,
  }: UseComboboxStateChange<
    SelectOption<OptionValueName, OptionLabelName>
  >) => {
    switch (type) {
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
        /* v8 ignore next 3*/
        if (!newSelectedOption) {
          break;
        }

        const wasCreated =
          !!newSelectedOption["__isCreatedSelectOptionChippyCL__"];

        // Selecting an existing option
        if (!wasCreated) {
          setSelectedOptions([...selectedOptions, newSelectedOption]);
          setInputValue("");
          break;
        }

        const newOption = {
          [optionValueName]: newSelectedOption[optionValueName],
          [optionLabelName]: (
            newSelectedOption[optionLabelName] as string
          ).substring(8), // remove Create: from label when saving
        } as SelectOption<OptionValueName, OptionLabelName>;

        // Creating a new option
        handleCreateOption(newOption).then((formattedOption) => {
          // If no error happens, create
          if (formattedOption) {
            setMergedOptions([formattedOption, ...mergedOptions]);
            setSelectedOptions([...selectedOptions, formattedOption]);
          }
        });
        setInputValue("");
        break;
      case useCombobox.stateChangeTypes.InputChange:
        setInputValue(newInputValue!.trimStart());
        break;
      default:
        break;
    }
  };

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    isItemDisabled() {
      return !!(isLoading || disabled || readOnly);
    },
    selectedItem: null,
    defaultHighlightedIndex: 0,
    items: filteredOptions,
    itemToString(option) {
      return option ? option[optionLabelName] : "";
    },
    inputValue,
    stateReducer: comboboxStateReducer,
    onStateChange: comboboxStateChange,
  });

  useEffect(() => {
    field.onChange(selectedOptions);
    onChange?.(selectedOptions);
  }, [selectedOptions]);

  return (
    <PopoverRoot
      open={isOpen}
      positioning={{
        sameWidth: true,
        placement: "bottom",
      }}
    >
      <PopoverTrigger width={"full"} as={"div"}>
        <Box
          display={"flex"}
          rounded={"sm"}
          minHeight={sizeMap[size ?? "md"]["totalHeight"]}
          {...calculateContainerBorderStyles(isInvalid, isInputFocused)}
          width={"full"}
          alignItems={"center"}
          paddingStart={"2"}
          {...getToggleButtonProps({
            ref: containerRef,
          })}
          onClick={(e) => {
            const clickable = !(isLoading || disabled || readOnly);
            if (clickable) {
              getToggleButtonProps().onClick?.(e);
            }
          }}
        >
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            flex={"1"}
            paddingStart={"1"}
            paddingY={"0.5"}
            alignItems={"center"}
            overflow={"hidden"}
          >
            {selectedOptions.map((selectedOptionForRender, index) => {
              return (
                <Box
                  margin={"0.5"}
                  padding={"1"}
                  minWidth={"0"}
                  display={"flex"}
                  alignItems={"center"}
                  key={selectedOptionForRender[optionValueName]}
                >
                  <Badge
                    rounded={"xs"}
                    fontSize={sizeMap[size ?? "md"]["fontSize"]}
                    lineHeight={"taller"}
                    paddingStart={"3"}
                    paddingEnd={"0"}
                    overflow="hidden"
                  >
                    <Box
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {selectedOptionForRender[optionLabelName]}
                    </Box>

                    <CloseButton
                      {...getSelectedItemProps({
                        selectedItem: selectedOptionForRender,
                        index,
                        tabIndex: -1,
                      })}
                      background={
                        index === activeIndex ? "red.subtle" : "inherit"
                      }
                      outline={"none"}
                      aria-label={`Remove ${selectedOptionForRender[optionLabelName]}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedItem(selectedOptionForRender);
                      }}
                      disabled={isLoading || disabled || readOnly}
                      marginStart={"0.5"}
                      size={
                        sizeMap[size ?? "md"][
                          "chipCloseButtonSize"
                        ] as ConditionalValue<"2xs" | "xs" | "sm">
                      }
                      rounded={"xs"}
                      variant={"ghost"}
                    />
                  </Badge>
                </Box>
              );
            })}
            {isLoading && (
              <Spinner
                size={
                  sizeMap[size ?? "md"]["spinnerSize"] as ConditionalValue<
                    "sm" | "md" | "lg" | "xs"
                  >
                }
                marginX={"1"}
              />
            )}
            <Input
              display={"block"}
              margin={"0.5"}
              width={"full"}
              flex={"1 0 0%"}
              minWidth={"10"}
              padding={"0"}
              border={"0"}
              outline={"0"}
              maxHeight={sizeMap[size ?? "md"]["inputHeight"]}
              fontSize={"sm"}
              placeholder={
                selectedOptions.length === 0 && !isLoading
                  ? placeholder
                  : undefined
              }
              disabled={disabled}
              readOnly={readOnly || isLoading}
              {...getInputProps({
                ...getDropdownProps({
                  onClick: (e) => e.stopPropagation(),
                  ref: inputRef,
                  onFocus: () => {
                    setIsInputFocused(true);
                  },
                  onBlur: () => {
                    field.onBlur();
                    onBlur?.();
                    setIsInputFocused(false);
                  },
                }),
              })}
            />
          </Box>

          {!!selectedOptions.length && (
            <Box display={"flex"} alignItems={"center"}>
              <CloseButton
                disabled={isLoading || disabled || readOnly}
                size={
                  sizeMap[size ?? "md"][
                    "mainCloseButtonSize"
                  ] as ConditionalValue<"xs" | "sm">
                }
                background={"none"}
                onClick={() => setSelectedOptions([])}
                aria-label="Remove all selected options"
              />
            </Box>
          )}
          <Span
            alignSelf={"stretch"}
            width={"1px"}
            marginY={"1.5"}
            background={"border"}
          ></Span>
          <Box display={"flex"} alignItems={"center"} paddingX={"2"}>
            <FaCaretDown
              size={20}
              color={
                isInvalid
                  ? "var(--chakra-colors-border-error)"
                  : "var(--chakra-colors-fg-emphasized)"
              }
            />
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        width={"full"}
        marginTop={"1"}
        maxHeight={"80"}
        overflowY={"scroll"}
        padding={"0"}
        {...getMenuProps()}
      >
        {filteredOptions.map((option, index) => (
          <Box
            bg={
              highlightedIndex === index ? "colorPalette.emphasized" : "inherit"
            }
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            paddingY={"2"}
            paddingX={"3"}
            key={option[optionValueName]}
            {...getItemProps({ item: option, index })}
          >
            <Box
              as="span"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              flex="1"
              marginRight="2"
            >
              {option[optionLabelName]}
            </Box>
          </Box>
        ))}
      </PopoverContent>
    </PopoverRoot>
  );
};

export default SelectEditView;
