import { render, screen } from "@testing-library/react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "@chakra-ui/react";
import TextInputEditView, { TextInputEditViewProps } from "./EditView";
import { omit } from "../utils";

const TextInputEditViewWrapper = (
  props: Omit<TextInputEditViewProps<"userText">, "formMethods"> & {
    onValidFn?: (data: any) => undefined;
    onInvalidFn?: (errors: FieldErrors<any>) => undefined;
    defaultValue?: any;
  }
) => {
  const formSchema = z.object({
    userText: z.string().min(1, { message: "need to input text" }),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userText: undefined,
    },
  });
  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(props.onValidFn!, props.onInvalidFn)}
    >
      <TextInputEditView
        {...omit(props, ["onInvalidFn", "onValidFn", "defaultValue"])}
        formMethods={methods}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

describe("TextInput/EditView", () => {
  const textInputFieldProps: Omit<
    TextInputEditViewProps<"userText">,
    "formMethods"
  > = {
    label: "Text",
    name: "userText",
    placeholder: "Enter text...",
    size: "md",
    onChange: (_val) => undefined,
    onBlur: () => undefined,
    readOnly: false,
    disabled: false,
    required: true,
    helperText: "Please enter text",
    warningText: "Warning: This is a required field",
    tooltip: {
      content: "This is a tooltip",
      Icon: <button>Info</button>,
      defaultIconProps: { color: "blue" },
    },
  };

  it("TextInputEditField can have text entered into it", async () => {
    const mockOnChange = vi.fn();
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <div>Trigger Blur</div>
        <TextInputEditViewWrapper
          {...textInputFieldProps}
          onChange={mockOnChange}
          onBlur={mockOnBlur}
        />
      </Provider>
    );
    const textInput: HTMLInputElement = screen.getByRole("textbox");

    await userEvent.type(textInput, "input value");
    expect(textInput.value).toBe("input value");
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith("input value");

    await userEvent.click(screen.getByText("Trigger Blur"));
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("TextInputEditField should show error", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <TextInputEditViewWrapper
          {...textInputFieldProps}
          onValidFn={mockOnValid}
          onInvalidFn={mockOnInvalid}
        />
      </Provider>
    );
    const submitButton = screen.getByText("Submit");

    await userEvent.click(submitButton);
    expect(screen.getByText("need to input text")).toBeInTheDocument();
    expect(mockOnValid).not.toHaveBeenCalled();
    expect(mockOnInvalid).toHaveBeenCalled();
    expect(mockOnInvalid.mock.calls[0][0].userText.message).toBe(
      "need to input text"
    );
    expect(mockOnInvalid.mock.calls[0][0].userText.type).toBe("too_small");
  });

  it("TextInputEditField should submit correctly", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <TextInputEditViewWrapper
          {...textInputFieldProps}
          onValidFn={mockOnValid}
          onInvalidFn={mockOnInvalid}
        />
      </Provider>
    );
    const textInput: HTMLInputElement = screen.getByRole("textbox");
    await userEvent.type(textInput, "input value");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    expect(mockOnValid).toHaveBeenCalled();
    expect(mockOnValid.mock.calls[0][0]).to.deep.equal({
      userText: "input value",
    });
  });
});
