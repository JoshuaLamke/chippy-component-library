import { Field } from "../../field";
import { Controller, UseFormReturn } from "react-hook-form";
import { MaskedTextInputFieldProps } from "./Field";
import LabelWithTooltip from "../Tooltip/LabelWithTooltip";
import { Input } from "@chakra-ui/react";
import { InputMask, Mask } from "@react-input/mask";
import { format } from "../utils";

export interface MaskedTextInputEditViewProps<
  FormKeyNames extends string = string
> extends Omit<
    MaskedTextInputFieldProps<FormKeyNames>,
    "EditView" | "ReadView" | "state" | "noValueMessage"
  > {
  formMethods: UseFormReturn<any>;
}

const MaskedTextInputEditView = <FormKeyNames extends string = string>({
  label,
  name,
  size,
  onChange,
  onBlur,
  formMethods,
  required,
  helperText,
  warningText,
  tooltip,
  maskOptions,
  ...props
}: MaskedTextInputEditViewProps<FormKeyNames>) => {
  const {
    formState: { errors },
    control,
  } = formMethods;
  const { unformat } = new Mask(maskOptions);
  const formatInputValue = (inputValue: string) =>
    format(inputValue, {
      mask: maskOptions.mask,
      replacement: maskOptions.replacement,
      separate: maskOptions.separate,
      showMask: maskOptions.showMask,
    });

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
          <InputMask
            component={Input}
            {...props}
            {...maskOptions}
            value={formatInputValue(field.value ?? "")}
            size={size}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = unformat(e.target.value);
              field.onChange(newValue);
              onChange?.(newValue);
            }}
            onBlur={() => {
              field.onBlur();
              onBlur?.();
            }}
          />
        )}
      />
    </Field>
  );
};

export default MaskedTextInputEditView;
