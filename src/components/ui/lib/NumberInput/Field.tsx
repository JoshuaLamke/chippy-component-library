import { useFormContext } from "react-hook-form";
import { TooltipProps } from "../../tooltip";
import { DefaultTipIconProps } from "../Icons/DefaultTipIcon";
import NumberInputReadView, { NumberInputReadViewProps } from "./ReadView";
import NumberInputEditView, { NumberInputEditViewProps } from "./EditView";
import { omit } from "@/components/ui/lib/utils";

export interface NumberInputFieldProps<FormKeyNames extends string = string> {
  label?: React.ReactNode;
  name: FormKeyNames;
  placeholder?: string;
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  onChange?: (val: number) => void;
  onBlur?: () => void;
  state?: "read" | "edit";
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  warningText?: string;
  tooltip?: {
    content: React.ReactNode;
    Icon?: React.ReactElement<HTMLButtonElement>;
    defaultIconProps?: DefaultTipIconProps;
    tooltipProps?: Omit<TooltipProps, "children" | "content">;
  };
  ReadView?: React.FunctionComponent<NumberInputReadViewProps>;
  EditView?: React.FunctionComponent<NumberInputEditViewProps<FormKeyNames>>;
  noValueMessage?: string;
}

const NumberInputField = <FormKeyNames extends string = string>(
  props: NumberInputFieldProps<FormKeyNames>
) => {
  const { ReadView, EditView } = props;
  const formMethods = useFormContext();

  const readViewProps: NumberInputReadViewProps = {
    inputValue: formMethods.getValues(props.name),
    label: props.label,
    noValueMessage: props.noValueMessage,
  };

  const editViewProps: NumberInputEditViewProps<FormKeyNames> = {
    ...omit(props, ["ReadView", "EditView", "state", "noValueMessage"]),
    formMethods,
  };

  return props.state === "read" ? (
    ReadView ? (
      <ReadView {...readViewProps} />
    ) : (
      <NumberInputReadView {...readViewProps} />
    )
  ) : EditView ? (
    <EditView {...editViewProps} />
  ) : (
    <NumberInputEditView<FormKeyNames> {...editViewProps} />
  );
};

export default NumberInputField;
