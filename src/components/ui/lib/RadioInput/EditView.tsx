import { Field } from "../../field";
import { Controller, UseFormReturn } from "react-hook-form";
import { calculateContainerBorderStyles, getErrorText, SelectOption } from "..";
import { RadioInputFieldProps } from "./Field";
import LabelWithTooltip from "../Tooltip/LabelWithTooltip";
import { Radio, RadioGroup } from "../../radio";
import { Box, HStack } from "@chakra-ui/react";
import { useRef, useState } from "react";

export interface RadioInputEditViewProps<
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> extends Omit<
    RadioInputFieldProps<FormKeyNames, OptionValueName, OptionLabelName>,
    "EditView" | "ReadView" | "state" | "noValueMessage"
  > {
  formMethods: UseFormReturn<any>;
}

const RadioInputEditView = <
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  label,
  name,
  formMethods,
  required,
  helperText,
  warningText,
  tooltip,
  optionValueName,
  optionLabelName,
  size,
  options,
  onBlur,
  onChange,
  ...props
}: RadioInputEditViewProps<FormKeyNames, OptionValueName, OptionLabelName>) => {
  const {
    formState: { errors },
    control,
  } = formMethods;

  const isInvalid = !!errors[name];

  const radioRefs = useRef<HTMLInputElement[] | null[]>(
    new Array(options.length).fill(null)
  );

  return (
    <Field
      label={<LabelWithTooltip tooltip={tooltip} label={label} />}
      invalid={isInvalid}
      errorText={getErrorText(errors, name, optionValueName, optionLabelName)}
      required={required}
      helperText={helperText}
      warningText={warningText}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const [isInputFocused, setIsInputFocused] = useState(false);

          const handleValueChange = (value: string) => {
            console.log("Value: " + value);
            console.log("Field Value: " + field.value?.[optionValueName]);
            // Unselect radio
            if (value === field.value?.[optionValueName]) {
              field.onChange(null);
              onChange?.(null);
              return;
            }
            // Select radio
            const selectedOption = options.find(
              (option) => option[optionValueName] === value
            );

            field.onChange(selectedOption);
            onChange?.(selectedOption);
          };

          const sanitizeRadioValue = (
            value?: SelectOption<OptionValueName, OptionLabelName> | null
          ) => {
            if (!value) {
              return null;
            }
            return value[optionValueName];
          };

          return (
            <RadioGroup
              width={"full"}
              {...calculateContainerBorderStyles(isInvalid, isInputFocused)}
              borderRadius={"sm"}
              padding={"2"}
              value={sanitizeRadioValue(field.value)}
              size={size}
              onBlur={() => {
                field.onBlur();
                onBlur?.();
              }}
              {...props}
            >
              <HStack gap="4" display="flex" flexWrap="wrap">
                {options.map((option, idx) => (
                  <Radio
                    ref={(el) => (radioRefs.current[idx] = el)}
                    value={option[optionValueName]}
                    key={option[optionValueName]}
                    onClick={(e) => {
                      e.preventDefault();
                      radioRefs.current[idx]?.focus();
                      handleValueChange(option[optionValueName]);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                        radioRefs.current[idx]?.focus();
                        handleValueChange(option[optionValueName]);
                      }
                    }}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                  >
                    <Box marginLeft={"-1.5"}>{option[optionLabelName]}</Box>
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>
          );
        }}
      />
    </Field>
  );
};

export default RadioInputEditView;
