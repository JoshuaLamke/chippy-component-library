import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SelectOption } from "..";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it, vi } from "vitest";
import RadioInputEditView, { RadioInputEditViewProps } from "./EditView";
import userEvent from "@testing-library/user-event";
import { Button } from "@chakra-ui/react";
import { omit } from "../utils";

const RadioInputEditViewWrapper = <
  N extends string = string,
  V extends string = "value",
  L extends string = "label"
>(
  props: Omit<RadioInputEditViewProps<N, V, L>, "formMethods"> & {
    onValidFn?: (data: any) => undefined;
    onInvalidFn?: (errors: FieldErrors<any>) => undefined;
    defaultValue?: any;
  }
) => {
  const validation = z
    .object(
      {
        label: z.string(),
        value: z.string(),
      },
      { message: "Must select an option." }
    )
    .passthrough();

  const formSchema = z.object({
    radioOption: validation,
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radioOption: props.defaultValue ?? undefined,
    },
  });
  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(props.onValidFn!, props.onInvalidFn)}
    >
      <RadioInputEditView<N, V, L>
        {...omit(props, ["onInvalidFn", "onValidFn", "defaultValue"])}
        formMethods={methods}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

describe("RadioInput/EditView", () => {
  const exampleOptions: SelectOption[] = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ];

  const radioinputFieldProps: Omit<
    RadioInputEditViewProps<"radioOption", "value", "label">,
    "formMethods"
  > = {
    label: "Choose an option",
    name: "radioOption",
    options: exampleOptions,
    onChange: (_val) => undefined,
    onBlur: () => undefined,
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

  it("RadioInputEditView should render correctly", async () => {
    render(
      <Provider>
        <RadioInputEditViewWrapper {...radioinputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
    expect(screen.getAllByRole("radio").length).toBe(2);
  });

  it("RadioInputEditView should select properly", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <RadioInputEditViewWrapper
          {...radioinputFieldProps}
          onChange={mockOnChange}
        />
      </Provider>
    );

    const radioInput1 = screen.getByText("Option 1");
    const radioInput2 = screen.getByText("Option 2");

    await userEvent.click(radioInput1);
    expect(mockOnChange).toHaveBeenCalledWith({
      value: "1",
      label: "Option 1",
    });

    await userEvent.click(radioInput2);
    expect(mockOnChange).toHaveBeenCalledWith({
      value: "2",
      label: "Option 2",
    });
  });

  it("RadioInputEditView should select/deselect from spacebar keydown", async () => {
    const mockOnChange = vi.fn();
    render(
      <Provider>
        <RadioInputEditViewWrapper
          {...radioinputFieldProps}
          onChange={mockOnChange}
        />
      </Provider>
    );

    const radioInput1 = screen.getByText("Option 1");
    const radioInput2 = screen.getByText("Option 2");

    fireEvent.keyDown(radioInput1, { key: " ", code: "Space", keyCode: 32 });
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        value: "1",
        label: "Option 1",
      });
    });

    fireEvent.keyDown(radioInput1, { key: " ", code: "Space", keyCode: 32 });
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    fireEvent.keyDown(radioInput2, { key: " ", code: "Space", keyCode: 32 });
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        value: "2",
        label: "Option 2",
      });
    });
  });
});
