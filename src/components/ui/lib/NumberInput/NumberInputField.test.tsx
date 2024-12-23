import { render, screen } from "@testing-library/react";
import NumberInputField, { NumberInputFieldProps } from "./Field";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";

const FieldWrapper = (props: NumberInputFieldProps<"userNumber">) => {
  const formSchema = z.object({
    userNumber: z.number().optional(),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userNumber: undefined,
    },
  });
  return (
    <FormProvider {...methods}>
      <NumberInputField {...props} />
    </FormProvider>
  );
};

describe("NumberInput/Field", () => {
  const numberInputFieldProps: NumberInputFieldProps<"userNumber"> = {
    label: "Write some number",
    name: "userNumber",
    placeholder: "Write a number",
    size: "md",
    onChange: (val) => console.log(val),
    onBlur: () => console.log("Field blurred"),
    state: "edit",
    readOnly: false,
    disabled: false,
    required: true,
    helperText: "Please write a number",
    warningText: "Warning: This is a required field",
    tooltip: {
      content: "This is a tooltip",
      Icon: <button>Info</button>,
      defaultIconProps: { color: "blue" },
    },
  };

  it("numberInputField should render with edit state", async () => {
    render(
      <Provider>
        <FieldWrapper {...numberInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Write some number")).toBeInTheDocument();
  });

  it("numberInputField should render with alternative editView", async () => {
    render(
      <Provider>
        <FieldWrapper
          {...numberInputFieldProps}
          EditView={() => <>Other Edit View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Edit View")).toBeInTheDocument();
  });

  it("numberInputField should render in read state", async () => {
    render(
      <Provider>
        <FieldWrapper {...numberInputFieldProps} state="read" />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("numberInputField should render with alternative ReadView", async () => {
    render(
      <Provider>
        <FieldWrapper
          {...numberInputFieldProps}
          state="read"
          ReadView={() => <>Other Read View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Read View")).toBeInTheDocument();
  });
});
