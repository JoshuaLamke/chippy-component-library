import { Field } from "../../field";
import {
  Controller,
  ControllerRenderProps,
  UseFormReturn,
} from "react-hook-form";
import { MaskedTextInputFieldProps } from "./Field";
import LabelWithTooltip from "../Tooltip/LabelWithTooltip";
import { Input } from "@chakra-ui/react";

export const changeCursorIndex = (
  e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
  idx: number
) => {
  requestAnimationFrame(() => {
    e.target.setSelectionRange(idx, idx);
  });
};

export interface MaskedTextInputEditViewProps<
  FormKeyNames extends string = string
> extends Omit<
    MaskedTextInputFieldProps<FormKeyNames>,
    "EditView" | "ReadView" | "state" | "noValueMessage"
  > {
  formMethods: UseFormReturn<any>;
}

export const handleCursorForward =
  (maskPlaceholder: string, maskSlotChar: string) =>
  (e: React.ChangeEvent<HTMLInputElement>, currCursorIdx: number) => {
    const lastSlotIdx = maskPlaceholder.lastIndexOf(maskSlotChar);
    let nextCursorIdx = currCursorIdx;
    while (
      nextCursorIdx < lastSlotIdx &&
      maskPlaceholder[nextCursorIdx] !== maskSlotChar
    ) {
      nextCursorIdx++;
    }
    changeCursorIndex(e, nextCursorIdx);
  };

export const handleCursorBack =
  (maskPlaceholder: string, maskSlotChar: string) =>
  (e: React.ChangeEvent<HTMLInputElement>, currCursorIdx: number) => {
    const firstSlotIdx = maskPlaceholder.indexOf(maskSlotChar);
    const nextCursorIdx =
      currCursorIdx < firstSlotIdx ? firstSlotIdx : currCursorIdx;
    changeCursorIndex(e, nextCursorIdx);
  };

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
  maskPlaceholder,
  maskSlotChar,
  formatFromDisplayValue,
  formatToDisplayValue,
  ...props
}: MaskedTextInputEditViewProps<FormKeyNames>) => {
  const {
    formState: { errors },
    control,
  } = formMethods;

  const handleMaskInputOnFocus =
    (field: ControllerRenderProps<any, FormKeyNames>) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      const lastSlotIdx = maskPlaceholder.lastIndexOf(maskSlotChar);
      const nextSlot = formatToDisplayValue(
        field.value ?? "",
        maskPlaceholder,
        maskSlotChar
      ).indexOf(maskSlotChar);
      const nextCursorIdx = nextSlot === -1 ? lastSlotIdx + 1 : nextSlot;
      changeCursorIndex(e, nextCursorIdx);
    };

  const handleMaskInputOnChange =
    (field: ControllerRenderProps<any, FormKeyNames>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.substring(0, maskPlaceholder.length);
      const currCursorIdx = e.target.selectionStart as number;
      const isBackspace =
        inputValue.length <
        formatToDisplayValue(field.value ?? "", maskPlaceholder, maskSlotChar)
          .length;
      const storedValue = formatFromDisplayValue(inputValue);

      // Handle cursor movement through mask slots
      if (isBackspace) {
        const moveCursorBack = handleCursorBack(maskPlaceholder, maskSlotChar);
        moveCursorBack(e, currCursorIdx);
      } else {
        const moveCursorForward = handleCursorForward(
          maskPlaceholder,
          maskSlotChar
        );
        moveCursorForward(e, currCursorIdx);
      }

      onChange?.(storedValue);
      field.onChange(storedValue);
    };

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
            name={field.name}
            {...props}
            placeholder={maskPlaceholder}
            value={formatToDisplayValue(
              field.value ?? "",
              maskPlaceholder,
              maskSlotChar
            )}
            onFocus={handleMaskInputOnFocus(field)}
            onChange={handleMaskInputOnChange(field)}
            onBlur={() => {
              onBlur?.();
              field.onBlur();
            }}
          />
        )}
      />
    </Field>
  );
};

export default MaskedTextInputEditView;
