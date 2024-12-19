import { render, screen } from "@testing-library/react";
import TextInputField, { TextInputFieldProps } from "./Field";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";

const FieldWrapper = (props: TextInputFieldProps<"userText">) => {
  const formSchema = z.object({
    userText: z.string(),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userText: undefined,
    },
  });
  return (
    <FormProvider {...methods}>
      <TextInputField {...props} />
    </FormProvider>
  );
};

describe("TextInput/Field", () => {
  const textInputFieldProps: TextInputFieldProps<"userText"> = {
    label: "Write some text",
    name: "userText",
    placeholder: "Write some text",
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
  };

  it("textInputField should render with edit state", () => {
    render(
      <Provider>
        <FieldWrapper {...textInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Write some text")).toBeInTheDocument();
  });

  it("textInputField should render with alternative editView", () => {
    render(
      <Provider>
        <FieldWrapper
          {...textInputFieldProps}
          EditView={() => <>Other Edit View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Edit View")).toBeInTheDocument();
  });

  it("textInputField should render in read state", () => {
    render(
      <Provider>
        <FieldWrapper {...textInputFieldProps} state="read" />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("textInputField should render with alternative ReadView", () => {
    render(
      <Provider>
        <FieldWrapper
          {...textInputFieldProps}
          state="read"
          ReadView={() => <>Other Read View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Read View")).toBeInTheDocument();
  });
});
