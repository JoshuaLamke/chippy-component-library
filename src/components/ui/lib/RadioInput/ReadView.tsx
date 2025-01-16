import { SelectOption } from "..";
import { Field } from "../../field";
import { Box } from "@chakra-ui/react";

export interface RadioInputReadViewProps<
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> {
  inputValue?: null | SelectOption<OptionValueName, OptionLabelName>;
  label?: React.ReactNode;
  optionLabelName: OptionLabelName;
  noValueMessage?: string;
}

const RadioInputReadView = <
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  inputValue,
  label,
  optionLabelName,
  noValueMessage,
}: RadioInputReadViewProps<OptionValueName, OptionLabelName>) => {
  if (!inputValue) {
    return (
      <Field label={label}>
        <Box
          color={"gray.fg"}
          flexWrap={"wrap"}
          overflow={"hidden"}
          width={"full"}
        >
          {noValueMessage || "None Selected"}
        </Box>
      </Field>
    );
  }

  return (
    <Field label={label} width={"full"}>
      <Box
        color={"gray.fg"}
        flexWrap={"wrap"}
        overflow={"hidden"}
        width={"full"}
      >
        {inputValue[optionLabelName]}
      </Box>
    </Field>
  );
};

export default RadioInputReadView;
