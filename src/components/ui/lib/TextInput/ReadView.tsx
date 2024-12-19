import { Box } from "@chakra-ui/react";
import { Field } from "../../field";

export interface TextInputReadViewProps {
  inputValue: string;
  label?: React.ReactNode;
  noValueMessage?: string;
}

const TextInputReadView = ({
  inputValue,
  label,
  noValueMessage,
}: TextInputReadViewProps) => {
  return (
    <Field label={label}>
      <Box color={"gray.600"}>{inputValue || noValueMessage || "None"}</Box>
    </Field>
  );
};

export default TextInputReadView;
