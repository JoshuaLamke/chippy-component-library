import { render, screen } from "@testing-library/react";
import RadioInputField, { RadioInputFieldProps } from "./Field";
import { SelectOption } from "..";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";

const FieldWrapper = (
  props: RadioInputFieldProps<"radioOption", "value", "label">
) => {
  const formSchema = z.object({
    radioOption: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .passthrough(),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radioOption: undefined,
    },
  });
  return (
    <FormProvider {...methods}>
      <RadioInputField {...props} />
    </FormProvider>
  );
};

describe("RadioInput/Field", async () => {
  const exampleOptions: SelectOption[] = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ];

  const radioInputFieldProps: RadioInputFieldProps<
    "radioOption",
    "value",
    "label"
  > = {
    label: "Choose an option",
    name: "radioOption",
    options: exampleOptions,
    size: "md",
    onChange: () => undefined,
    onBlur: () => undefined,
    state: "edit",
    readOnly: false,
    disabled: false,
    required: true,
    optionValueName: "value",
    optionLabelName: "label",
    helperText: "Please select an option",
    warningText: "Warning: This is a required field",
    tooltip: {
      content: "This is a tooltip",
      Icon: <button>Info</button>,
      defaultIconProps: { color: "blue" },
    },
  };

  it("RadioInputField should render with edit state", async () => {
    render(
      <Provider>
        <FieldWrapper {...radioInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("RadioInputField should render with alternative editView", async () => {
    render(
      <Provider>
        <FieldWrapper
          {...radioInputFieldProps}
          EditView={() => <>Other Edit View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Edit View")).toBeInTheDocument();
  });

  it("RadioInputField should render in read state", async () => {
    render(
      <Provider>
        <FieldWrapper {...radioInputFieldProps} state="read" />
      </Provider>
    );
    expect(screen.getByText("None Selected")).toBeInTheDocument();
  });

  it("RadioInputField should render with alternative ReadView", async () => {
    render(
      <Provider>
        <FieldWrapper
          {...radioInputFieldProps}
          state="read"
          ReadView={() => <>Other Read View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Read View")).toBeInTheDocument();
  });
});
