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
        <Box>{noValueMessage || "None Selected"}</Box>
      </Field>
    );
  }

  // Return badges if multiple items are selected
  if (isMultiSelect) {
    return (
      <Field label={label}>
        <Box display={"flex"} flexWrap={"wrap"}>
          {selectValue.map((option) => (
            <Badge
              fontSize={"xs"}
              color={"gray.700"}
              background={"gray.200"}
              paddingX={"2"}
              paddingY={"1"}
              margin={"1"}
              rounded={"full"}
              key={option[optionValueName]}
            >
              {option[optionLabelName]}
            </Badge>
          ))}
        </Box>
      </Field>
    );
  }

  return (
    <Field label={label}>
      <Box>{selectValue[optionLabelName]}</Box>
    </Field>
  );
};

export default SelectReadView;
