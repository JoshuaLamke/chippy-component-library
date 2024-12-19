import { render, screen } from "@testing-library/react";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";
import NumberInputReadView, { NumberInputReadViewProps } from "./ReadView";

const NumberInputReadViewWrapper = (props: NumberInputReadViewProps) => {
  return <NumberInputReadView {...props} />;
};

describe("NumberInput/ReadView", () => {
  const textInputFieldProps: NumberInputReadViewProps = {
    inputValue: 100,
    label: "Read",
  };

  it("NumberInputField should render the inputValue", () => {
    render(
      <Provider>
        <NumberInputReadViewWrapper {...textInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("NumberInputField should render 0 correctly even though its a falsey value", () => {
    render(
      <Provider>
        <NumberInputReadViewWrapper {...textInputFieldProps} inputValue={0} />
      </Provider>
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("NumberInputField should render NaN correctly by being like theres no value", () => {
    render(
      <Provider>
        <NumberInputReadViewWrapper {...textInputFieldProps} inputValue={NaN} />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("NumberInputField should render None for empty input value without noValueMessage", () => {
    render(
      <Provider>
        <NumberInputReadViewWrapper
          {...textInputFieldProps}
          inputValue={undefined}
        />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("NumberInputField should render no value message for empty inputValue", () => {
    render(
      <Provider>
        <NumberInputReadViewWrapper
          {...textInputFieldProps}
          inputValue={undefined as any}
          noValueMessage="Nothing here"
        />
      </Provider>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
