import { render, screen } from "@testing-library/react";
import PhoneNumberInputField, { PhoneNumberInputFieldProps } from "./Field";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../../provider";
import { describe, expect, it } from "vitest";

const FieldWrapper = (props: PhoneNumberInputFieldProps<"phone">) => {
  const formSchema = z.object({
    phone: z.string(),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: undefined,
    },
  });
  return (
    <FormProvider {...methods}>
      <PhoneNumberInputField {...props} />
    </FormProvider>
  );
};

describe("MaskedTextInput/PhoneNumberInput/Field", () => {
  const maskedTextInputFieldProps: PhoneNumberInputFieldProps<"phone"> = {
    label: "Write phone number",
    name: "phone",
    size: "md",
    onChange: (val) => console.log(val),
    onBlur: () => console.log("Field blurred"),
    state: "edit",
    readOnly: false,
    disabled: false,
    required: true,
    helperText: "Please write phone number",
    warningText: "Warning: This is a required field",
    tooltip: {
      content: "This is a tooltip",
      Icon: <button>Info</button>,
      defaultIconProps: { color: "blue" },
    },
    maskOptions: {
      showMask: true,
    },
  };

  it("PhoneNumberInputField should render correctly in edit state", async () => {
    render(
      <Provider>
        <FieldWrapper {...maskedTextInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Write phone number")).toBeInTheDocument();
  });

  it("PhoneNumberInputField should render in read state", async () => {
    render(
      <Provider>
        <FieldWrapper {...maskedTextInputFieldProps} state="read" />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("PhoneNumberInputField should render correct mask with country code for international format", async () => {
    render(
      <Provider>
        <FieldWrapper
          {...maskedTextInputFieldProps}
          countryCode="44"
          phoneNumberFormat="International (With Country Code)"
          maskOptions={{
            showMask: true,
          }}
        />
      </Provider>
    );
    const phoneNumberInput = screen.getByRole("textbox");
    expect(phoneNumberInput).toHaveValue("+44 (___) ___ ____");
  });

  it("PhoneNumberInputField should render correct mask for standard format", async () => {
    render(
      <Provider>
        <FieldWrapper
          {...maskedTextInputFieldProps}
          countryCode="44"
          phoneNumberFormat="Standard (With Parentheses)"
          maskOptions={{
            showMask: true,
          }}
        />
      </Provider>
    );
    const phoneNumberInput = screen.getByRole("textbox");
    expect(phoneNumberInput).toHaveValue("(___) ___ ____");
  });

  it("PhoneNumberInputField should render correct mask for dashed default format", async () => {
    render(
      <Provider>
        <FieldWrapper
          {...maskedTextInputFieldProps}
          maskOptions={{
            showMask: true,
          }}
        />
      </Provider>
    );
    const phoneNumberInput = screen.getByRole("textbox");
    expect(phoneNumberInput).toHaveValue("___-___-____");
  });
});
