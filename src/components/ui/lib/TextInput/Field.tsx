import { useFormContext } from "react-hook-form";
import { TooltipProps } from "../../tooltip";
import { DefaultTipIconProps } from "../Tooltip/DefaultTipIcon";
import TextInputReadView, { TextInputReadViewProps } from "./ReadView";
import TextInputEditView, { TextInputEditViewProps } from "./EditView";
import { omit } from "@/components/ui/lib/utils";

export interface TextInputFieldProps<FormKeyNames extends string = string> {
  label?: React.ReactNode;
  name: FormKeyNames;
  placeholder?: string;
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  onChange?: (val: string) => void;
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
  ReadView?: React.FunctionComponent<TextInputReadViewProps>;
  EditView?: React.FunctionComponent<TextInputEditViewProps<FormKeyNames>>;
  noValueMessage?: string;
}

const TextInputField = <FormKeyNames extends string = string>(
  props: TextInputFieldProps<FormKeyNames>
) => {
  const { ReadView, EditView } = props;
  const formMethods = useFormContext();

  const readViewProps: TextInputReadViewProps = {
    inputValue: formMethods.getValues(props.name),
    label: props.label,
    noValueMessage: props.noValueMessage,
  };

  const editViewProps: TextInputEditViewProps<FormKeyNames> = {
    ...omit(props, ["ReadView", "EditView", "state", "noValueMessage"]),
    formMethods,
  };

  return props.state === "read" ? (
    ReadView ? (
      <ReadView {...readViewProps} />
    ) : (
      <TextInputReadView {...readViewProps} />
    )
  ) : EditView ? (
    <EditView {...editViewProps} />
  ) : (
    <TextInputEditView<FormKeyNames> {...editViewProps} />
  );
};

export default TextInputField;
