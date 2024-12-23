import MaskedTextInputField, {
  InputMaskOptions,
  MaskedTextInputFieldProps,
} from "../Field";

export interface SSNInputFieldProps<FormKeyNames extends string = string>
  extends Omit<MaskedTextInputFieldProps<FormKeyNames>, "maskOptions"> {
  maskOptions: Omit<InputMaskOptions, "mask" | "replacement">;
}

const SSNInputField = <FormKeyNames extends string = string>({
  maskOptions,
  ...props
}: SSNInputFieldProps<FormKeyNames>) => {
  return (
    <MaskedTextInputField<FormKeyNames>
      {...props}
      maskOptions={{
        ...maskOptions,
        mask: "___-__-____",
        replacement: { _: /\d/ },
      }}
    />
  );
};

export default SSNInputField;
