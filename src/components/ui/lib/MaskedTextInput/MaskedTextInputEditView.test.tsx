import { fireEvent, render, screen } from "@testing-library/react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Provider } from "../../provider";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "@chakra-ui/react";
import MaskedTextInputEditView, {
  MaskedTextInputEditViewProps,
} from "./EditView";
import { omit } from "../utils";

const MaskedTextInputEditViewWrapper = (
  props: Omit<MaskedTextInputEditViewProps<"maskedUserText">, "formMethods"> & {
    onValidFn?: (data: any) => undefined;
    onInvalidFn?: (errors: FieldErrors<any>) => undefined;
    defaultValue?: any;
  }
) => {
  const formSchema = z.object({
    maskedUserText: z.string().min(1, { message: "need to input text" }),
  });
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maskedUserText: "",
    },
  });
  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(props.onValidFn!, props.onInvalidFn)}
    >
      <MaskedTextInputEditView
        {...omit(props, ["onInvalidFn", "onValidFn", "defaultValue"])}
        formMethods={methods}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

describe("MaskedTextInput/EditView", () => {
  const maskedTextInputProps: Omit<
    MaskedTextInputEditViewProps<"maskedUserText">,
    "formMethods"
  > = {
    label: "Write some masked text",
    name: "maskedUserText",
    size: "md",
    onChange: () => undefined,
    onBlur: () => undefined,
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
    maskOptions: {
      mask: "___ __ ____",
      replacement: {
        _: /\d/,
      },
    },
  };

  it("MaskedTextInputEditField can have text entered into it", async () => {
    const mockOnChange = vi.fn();
    const mockOnBlur = vi.fn();
    render(
      <Provider>
        <div>Trigger Blur</div>
        <MaskedTextInputEditViewWrapper
          {...maskedTextInputProps}
          onChange={mockOnChange}
          onBlur={mockOnBlur}
        />
      </Provider>
    );
    const textInput: HTMLInputElement = screen.getByRole("textbox");
    fireEvent.focus(textInput);
    fireEvent.keyDown(textInput, {
      key: "ArrowLeft",
      code: "ArrowLeft",
      charCode: 37,
    });
    await userEvent.type(textInput, "11111");
    await userEvent.type(textInput, "{backspace}");

    expect(mockOnChange).toHaveBeenCalled();

    await userEvent.click(screen.getByText("Trigger Blur"));
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("MaskedTextInputEditField should show error", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <MaskedTextInputEditViewWrapper
          {...maskedTextInputProps}
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
    expect(mockOnInvalid.mock.calls[0][0].maskedUserText.message).toBe(
      "need to input text"
    );
    expect(mockOnInvalid.mock.calls[0][0].maskedUserText.type).toBe(
      "too_small"
    );
  });

  it("MaskedTextInputEditField should submit correctly", async () => {
    const mockOnValid = vi.fn();
    const mockOnInvalid = vi.fn();
    render(
      <Provider>
        <MaskedTextInputEditViewWrapper
          {...maskedTextInputProps}
          onValidFn={mockOnValid}
          onInvalidFn={mockOnInvalid}
        />
      </Provider>
    );
    const textInput: HTMLInputElement = screen.getByRole("textbox");
    await userEvent.type(textInput, "111222333");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    expect(mockOnValid).toHaveBeenCalled();
    expect(mockOnValid.mock.calls[0][0]).to.deep.equal({
      maskedUserText: "111222333",
    });
  });
});
