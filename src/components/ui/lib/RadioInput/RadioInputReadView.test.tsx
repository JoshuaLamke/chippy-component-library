import { render, screen } from "@testing-library/react";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";
import RadioInputReadView, { RadioInputReadViewProps } from "./ReadView";

const RadioInputReadViewWrapper = (
  props: RadioInputReadViewProps<"value", "label">
) => {
  return <RadioInputReadView<"value", "label"> {...props} />;
};

describe("RadioInput/ReadView", () => {
  const radioInputFieldProps: RadioInputReadViewProps<"value", "label"> = {
    optionLabelName: "label",
    inputValue: {
      label: "Option1",
      value: "opt1",
    },
    label: "Read",
  };

  it("RadioInputField should render the inputValue", async () => {
    render(
      <Provider>
        <RadioInputReadViewWrapper {...radioInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Option1")).toBeInTheDocument();
  });

  it("RadioInputField should render none selected when empty", async () => {
    const { rerender } = render(
      <Provider>
        <RadioInputReadViewWrapper
          {...radioInputFieldProps}
          inputValue={null}
        />
      </Provider>
    );
    expect(screen.getByText("None Selected")).toBeInTheDocument();

    rerender(
      <Provider>
        <RadioInputReadViewWrapper
          {...radioInputFieldProps}
          inputValue={undefined}
        />
      </Provider>
    );
    expect(screen.getByText("None Selected")).toBeInTheDocument();
  });

  it("RadioInputField should render no value message when empty", async () => {
    const { rerender } = render(
      <Provider>
        <RadioInputReadViewWrapper
          {...radioInputFieldProps}
          inputValue={null}
          noValueMessage="Nothing here"
        />
      </Provider>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();

    rerender(
      <Provider>
        <RadioInputReadViewWrapper
          {...radioInputFieldProps}
          inputValue={undefined}
          noValueMessage="Nothing here"
        />
      </Provider>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
