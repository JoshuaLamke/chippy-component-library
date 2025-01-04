import { SelectOption } from "./types";
import { Field } from "../../field";
import { Badge, Box } from "@chakra-ui/react";

export interface SelectReadViewProps<
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> {
  selectValue:
    | SelectOption<OptionValueName, OptionLabelName>
    | SelectOption<OptionValueName, OptionLabelName>[];
  label?: React.ReactNode;
  optionValueName: OptionValueName;
  optionLabelName: OptionLabelName;
  noValueMessage?: string;
}

const SelectReadView = <
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  selectValue,
  label,
  optionValueName,
  optionLabelName,
  noValueMessage,
}: SelectReadViewProps<OptionValueName, OptionLabelName>) => {
  const isMultiSelect = Array.isArray(selectValue);
  if (!selectValue || (isMultiSelect && !selectValue.length)) {
    return (
      <Field label={label}>
        <Box
          color={"gray.fg"}
          flexWrap={"wrap"}
          overflow={"hidden"}
          width={"full"}
        >
          {noValueMessage || "None Selected"}
        </Box>
      </Field>
    );
  }

  // Return badges if multiple items are selected
  if (isMultiSelect) {
    return (
      <Field label={label}>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          overflow={"hidden"}
          width={"full"}
        >
          {selectValue.map((option) => (
            <Badge
              fontSize={"xs"}
              padding={"2"}
              paddingY={"1"}
              marginEnd={"1"}
              marginBottom={"1"}
              key={option[optionValueName]}
              color={"gray.fg"}
              overflow={"hidden"}
            >
              <Box
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxWidth={"full"}
              >
                {option[optionLabelName]}
              </Box>
            </Badge>
          ))}
        </Box>
      </Field>
    );
  }

  return (
    <Field label={label} width={"full"}>
      <Box
        color={"gray.fg"}
        flexWrap={"wrap"}
        overflow={"hidden"}
        width={"full"}
      >
        {selectValue[optionLabelName]}
      </Box>
    </Field>
  );
};

export default SelectReadView;
