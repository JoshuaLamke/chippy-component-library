import { render, screen } from "@testing-library/react";
import { SelectOption } from "./types";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it, vi } from "vitest";
import SelectEditView, { getErrorText } from "./EditView";
import { SelectFieldProps } from "./Field";
import userEvent from "@testing-library/user-event";

const SelectEditViewWrapper = (
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
  return <SelectEditView {...props} formMethods={methods} />;
};

describe("Select/EditView", () => {
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
      onChange: (_val) => undefined,
      onBlur: () => undefined,
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

  it("SelectEditField should filter options correctly", async () => {
    render(
      <Provider>
        <SelectEditViewWrapper {...selectFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const selectTrigger = screen.getByRole("combobox");

    await userEvent.click(selectTrigger);
    expect(screen.getAllByTestId("selectOption").length).toBe(2);

    const filterCreateInput = screen.getByRole("textbox");
    await userEvent.type(filterCreateInput, "Option 2");

    expect(screen.getAllByTestId("selectOption").length).toBe(1);
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.queryByText("Option 1")).toBeNull();
  });

  it("SelectEditField should create option correctly", async () => {
    render(
      <Provider>
        <SelectEditViewWrapper {...selectFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const selectTrigger = screen.getByRole("combobox");

    await userEvent.click(selectTrigger);
    expect(screen.getAllByTestId("selectOption").length).toBe(2);

    const filterCreateInput = screen.getByRole("textbox");
    await userEvent.type(filterCreateInput, "Option 3");
    await userEvent.keyboard("{Enter}");

    expect(screen.getAllByTestId("selectOption").length).toBe(3);
    const option3 = screen.getByRole("option", { selected: true });
    expect(option3.textContent === "Option 3");

    await userEvent.click(screen.getByText("Option 1"));
    expect(screen.getAllByRole("option", { selected: true }).length).toBe(2);
  });

  it("SelectEditField single select can choose option", async () => {
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          onBlur={mockOnBlur}
          placeholder={undefined}
          required={undefined}
          createable={undefined}
          searchable={undefined}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const selectTrigger = screen.getByRole("combobox");

    await userEvent.click(selectTrigger);
    expect(screen.getAllByTestId("selectOption").length).toBe(2);

    const option1 = screen.getAllByRole("option")[0];
    await userEvent.click(option1);

    expect(screen.getAllByText("Option 1").length).toBe(2);
  });

  it("SelectEditField can create with single select", async () => {
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          searchable={false}
          onBlur={mockOnBlur}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const selectTrigger = screen.getByRole("combobox");

    await userEvent.click(selectTrigger);
    expect(screen.getAllByTestId("selectOption").length).toBe(2);

    const filterCreateInput = screen.getByRole("textbox");
    await userEvent.type(filterCreateInput, "Option 3");
    await userEvent.keyboard("{Enter}");

    expect(screen.getAllByTestId("selectOption").length).toBe(3);
    const option3 = screen.getByRole("option", { selected: true });
    expect(option3.textContent === "Option 3");
  });
});

describe("Select/EditView/getErrorText", () => {
  it("should return an empty string if errorObj[baseKeyName] is undefined", () => {
    const errors: FieldErrors = {};
    const result = getErrorText(errors, "fieldName", "valueKey", "labelKey");
    expect(result).toBe("");
  });

  it("should return the message if errorObj[baseKeyName] is a FieldError", () => {
    const errors: FieldErrors = {
      fieldName: { message: "This is an error message" } as FieldError,
    };
    const result = getErrorText(errors, "fieldName", "valueKey", "labelKey");
    expect(result).toBe("This is an error message");
  });

  it("should return expected keys message if errorObj[baseKeyName] is an array of FieldErrors", () => {
    const errors = {
      fieldName: [
        {
          otherFieldKey: { message: "Error" },
          otherFieldLabel: { message: "Error" },
        } as any,
        {
          otherFieldKey: { message: "Error" },
          otherFieldLabel: { message: "Error" },
        } as any,
      ] as any,
    };
    const result = getErrorText(errors, "fieldName", "valueKey", "labelKey");
    expect(result).toBe(
      "Expecting option(s) to have keys: otherFieldKey, otherFieldLabel. Received keys: valueKey, labelKey."
    );
  });

  it("should return expected keys message if errorObj[baseKeyName] is a Record<string, FieldError>", () => {
    const errors: FieldErrors = {
      fieldName: {
        key1: { message: "Error in key1" } as any,
        key2: { message: "Error in key2" } as any,
      },
    };
    const result = getErrorText(errors, "fieldName", "valueKey", "labelKey");
    expect(result).toBe(
      "Expecting option(s) to have keys: key1, key2. Received keys: valueKey, labelKey."
    );
  });
});
