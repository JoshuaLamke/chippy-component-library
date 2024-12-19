import { useFormContext } from "react-hook-form";
import { TooltipProps } from "../../tooltip";
import { DefaultTipIconProps } from "../Tooltip/DefaultTipIcon";
import MaskedTextInputReadView, {
  MaskedTextInputReadViewProps,
} from "./ReadView";
import MaskedTextInputEditView, {
  MaskedTextInputEditViewProps,
} from "./EditView";
import { omit } from "@/components/ui/lib/utils";

export interface MaskedTextInputFieldProps<
  FormKeyNames extends string = string
> {
  label?: React.ReactNode;
  name: FormKeyNames;
  maskPlaceholder: string;
  maskSlotChar: string;
  formatToDisplayValue: (
    storedValue: string,
    maskPlaceholder: string,
    maskSlotChar: string
  ) => string;
  formatFromDisplayValue: (displayValue: string) => string;
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
  ReadView?: React.FunctionComponent<MaskedTextInputReadViewProps>;
  EditView?: React.FunctionComponent<
    MaskedTextInputEditViewProps<FormKeyNames>
  >;
  noValueMessage?: string;
}

const MaskedTextInputField = <FormKeyNames extends string = string>(
  props: MaskedTextInputFieldProps<FormKeyNames>
) => {
  const { ReadView, EditView } = props;
  const formMethods = useFormContext();

  const readViewProps: MaskedTextInputReadViewProps = {
    inputValue: formMethods.getValues(props.name),
    label: props.label,
    noValueMessage: props.noValueMessage,
    formatToDisplayValue: props.formatToDisplayValue,
    maskPlaceholder: props.maskPlaceholder,
    maskSlotChar: props.maskSlotChar,
  };

  const editViewProps: MaskedTextInputEditViewProps<FormKeyNames> = {
    ...omit(props, ["ReadView", "EditView", "state", "noValueMessage"]),
    formMethods,
  };

  return props.state === "read" ? (
    ReadView ? (
      <ReadView {...readViewProps} />
    ) : (
      <MaskedTextInputReadView {...readViewProps} />
    )
  ) : EditView ? (
    <EditView {...editViewProps} />
  ) : (
    <MaskedTextInputEditView<FormKeyNames> {...editViewProps} />
  );
};

export default MaskedTextInputField;
