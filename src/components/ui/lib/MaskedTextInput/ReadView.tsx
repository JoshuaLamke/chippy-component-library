import { Box } from "@chakra-ui/react";
import { Field } from "../../field";
import { InputMaskOptions } from "./Field";
import { format } from "../utils";

export interface MaskedTextInputReadViewProps {
  inputValue: string;
  maskOptions: InputMaskOptions;
  label?: React.ReactNode;
  noValueMessage?: string;
}

const MaskedTextInputReadView = ({
  inputValue = "",
  label,
  noValueMessage,
  maskOptions,
}: MaskedTextInputReadViewProps) => {
  const formatInputValue = (inputValue: string) =>
    format(inputValue, {
      mask: maskOptions.mask,
      replacement: maskOptions.replacement,
      separate: maskOptions.separate,
      showMask: maskOptions.showMask,
    });

  const displayValue = inputValue
    ? formatInputValue(inputValue)
    : noValueMessage || "None";

  return (
    <Field label={label}>
      <Box color={"gray.fg"}>{displayValue}</Box>
    </Field>
  );
};

export default MaskedTextInputReadView;
