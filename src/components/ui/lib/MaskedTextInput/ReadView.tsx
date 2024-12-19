import { Box } from "@chakra-ui/react";
import { Field } from "../../field";

export interface MaskedTextInputReadViewProps {
  inputValue: string;
  formatToDisplayValue: (
    storedValue: string,
    maskPlaceholder: string,
    maskSlotChar: string
  ) => string;
  maskPlaceholder: string;
  maskSlotChar: string;
  label?: React.ReactNode;
  noValueMessage?: string;
}

const MaskedTextInputReadView = ({
  inputValue = "",
  label,
  noValueMessage,
  formatToDisplayValue,
  maskPlaceholder,
  maskSlotChar,
}: MaskedTextInputReadViewProps) => {
  const displayValue = inputValue
    ? formatToDisplayValue(inputValue, maskPlaceholder, maskSlotChar)
    : noValueMessage || "None";
  return (
    <Field label={label}>
      <Box color={"gray.600"}>{displayValue}</Box>
    </Field>
  );
};

export default MaskedTextInputReadView;
