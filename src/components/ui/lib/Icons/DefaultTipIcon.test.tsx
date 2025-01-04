import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DefaultTipIcon from "./DefaultTipIcon";

describe("Tooltip/DefaultTipIcon", () => {
  it("Should render without errors", async () => {
    render(<DefaultTipIcon />);
    expect(screen.getByTestId("defaultTipIcon")).toBeInTheDocument();
  });
});
