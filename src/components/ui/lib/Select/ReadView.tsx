import { SelectOption } from "./types";
import { Field } from "../../field";
import { Badge } from "@chakra-ui/react";

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
}

const SelectReadView = <
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  selectValue,
  label,
  optionValueName,
  optionLabelName,
}: SelectReadViewProps<OptionValueName, OptionLabelName>) => {
  const isMultiSelect = Array.isArray(selectValue);
  if (!selectValue || (isMultiSelect && !selectValue.length)) {
    return (
      <Field label={label}>
        <div className="text-gray-600">None Selected</div>
      </Field>
    );
  }

  // Return badges if multiple items are selected
  if (isMultiSelect) {
    return (
      <Field label={label}>
        <div className="flex flex-wrap">
          {selectValue.map((option) => (
            <Badge
              className="m-1 px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full"
              key={option[optionValueName]}
            >
              {option[optionLabelName]}
            </Badge>
          ))}
        </div>
      </Field>
    );
  }

  return (
    <Field label={label}>
      <div>{selectValue[optionLabelName]}</div>
    </Field>
  );
};

export default SelectReadView;
