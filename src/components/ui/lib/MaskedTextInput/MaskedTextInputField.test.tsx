import { render, screen } from "@testing-library/react";
import MaskedTextInputField, { MaskedTextInputFieldProps } from "./Field";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";

const FieldWrapper = (props: MaskedTextInputFieldProps<"maskedUserText">) => {
  const formSchema = z.object({
    maskedUserText: z.string(),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maskedUserText: undefined,
    },
  });
  return (
    <FormProvider {...methods}>
      <MaskedTextInputField {...props} />
    </FormProvider>
  );
};

describe("MaskedTextInput/Field", () => {
  const maskedTextInputFieldProps: MaskedTextInputFieldProps<"maskedUserText"> =
    {
      label: "Write some masked text",
      name: "maskedUserText",
      size: "md",
      onChange: (val) => console.log(val),
      onBlur: () => console.log("Field blurred"),
      state: "edit",
      readOnly: false,
      disabled: false,
      required: true,
      helperText: "Please write some text",
      warningText: "Warning: This is a required field",
      tooltip: {
        content: "This is a tooltip",
        Icon: <button>Info</button>,
        defaultIconProps: { color: "blue" },
      },
      maskOptions: {
        mask: "___ __ ____",
        replacement: {
          _: /\d/,
        },
        showMask: true,
      },
    };

  it("maskedTextInputField should render with edit state", () => {
    render(
      <Provider>
        <FieldWrapper {...maskedTextInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Write some masked text")).toBeInTheDocument();
  });

  it("maskedTextInputField should render with alternative editView", () => {
    render(
      <Provider>
        <FieldWrapper
          {...maskedTextInputFieldProps}
          EditView={() => <>Other Edit View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Edit View")).toBeInTheDocument();
  });

  it("maskedTextInputField should render in read state", () => {
    render(
      <Provider>
        <FieldWrapper {...maskedTextInputFieldProps} state="read" />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("maskedTextInputField should render with alternative ReadView", () => {
    render(
      <Provider>
        <FieldWrapper
          {...maskedTextInputFieldProps}
          state="read"
          ReadView={() => <>Other Read View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Read View")).toBeInTheDocument();
  });
});
