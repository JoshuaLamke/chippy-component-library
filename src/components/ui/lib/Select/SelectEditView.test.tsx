import { render, screen, waitFor } from "@testing-library/react";
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
  const validation = props.isMulti
    ? z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .passthrough()
        .array()
        .min(1, { message: "Must select an option." })
    : z
        .object(
          {
            label: z.string(),
            value: z.string(),
          },
          { message: "Must select an option." }
        )
        .passthrough();

  const formSchema = z.object({
    userSelection: validation,
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
    onChange: (_val) => undefined,
    onBlur: () => undefined,
    readOnly: false,
    disabled: false,
    required: true,
    createable: true,
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
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.type(comboboxInput, "Option 2");

    expect(screen.getAllByRole("option").length).toBe(1);
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.queryByText("Option 1")).toBeNull();
  });

  it("SelectEditField should create option correctly", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper<"userSelection", "id", "name">
          {...(omit(selectFieldProps, ["options"]) as unknown as Omit<
            SelectEditViewProps<"userSelection", "id", "name">,
            "formMethods" | "options"
          >)}
          options={[{ name: "Option 1", id: "1" }]}
          onChange={mockOnChange}
          optionLabelName="name"
          optionValueName="id"
          onCreateOption={(option) => ({
            name: option.name.toUpperCase(),
            id: option.id.toUpperCase(),
          })}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(1);

    await userEvent.type(comboboxInput, "Option 3");
    const createOption = screen.getByText("Create: Option 3");
    await userEvent.click(createOption);

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith([
      {
        name: "OPTION 3",
        id: "OPTION 3",
      },
    ]);
    expect(screen.getAllByRole("option").length).toBe(2);

    const option3 = screen.getByRole("option", { selected: true });
    expect(option3.textContent === "Option 3");

    await userEvent.click(screen.getByText("Option 1"));
    await waitFor(() => {
      expect(screen.getAllByRole("option", { selected: true }).length).toBe(2);
    });
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
          onChange={mockOnChange}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);
    const listbox = screen.getByRole("listbox");
    expect(listbox.hidden).toBeFalsy();

    const option1 = screen.getAllByRole("option")[0];
    await userEvent.click(option1);

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({
      label: "Option 1",
      value: "1",
    });
    expect(screen.getAllByText("Option 1").length).toBe(2);
    expect(listbox.hidden).toBeTruthy();
    expect(document.activeElement).toBe(comboboxInput);
  });

  it("SelectEditField can create with single select", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          onChange={mockOnChange}
          onCreateOption={(option) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  label: option.label.toUpperCase(),
                  value: option.value.toUpperCase(),
                });
              }, 100);
            });
          }}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.type(comboboxInput, "Option 3");
    await userEvent.click(screen.getByText("Create: Option 3"));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith({
        label: "OPTION 3",
        value: "OPTION 3",
      });
    });

    await userEvent.click(comboboxInput);

    expect(screen.getAllByRole("option").length).toBe(3);
    const option3 = screen.getByRole("option", { selected: true });
    expect(option3.textContent === "OPTION 3");
  });

  it("SelectEditField single escape button should close listbox but keep focus on input", async () => {
    render(
      <Provider>
        <SelectEditViewWrapper {...selectFieldProps} isMulti={false} />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const listbox = screen.getByRole("listbox");
    expect(listbox.hidden).toBeFalsy();
    await userEvent.keyboard("{Escape}");
    expect(listbox.hidden).toBeTruthy();
    expect(document.activeElement).toBe(comboboxInput);
  });

  it("SelectEditField multi escape button should close listbox but keep focus on input", async () => {
    render(
      <Provider>
        <SelectEditViewWrapper {...selectFieldProps} isMulti={true} />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const listbox = screen.getByRole("listbox");
    expect(listbox.hidden).toBeFalsy();
    await userEvent.keyboard("{Escape}");
    expect(listbox.hidden).toBeTruthy();
    expect(document.activeElement).toBe(comboboxInput);
  });

  it("SelectEditField single can create with basic create function is no onCreateOption is passed in", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          onChange={mockOnChange}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.type(comboboxInput, "Option 3");
    await userEvent.click(screen.getByText("Create: Option 3"));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith({
        label: "Option 3",
        value: "option 3",
      });
    });

    await userEvent.click(comboboxInput);

    expect(screen.getAllByRole("option").length).toBe(3);
    const option3 = screen.getByRole("option", { selected: true });
    expect(option3.textContent === "option 3");
  });

  it("SelectEditField multi can create with basic create function is no onCreateOption is passed in", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.type(comboboxInput, "Option 3");
    await userEvent.click(screen.getByText("Create: Option 3"));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          label: "Option 3",
          value: "option 3",
        },
      ]);
      expect(screen.getAllByRole("option").length).toBe(3);
      const option3 = screen.getByRole("option", { selected: true });
      expect(option3.textContent === "option 3");
    });
  });

  it("SelectEditField single on blur should run when input is blurred", async () => {
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          onBlur={mockOnBlur}
        />
        <div>Click to blur</div>
      </Provider>
    );
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const outsideDiv = screen.getByText("Click to blur");
    await userEvent.click(outsideDiv);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("SelectEditField multi on blur should run when input is blurred", async () => {
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onBlur={mockOnBlur}
        />
        <div>Click to blur</div>
      </Provider>
    );
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const outsideDiv = screen.getByText("Click to blur");
    await userEvent.click(outsideDiv);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("SelectEditField single clicking clear button should remove selected option", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          onChange={mockOnChange}
        />
      </Provider>
    );
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const option1 = screen.getAllByRole("option")[0];
    await userEvent.click(option1);

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({
      label: "Option 1",
      value: "1",
    });

    const clearButton = screen.getByLabelText("Remove selected option");
    await userEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it("SelectEditField multi clicking clear button should remove selected options", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
        />
      </Provider>
    );
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const option1 = screen.getAllByRole("option")[0];
    const option2 = screen.getAllByRole("option")[1];
    await userEvent.click(option1);
    await userEvent.click(option2);

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith([
      {
        label: "Option 1",
        value: "1",
      },
      {
        label: "Option 2",
        value: "2",
      },
    ]);

    const clearButton = screen.getByLabelText("Remove all selected options");
    await userEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("SelectEditField multi clicking individual clear button should remove that selected option", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
        />
      </Provider>
    );
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const option1 = screen.getAllByRole("option")[0];
    const option2 = screen.getAllByRole("option")[1];
    await userEvent.click(option1);
    await userEvent.click(option2);

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith([
      {
        label: "Option 1",
        value: "1",
      },
      {
        label: "Option 2",
        value: "2",
      },
    ]);

    const clearButton = screen.getByLabelText("Remove Option 1");
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          label: "Option 2",
          value: "2",
        },
      ]);
      expect(screen.queryByLabelText("Remove Option 1")).toBeNull();
    });
  });

  it("SelectEditField multi clicking on selected option in dropdown should remove that selected option", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
        />
      </Provider>
    );
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const option1 = screen.getAllByRole("option")[0];
    const option2 = screen.getAllByRole("option")[1];
    await userEvent.click(option1);
    await userEvent.click(option2);

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith([
      {
        label: "Option 1",
        value: "1",
      },
      {
        label: "Option 2",
        value: "2",
      },
    ]);

    await userEvent.click(option1);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          label: "Option 2",
          value: "2",
        },
      ]);
      expect(screen.queryByLabelText("Remove Option 1")).toBeNull();
    });
  });

  it("SelectEditField multi backspace in input should remove selectedOptions one by one", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.click(screen.getByText("Option 2"));
    expect(screen.getAllByRole("option", { selected: true }).length).toBe(1);
    await userEvent.keyboard("{Backspace}");
    await waitFor(() => {
      expect(screen.queryAllByRole("option", { selected: true }).length).toBe(
        0
      );
    });
  });

  it("SelectEditField multi backspace in input should remove selectedOptions one by one", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.click(screen.getByText("Option 2"));
    expect(screen.getAllByRole("option", { selected: true }).length).toBe(1);
    await userEvent.keyboard("{Backspace}");
    await waitFor(() => {
      expect(screen.queryAllByRole("option", { selected: true }).length).toBe(
        0
      );
    });
  });

  it("SelectEditField multi arrowLeft can navigate to the individual clear buttons", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const options = screen.getAllByRole("option");
    await userEvent.click(options[0]);
    await userEvent.click(options[1]);
    await userEvent.click(comboboxInput);
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          label: "Option 2",
          value: "2",
        },
      ]);
      expect(screen.queryByLabelText("Remove Option 1")).toBeNull();
    });
  });

  it("SelectEditField single select will not create option if error is thrown in onCreateOption", async () => {
    const mockError = vi.fn();
    vi.spyOn(console, "error").mockImplementation(mockError);

    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={false}
          onChange={mockOnChange}
          onCreateOption={(option) => {
            throw new Error(`${option.label} had an error during creation`);
          }}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.type(comboboxInput, "Option 3");
    await userEvent.click(screen.getByText("Create: Option 3"));

    expect(mockError).toHaveBeenCalled();
    expect(mockError.mock.lastCall).toEqual([
      "Error in onCreateOption:",
      expect.objectContaining({
        message: "Option 3 had an error during creation",
      }),
    ]);

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);
  });

  it("SelectEditField multi select will not create option if error is thrown in onCreateOption", async () => {
    const mockError = vi.fn();
    vi.spyOn(console, "error").mockImplementation(mockError);

    const mockOnChange = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          isMulti={true}
          onChange={mockOnChange}
          onCreateOption={(option) => {
            throw new Error(`${option.label} had an error during creation`);
          }}
        />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    expect(screen.getAllByRole("option").length).toBe(2);

    await userEvent.type(comboboxInput, "Option 3");
    await userEvent.click(screen.getByText("Create: Option 3"));

    expect(mockError).toHaveBeenCalled();
    expect(mockError.mock.lastCall).toEqual([
      "Error in onCreateOption:",
      expect.objectContaining({
        message: "Option 3 had an error during creation",
      }),
    ]);

    expect(screen.getAllByRole("option").length).toBe(2);
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
    await userEvent.click(screen.getByRole("combobox"));
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

  it("SelectEditField single select should show error for wrong data", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <SelectEditViewWrapper
          {...selectFieldProps}
          onValidFn={mockOnValid}
          onInvalidFn={mockOnInvalid}
          defaultValue={undefined}
          isMulti={false}
        />
      </Provider>
    );

    await userEvent.click(screen.getByText("Submit"));
    expect(screen.getByText("Must select an option.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("combobox"));
    expect(mockOnValid).not.toHaveBeenCalled();
    expect(mockOnInvalid).toHaveBeenCalled();
    expect(mockOnInvalid.mock.calls[0][0]).to.deep.equal({
      userSelection: {
        message: "Must select an option.",
        type: "invalid_type",
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
    const comboboxInput = screen.getByRole("combobox");

    await userEvent.click(comboboxInput);
    const options = screen.getAllByRole("option");
    await userEvent.click(options[0]);
    await userEvent.click(options[1]);
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
