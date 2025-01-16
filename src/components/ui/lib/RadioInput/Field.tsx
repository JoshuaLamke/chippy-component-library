import { useFormContext } from "react-hook-form";
import { SelectOption } from "..";
import { TooltipProps } from "../../tooltip";
import { DefaultTipIconProps } from "../Icons/DefaultTipIcon";
import RadioInputReadView, { RadioInputReadViewProps } from "./ReadView";
import RadioInputEditView, { RadioInputEditViewProps } from "./EditView";
import { omit } from "@/components/ui/lib/utils";

export interface RadioInputFieldProps<
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> {
  label?: React.ReactNode;
  name: FormKeyNames;
  options: SelectOption<OptionValueName, OptionLabelName>[];
  size?: "sm" | "md" | "lg" | "xs";
  onChange?: (
    val: SelectOption<OptionValueName, OptionLabelName> | null | undefined
  ) => void;
  onBlur?: () => void;
  state?: "read" | "edit";
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  optionValueName: OptionValueName;
  optionLabelName: OptionLabelName;
  helperText?: string;
  warningText?: string;
  tooltip?: {
    content: React.ReactNode;
    Icon?: React.ReactElement<HTMLButtonElement>;
    defaultIconProps?: DefaultTipIconProps;
    tooltipProps?: Omit<TooltipProps, "children" | "content">;
  };
  ReadView?: React.FunctionComponent<
    RadioInputReadViewProps<OptionValueName, OptionLabelName>
  >;
  EditView?: React.FunctionComponent<
    RadioInputEditViewProps<FormKeyNames, OptionValueName, OptionLabelName>
  >;
  noValueMessage?: string;
}

const RadioInputField = <
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>(
  props: RadioInputFieldProps<FormKeyNames, OptionValueName, OptionLabelName>
) => {
  const { ReadView, EditView } = props;
  const formMethods = useFormContext();

  const readViewProps: RadioInputReadViewProps<
    OptionValueName,
    OptionLabelName
  > = {
    inputValue: formMethods.getValues(props.name),
    optionLabelName: props.optionLabelName,
    label: props.label,
    noValueMessage: props.noValueMessage,
  };

  const editViewProps: RadioInputEditViewProps<
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
      <RadioInputReadView<OptionValueName, OptionLabelName>
        {...readViewProps}
      />
    )
  ) : EditView ? (
    <EditView {...editViewProps} />
  ) : (
    <RadioInputEditView<FormKeyNames, OptionValueName, OptionLabelName>
      {...editViewProps}
    />
  );
};

export default RadioInputField;
