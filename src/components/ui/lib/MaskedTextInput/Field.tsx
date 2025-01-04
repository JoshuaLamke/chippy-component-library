import { useFormContext } from "react-hook-form";
import { TooltipProps } from "../../tooltip";
import { DefaultTipIconProps } from "../Icons/DefaultTipIcon";
import MaskedTextInputReadView, {
  MaskedTextInputReadViewProps,
} from "./ReadView";
import MaskedTextInputEditView, {
  MaskedTextInputEditViewProps,
} from "./EditView";
import { omit } from "@/components/ui/lib/utils";
import { InputMaskProps, Replacement } from "@react-input/mask";

export interface InputMaskOptions extends InputMaskProps {
  mask: string;
  replacement: string | Replacement;
}

export interface MaskedTextInputFieldProps<
  FormKeyNames extends string = string
> {
  label?: React.ReactNode;
  name: FormKeyNames;
  maskOptions: InputMaskOptions;
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
    maskOptions: props.maskOptions,
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
