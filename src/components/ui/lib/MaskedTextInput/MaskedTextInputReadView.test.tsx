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
    maskPlaceholder: "___ ___ ___",
    maskSlotChar: "_",
    formatToDisplayValue: function (
      storedValue: string,
      maskPlaceholder: string,
      maskSlotChar: string
    ): string {
      let storedValueCharIdx = 0;
      const displayValueArr = maskPlaceholder.split("");
      for (let i = 0; i < displayValueArr.length; i++) {
        if (storedValueCharIdx >= storedValue.length) {
          break;
        }
        if (displayValueArr[i] !== maskSlotChar) {
          continue;
        }
        displayValueArr[i] = storedValue[storedValueCharIdx];
        storedValueCharIdx++;
      }
      const displayValue = displayValueArr.join("");
      return displayValue;
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
