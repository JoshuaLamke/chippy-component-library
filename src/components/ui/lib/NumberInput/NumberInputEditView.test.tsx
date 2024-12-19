import { render, screen } from "@testing-library/react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "@chakra-ui/react";
import NumberInputEditView, { NumberInputEditViewProps } from "./EditView";
import { omit } from "../utils";

const NumberInputEditViewWrapper = (
  props: Omit<NumberInputEditViewProps<"userNumber">, "formMethods"> & {
    onValidFn?: (data: any) => undefined;
    onInvalidFn?: (errors: FieldErrors<any>) => undefined;
    defaultValue?: any;
  }
) => {
  const formSchema = z.object({
    userNumber: z.number({ message: "need to input number" }),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userNumber: undefined,
    },
  });
  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(props.onValidFn!, props.onInvalidFn)}
    >
      <NumberInputEditView
        {...omit(props, ["onInvalidFn", "onValidFn", "defaultValue"])}
        formMethods={methods}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

describe("NumberInput/EditView", () => {
  const numberInputFieldProps: Omit<
    NumberInputEditViewProps<"userNumber">,
    "formMethods"
  > = {
    label: "Number",
    name: "userNumber",
    placeholder: "Enter number...",
    size: "md",
    onChange: (_val) => undefined,
    onBlur: () => undefined,
    readOnly: false,
    disabled: false,
    required: true,
    helperText: "Please enter number",
    warningText: "Warning: This is a required field",
    tooltip: {
      content: "This is a tooltip",
      Icon: <button>Info</button>,
      defaultIconProps: { color: "blue" },
    },
  };

  it("NumberInputEditField can have a number entered and removed from it", async () => {
    const mockOnChange = vi.fn();
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <div>Trigger Blur</div>
        <NumberInputEditViewWrapper
          {...numberInputFieldProps}
          onChange={mockOnChange}
          onBlur={mockOnBlur}
        />
      </Provider>
    );
    const numberInput: HTMLInputElement =
      screen.getByPlaceholderText("Enter number...");

    await userEvent.type(numberInput, "100");
    expect(numberInput.value).toBe("100");
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(100);

    await userEvent.clear(numberInput);
    expect(mockOnChange).toHaveBeenCalledWith(undefined);

    await userEvent.click(screen.getByText("Trigger Blur"));
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("NumberInputEditField should show error", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <NumberInputEditViewWrapper
          {...numberInputFieldProps}
          onValidFn={mockOnValid}
          onInvalidFn={mockOnInvalid}
        />
      </Provider>
    );
    const submitButton = screen.getByText("Submit");

    await userEvent.click(submitButton);
    expect(screen.getByText("need to input number")).toBeInTheDocument();
    expect(mockOnValid).not.toHaveBeenCalled();
    expect(mockOnInvalid).toHaveBeenCalled();
    expect(mockOnInvalid.mock.calls[0][0].userNumber.message).toBe(
      "need to input number"
    );
    expect(mockOnInvalid.mock.calls[0][0].userNumber.type).toBe("invalid_type");
  });

  it("NumberInputEditField should submit correctly", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <NumberInputEditViewWrapper
          {...numberInputFieldProps}
          onValidFn={mockOnValid}
          onInvalidFn={mockOnInvalid}
        />
      </Provider>
    );
    const numberInput: HTMLInputElement =
      screen.getByPlaceholderText("Enter number...");
    await userEvent.type(numberInput, "100");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    expect(mockOnValid).toHaveBeenCalled();
    expect(mockOnValid.mock.calls[0][0]).to.deep.equal({
      userNumber: 100,
    });
  });
});
