import { useFormContext } from "react-hook-form";
import { SelectOption } from "./types";
import { TooltipProps } from "../../tooltip";
import { DefaultTipIconProps } from "../Icons/DefaultTipIcon";
import SelectReadView, { SelectReadViewProps } from "./ReadView";
import SelectEditView, { SelectEditViewProps } from "./EditView";
import { omit } from "@/components/ui/lib/utils";

export interface SelectFieldProps<
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> {
  label?: React.ReactNode;
  isMulti?: boolean;
  name: FormKeyNames;
  placeholder?: string;
  options: SelectOption<OptionValueName, OptionLabelName>[];
  size?: "sm" | "md" | "lg" | "xl";
  onChange?: (
    val:
      | SelectOption<OptionValueName, OptionLabelName>[]
      | SelectOption<OptionValueName, OptionLabelName>
      | null
      | undefined
  ) => void;
  onBlur?: () => void;
  state?: "read" | "edit";
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  createable?: boolean;
  optionValueName: OptionValueName;
  optionLabelName: OptionLabelName;
  onCreateOption?: (
    createdOption: SelectOption<OptionValueName, OptionLabelName>
  ) =>
    | Promise<SelectOption<OptionValueName, OptionLabelName>>
    | SelectOption<OptionValueName, OptionLabelName>;
  helperText?: string;
  warningText?: string;
  tooltip?: {
    content: React.ReactNode;
    Icon?: React.ReactElement<HTMLButtonElement>;
    defaultIconProps?: DefaultTipIconProps;
    tooltipProps?: Omit<TooltipProps, "children" | "content">;
  };
  ReadView?: React.FunctionComponent<
    SelectReadViewProps<OptionValueName, OptionLabelName>
  >;
  EditView?: React.FunctionComponent<
    SelectEditViewProps<FormKeyNames, OptionValueName, OptionLabelName>
  >;
  noValueMessage?: string;
}

const SelectField = <
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>(
  props: SelectFieldProps<FormKeyNames, OptionValueName, OptionLabelName>
) => {
  const { ReadView, EditView } = props;
  const formMethods = useFormContext();

  const readViewProps: SelectReadViewProps<OptionValueName, OptionLabelName> = {
    selectValue: formMethods.getValues(props.name),
    optionValueName: props.optionValueName,
    optionLabelName: props.optionLabelName,
    label: props.label,
    noValueMessage: props.noValueMessage,
  };

  const editViewProps: SelectEditViewProps<
    FormKeyNames,
    OptionValueName,
    OptionLabelName
  > = {
    ...omit(props, ["EditView", "ReadView", "state"]),
    formMethods,
  };

  return props.state === "read" ? (
    ReadView ? (
      <ReadView {...readViewProps} />
    ) : (
      <SelectReadView<OptionValueName, OptionLabelName> {...readViewProps} />
    )
  ) : EditView ? (
    <EditView {...editViewProps} />
  ) : (
    <SelectEditView<FormKeyNames, OptionValueName, OptionLabelName>
      {...editViewProps}
    />
  );
};

export default SelectField;
