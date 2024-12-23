import { render, screen } from "@testing-library/react";
import { SelectOption } from "./types";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it, vi } from "vitest";
import SelectEditView, { getErrorText, SelectEditViewProps } from "./EditView";
import userEvent from "@testing-library/user-event";
import { Button } from "@chakra-ui/react";
import { omit } from "../utils";

const SelectEditViewWrapper = <
  N extends string = string,
  V extends string = "value",
  L extends string = "label"
>(
  props: Omit<SelectEditViewProps<N, V, L>, "formMethods"> & {
    onValidFn?: (data: any) => undefined;
    onInvalidFn?: (errors: FieldErrors<any>) => undefined;
    defaultValue?: any;
  }
) => {
  const formSchema = z.object({
    userSelection: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .passthrough()
      .array()
      .min(1, { message: "Must select an option." }),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSelection: props.defaultValue ?? undefined,
    },
  });
  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(props.onValidFn!, props.onInvalidFn)}
    >
      <SelectEditView<N, V, L>
        {...omit(props, ["onInvalidFn", "onValidFn", "defaultValue"])}
        formMethods={methods}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

describe("Select/EditView", () => {
  const exampleOptions: SelectOption[] = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ];

  const selectFieldProps: Omit<
    SelectEditViewProps<"userSelection", "value", "label">,
    "formMethods"
  > = {
    label: "Choose an option",
    name: "userSelection",
    options: exampleOptions,
    placeholder: "Select an option",
    isMulti: true,
    clearable: true,
    size: "md",
    onChange: (_val) => undefined,
    onBlur: () => undefined,
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
        <SelectEditViewWrapper {...selectFieldProps} createable={false} />
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
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper<"userSelection", "id", "name">
          {...omit(selectFieldProps, ["options"])}
          options={[{ name: "Option 1", id: "1" }]}
          onChange={mockOnChange}
          optionLabelName="name"
          optionValueName="id"
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const selectTrigger = screen.getByRole("combobox");

    await userEvent.click(selectTrigger);
    expect(screen.getAllByTestId("selectOption").length).toBe(1);

    const filterCreateInput = screen.getByRole("textbox");
    await userEvent.type(filterCreateInput, "Option 3");
    await userEvent.keyboard("{Enter}");

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith([
      {
        name: "Option 3",
        id: "Option 3",
      },
    ]);
    expect(screen.getAllByTestId("selectOption").length).toBe(2);

    const option3 = screen.getByRole("option", { selected: true });
    expect(option3.textContent === "Option 3");

    await userEvent.click(screen.getByText("Option 1"));
    expect(screen.getAllByRole("option", { selected: true }).length).toBe(2);
  });

  it("SelectEditField single select can choose option", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          placeholder={undefined}
          required={undefined}
          createable={undefined}
          searchable={undefined}
          onChange={mockOnChange}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const selectTrigger = screen.getByRole("combobox");

    await userEvent.click(selectTrigger);
    expect(screen.getAllByTestId("selectOption").length).toBe(2);

    const option1 = screen.getAllByRole("option")[0];
    await userEvent.click(option1);

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({
      label: "Option 1",
      value: "1",
    });
    expect(screen.getAllByText("Option 1").length).toBe(2);
  });

  it("SelectEditField can create with single select", async () => {
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          searchable={false}
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

  it("SelectEditField multi select should show error for wrong data", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          onValidFn={mockOnValid}
          onInvalidFn={mockOnInvalid}
          defaultValue={[]}
        />
      </Provider>
    );

    await userEvent.click(screen.getByText("Submit"));
    expect(screen.getByText("Must select an option.")).toBeInTheDocument();
    expect(mockOnValid).not.toHaveBeenCalled();
    expect(mockOnInvalid).toHaveBeenCalled();
    expect(mockOnInvalid.mock.calls[0][0]).to.deep.equal({
      userSelection: {
        message: "Must select an option.",
        type: "too_small",
        ref: {
          name: "userSelection",
        },
      },
    });
  });

  it("SelectEditField multi select should submit correctly", async () => {
    const mockOnValid = vi.fn();
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          onValidFn={mockOnValid}
          onBlur={mockOnBlur}
        />
      </Provider>
    );
    const selectTrigger = screen.getByRole("combobox");

    await userEvent.click(selectTrigger);
    await userEvent.click(screen.getAllByTestId("selectOption")[0]);
    await userEvent.click(screen.getAllByTestId("selectOption")[1]);
    await userEvent.click(screen.getByText("Submit"));

    expect(mockOnBlur).toHaveBeenCalled();
    expect(mockOnValid).toHaveBeenCalled();
    expect(mockOnValid.mock.calls[0][0]).to.deep.equal({
      userSelection: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ],
    });
  });
});

describe("Select/EditView/getErrorText", () => {
  it("should return an empty string if errorObj[baseKeyName] is undefined", () => {
    const errors: FieldErrors = {};
    const result = getErrorText(errors, "fieldName", "valueKey", "labelKey");
    expect(result).toBe("");
  });

  it("should return the message if errorObj[baseKeyName] is a FieldError", async () => {
    const errors: FieldErrors = {
      fieldName: { message: "This is an error message" } as FieldError,
    };
    const result = getErrorText(errors, "fieldName", "valueKey", "labelKey");
    expect(result).toBe("This is an error message");
  });

  it("should return expected keys message if errorObj[baseKeyName] is an array of FieldErrors", async () => {
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

  it("should return expected keys message if errorObj[baseKeyName] is a Record<string, FieldError>", async () => {
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
