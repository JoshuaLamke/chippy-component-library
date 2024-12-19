import { Field } from "../../field";
import { UseFormReturn } from "react-hook-form";
import { NumberInputFieldProps } from "./Field";
import LabelWithTooltip from "../Tooltip/LabelWithTooltip";
import { Input } from "@chakra-ui/react";

export interface NumberInputEditViewProps<FormKeyNames extends string = string>
  extends Omit<
    NumberInputFieldProps<FormKeyNames>,
    "EditView" | "ReadView" | "state" | "noValueMessage"
  > {
  formMethods: UseFormReturn<any>;
}

const NumberInputEditView = <FormKeyNames extends string = string>({
  label,
  name,
  placeholder,
  size,
  onChange,
  onBlur,
  formMethods,
  required,
  helperText,
  warningText,
  tooltip,
  ...props
}: NumberInputEditViewProps<FormKeyNames>) => {
  const {
    formState: { errors },
    register,
  } = formMethods;

  return (
    <Field
      label={<LabelWithTooltip tooltip={tooltip} label={label} />}
      invalid={!!errors[name]}
      errorText={errors[name]?.message as string}
      required={required}
      helperText={helperText}
      warningText={warningText}
    >
      <Input
        type="number"
        size={size}
        {...register(name, {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            onChange?.(sanitizeChangeValue(e.target.value)),
          onBlur: () => onBlur?.(),
          setValueAs: sanitizeChangeValue,
        })}
        {...props}
        placeholder={placeholder}
      />
    </Field>
  );
};

const sanitizeChangeValue = (value: string) => {
  if (!value) {
    return undefined;
  }
  return Number(value);
};

export default NumberInputEditView;
