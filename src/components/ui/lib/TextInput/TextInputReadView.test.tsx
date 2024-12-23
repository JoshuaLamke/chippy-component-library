import { render, screen } from "@testing-library/react";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";
import TextInputReadView, { TextInputReadViewProps } from "./ReadView";

const TextInputReadViewWrapper = (props: TextInputReadViewProps) => {
  return <TextInputReadView {...props} />;
};

describe("TextInput/ReadView", () => {
  const textInputFieldProps: TextInputReadViewProps = {
    inputValue: "text",
    label: "Read",
  };

  it("TextInputField should render the inputValue", async () => {
    render(
      <Provider>
        <TextInputReadViewWrapper {...textInputFieldProps} />
      </Provider>
    );
    expect(screen.getByText("text")).toBeInTheDocument();
  });

  it("TextInputField should render None for empty input value without noValueMessage", async () => {
    render(
      <Provider>
        <TextInputReadViewWrapper {...textInputFieldProps} inputValue={""} />
      </Provider>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("TextInputField should render no value message for empty inputValue", async () => {
    render(
      <Provider>
        <TextInputReadViewWrapper
          {...textInputFieldProps}
          inputValue={undefined as any}
          noValueMessage="Nothing here"
        />
      </Provider>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
