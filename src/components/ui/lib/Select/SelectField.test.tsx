import { render, screen } from "@testing-library/react";
import SelectField, { SelectFieldProps } from "./Field";
import { SelectOption } from "./types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";

const FieldWrapper = (
  props: SelectFieldProps<"userSelection", "value", "label">
) => {
  const formSchema = z.object({
    userSelection: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .passthrough()
      .array()
      .min(1),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSelection: undefined,
    },
  });
  return (
    <FormProvider {...methods}>
      <SelectField {...props} />
    </FormProvider>
  );
};

describe("Select/Field", () => {
  const exampleOptions: SelectOption[] = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ];

  const selectFieldProps: SelectFieldProps<"userSelection", "value", "label"> =
    {
      label: "Choose an option",
      name: "userSelection",
      options: exampleOptions,
      placeholder: "Select an option",
      isMulti: true,
      clearable: true,
      size: "md",
      onChange: (val) => console.log(val),
      onBlur: () => console.log("Field blurred"),
      state: "edit",
      readOnly: false,
      disabled: false,
      required: true,
      createable: true,
      searchable: true,
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
  it("SelectField should render with edit state", () => {
    render(
      <Provider>
        <FieldWrapper {...selectFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("SelectField should render with alternative editView", () => {
    render(
      <Provider>
        <FieldWrapper
          {...selectFieldProps}
          EditView={() => <>Other Edit View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Edit View")).toBeInTheDocument();
  });

  it("SelectField should render in read state", () => {
    render(
      <Provider>
        <FieldWrapper {...selectFieldProps} state="read" />
      </Provider>
    );
    expect(screen.getByText("None Selected")).toBeInTheDocument();
  });

  it("SelectField should render with alternative ReadView", () => {
    render(
      <Provider>
        <FieldWrapper
          {...selectFieldProps}
          state="read"
          ReadView={() => <>Other Read View</>}
        />
      </Provider>
    );
    expect(screen.getByText("Other Read View")).toBeInTheDocument();
  });
});
