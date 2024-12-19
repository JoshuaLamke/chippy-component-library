import { afterEach, describe, expect, it, vi } from "vitest";
import { handleCursorBack, handleCursorForward } from "./EditView";

describe("MaskedTextInput/EditView/handleCursorFn", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handleCursorBack should move cursor back one if slot char is previous char", () => {
    const mockSetSelectionRange = vi.fn();

    handleCursorBack("___-__-____", "_")(
      {
        target: { setSelectionRange: mockSetSelectionRange },
      } as unknown as React.ChangeEvent<HTMLInputElement>,
      3
    );

    expect(mockSetSelectionRange).toHaveBeenCalled();
  });

  it("handleCursorBack should move cursor back to previous slotChar if previous char is not a slotChar", () => {
    const mockSetSelectionRange = vi.fn();

    handleCursorBack("__---", "_")(
      {
        target: { setSelectionRange: mockSetSelectionRange },
      } as unknown as React.ChangeEvent<HTMLInputElement>,
      4
    );

    expect(mockSetSelectionRange).toHaveBeenCalled();
  });

  it("handleCursorForward should move cursor forward one if slot char is next char", () => {
    const mockSetSelectionRange = vi.fn();

    handleCursorForward("___-__-____", "_")(
      {
        target: { setSelectionRange: mockSetSelectionRange },
      } as unknown as React.ChangeEvent<HTMLInputElement>,
      1
    );

    expect(mockSetSelectionRange).toHaveBeenCalled();
  });

  it("handleCursorForward should move cursor to next slotChar if next char is not a slotChar", () => {
    const mockSetSelectionRange = vi.fn();

    handleCursorForward("__---__", "_")(
      {
        target: { setSelectionRange: mockSetSelectionRange },
      } as unknown as React.ChangeEvent<HTMLInputElement>,
      4
    );

    expect(mockSetSelectionRange).toHaveBeenCalled();
  });
});