import { Replacement } from "@react-input/mask";
import MaskedTextInputField, {
  InputMaskOptions,
  MaskedTextInputFieldProps,
} from "../Field";

export type PhoneNumberMaskFormatsTypes =
  | "Standard (With Parentheses)"
  | "International (With Country Code)"
  | "Dashed (No Parentheses)";

export const getPhoneNumberMaskFormatOptions = (
  countryCode?: string
): Record<
  PhoneNumberMaskFormatsTypes,
  { mask: string; replacement: Replacement }
> => ({
  "Standard (With Parentheses)": {
    mask: "(___) ___ ____",
    replacement: {
      _: /\d/,
    },
  },
  "International (With Country Code)": {
    mask: `${countryCode && `+${countryCode} `}(___) ___ ____`,
    replacement: {
      _: /\d/,
    },
  },
  "Dashed (No Parentheses)": {
    mask: "___-___-____",
    replacement: {
      _: /\d/,
    },
  },
});

export interface PhoneNumberInputFieldProps<
  FormKeyNames extends string = string
> extends Omit<MaskedTextInputFieldProps<FormKeyNames>, "maskOptions"> {
  maskOptions: Omit<InputMaskOptions, "mask" | "replacement">;
  countryCode?: string;
  phoneNumberFormat?: PhoneNumberMaskFormatsTypes;
}

const PhoneNumberInputField = <FormKeyNames extends string = string>({
  maskOptions,
  countryCode,
  phoneNumberFormat,
  ...props
}: PhoneNumberInputFieldProps<FormKeyNames>) => {
  return (
    <MaskedTextInputField<FormKeyNames>
      {...props}
      maskOptions={{
        ...maskOptions,
        ...getPhoneNumberMaskFormatOptions(countryCode)[
          phoneNumberFormat ?? "Dashed (No Parentheses)"
        ],
      }}
    />
  );
};

export default PhoneNumberInputField;
