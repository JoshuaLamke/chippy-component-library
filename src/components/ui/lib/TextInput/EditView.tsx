import { Field } from "../../field";
import { Controller, UseFormReturn } from "react-hook-form";
import { TextInputFieldProps } from "./Field";
import LabelWithTooltip from "../Tooltip/LabelWithTooltip";
import { Input } from "@chakra-ui/react";

export interface TextInputEditViewProps<FormKeyNames extends string = string>
  extends Omit<
    TextInputFieldProps<FormKeyNames>,
    "EditView" | "ReadView" | "state" | "noValueMessage"
  > {
  formMethods: UseFormReturn<any>;
}

const TextInputEditView = <FormKeyNames extends string = string>({
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
}: TextInputEditViewProps<FormKeyNames>) => {
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
            type="text"
            size={size}
            value={field.value ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              field.onChange(newValue);
              onChange?.(newValue);
            }}
            onBlur={() => {
              field.onBlur();
              onBlur?.();
            }}
            {...props}
            placeholder={placeholder}
          />
        )}
      />
    </Field>
  );
};

export default TextInputEditView;
