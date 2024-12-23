import { render, screen } from "@testing-library/react";
import { Provider } from "../../provider";
import { describe, expect, it } from "vitest";
import SelectReadView, { SelectReadViewProps } from "./ReadView";

const SelectReadViewWrapper = (
  props: SelectReadViewProps<"value", "label">
) => {
  return <SelectReadView {...props} />;
};

describe("Select/ReadView", () => {
  const selectFieldProps: SelectReadViewProps<"value", "label"> = {
    optionLabelName: "label",
    optionValueName: "value",
    selectValue: [
      {
        label: "Option1",
        value: "opt1",
      },
      {
        label: "Option2",
        value: "opt2",
      },
    ],
    label: "Read",
  };
  it("SelectField should render the selectedValues for Multi Select", async () => {
    render(
      <Provider>
        <SelectReadViewWrapper {...selectFieldProps} />
      </Provider>
    );
    expect(screen.getByText("Option1")).toBeInTheDocument();
    expect(screen.getByText("Option2")).toBeInTheDocument();
  });

  it("SelectField should render the selectedValues for single select", async () => {
    render(
      <Provider>
        <SelectReadViewWrapper
          {...selectFieldProps}
          selectValue={{ label: "singleOption", value: "singleOpt" }}
        />
      </Provider>
    );
    expect(screen.getByText("singleOption")).toBeInTheDocument();
  });

  it("SelectField should render none selected for empty single select or multiSelect", async () => {
    const { rerender } = render(
      <Provider>
        <SelectReadViewWrapper {...selectFieldProps} selectValue={[]} />
      </Provider>
    );
    expect(screen.getByText("None Selected")).toBeInTheDocument();

    rerender(
      <Provider>
        <SelectReadViewWrapper
          {...selectFieldProps}
          selectValue={undefined as any}
        />
      </Provider>
    );
    expect(screen.getByText("None Selected")).toBeInTheDocument();
  });

  it("SelectField should render no value message for empty single select or multiSelect", async () => {
    const { rerender } = render(
      <Provider>
        <SelectReadViewWrapper
          {...selectFieldProps}
          selectValue={[]}
          noValueMessage="Nothing here"
        />
      </Provider>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();

    rerender(
      <Provider>
        <SelectReadViewWrapper
          {...selectFieldProps}
          selectValue={undefined as any}
          noValueMessage="Nothing here"
        />
      </Provider>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
