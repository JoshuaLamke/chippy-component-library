import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LabelWithTooltip from "./LabelWithTooltip";

vi.mock("../../tooltip", () => ({
  Tooltip: vi.fn(({ content, children }: any) => (
    <div>
      {children}
      <span data-testid="tooltip-content">{content}</span>
    </div>
  )),
}));

describe("Tooltip/LabelWithTooltip", () => {
  it("renders the label without tooltip if no tooltip prop is provided", () => {
    render(<LabelWithTooltip label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip-content")).not.toBeInTheDocument();
  });

  it("renders the label and default tooltip icon with tooltip content", async () => {
    render(
      <LabelWithTooltip
        label="Test Label"
        tooltip={{ content: "Tooltip Content" }}
      />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip-content")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-content")).toHaveTextContent(
      "Tooltip Content"
    );
  });

  it("renders the label with a custom tooltip icon", () => {
    render(
      <LabelWithTooltip
        label="Test Label"
        tooltip={{
          content: "Tooltip Content",
          Icon: (
            <button>
              <span data-testid="custom-icon">Custom Icon</span>
            </button>
          ),
        }}
      />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-content")).toHaveTextContent(
      "Tooltip Content"
    );
  });
});
