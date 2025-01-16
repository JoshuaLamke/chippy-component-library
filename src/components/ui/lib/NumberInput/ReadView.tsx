import { Box } from "@chakra-ui/react";
import { Field } from "../../field";

export interface NumberInputReadViewProps {
  inputValue?: number;
  label?: React.ReactNode;
  noValueMessage?: string;
}

const NumberInputReadView = ({
  inputValue,
  label,
  noValueMessage,
}: NumberInputReadViewProps) => {
  return (
    <Field label={label}>
      <Box color={"gray.fg"}>
        {sanitizeNumber(inputValue) || noValueMessage || "None"}
      </Box>
    </Field>
  );
};

const sanitizeNumber = (number?: Number) => {
  // If the number exists and is not NaN or undefined, stringify
  if (number || number === 0) {
    return String(number);
  }

  return undefined;
};

export default NumberInputReadView;
