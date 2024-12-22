import { Field } from "../../field";
import { Controller, UseFormReturn } from "react-hook-form";
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
    control,
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
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...props}
            type="number"
            size={size}
            value={formatFromNumber(field.value)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = formatToNumber(e.target.value);
              field.onChange(newValue);
              onChange?.(newValue);
            }}
            onBlur={() => {
              field.onBlur();
              onBlur?.();
            }}
            placeholder={placeholder}
          />
        )}
      />
    </Field>
  );
};

const formatToNumber = (value: string) => {
  if (!value) {
    return NaN;
  }
  return Number(value);
};

const formatFromNumber = (value: number | undefined) => {
  if (!value) {
    return "";
  }
  return String(value);
};

export default NumberInputEditView;
