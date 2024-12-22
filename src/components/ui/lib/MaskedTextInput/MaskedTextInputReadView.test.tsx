import { render, screen } from "@testing-library/react";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";
import MaskedTextInputReadView, {
  MaskedTextInputReadViewProps,
} from "./ReadView";

const MaskedTextInputReadViewWrapper = (
  props: MaskedTextInputReadViewProps
) => {
  return <MaskedTextInputReadView {...props} />;
};

describe("MaskedTextInput/ReadView", () => {
  const maskedTextInputFieldProps: MaskedTextInputReadViewProps = {
    inputValue: "text",
    label: "Read",
    maskOptions: {
      mask: "___ ___ ___",
      replacement: {
        _: /\d/,
      },
      showMask: true,
    },
  };

  it("MaskedTextInputReadField should render the inputValue formatted", () => {
    render(
      <Provider>
        <MaskedTextInputReadViewWrapper {...maskedTextInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("tex t__ ___")).toBeInTheDocument();
  });

  it("MaskedTextInputReadField should render None for empty input value without noValueMessage", () => {
    render(
      <Provider>
        <MaskedTextInputReadViewWrapper
          {...maskedTextInputFieldProps}
          inputValue={""}
        />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("MaskedTextInputReadField should render no value message for empty inputValue", () => {
    render(
      <Provider>
        <MaskedTextInputReadViewWrapper
          {...maskedTextInputFieldProps}
          inputValue={undefined as any}
          noValueMessage="Nothing here"
        />
      </Provider>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
