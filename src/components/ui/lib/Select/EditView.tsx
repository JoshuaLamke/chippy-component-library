import {
  SelectItem,
  SelectContent,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Field } from "../../field";
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { createListCollection } from "@chakra-ui/react";
import { SelectOption } from "./types";
import { useMemo, useState } from "react";
import { SelectFieldProps } from "./Field";
import LabelWithTooltip from "../Tooltip/LabelWithTooltip";

export const getErrorText = (
  errorObj: FieldErrors<FieldValues>,
  baseKeyName: string,
  optionValueName: string,
  optionLabelName: string
) => {
  const keyError = errorObj[baseKeyName] as
    | FieldError
    | Record<string, FieldError>[]
    | Record<string, FieldError>
    | undefined;

  if (!keyError) {
    return "";
  }

  // If keyError is an array or has keys that are fieldErrors, it means the schema is likely expecting different keys
  if (
    Array.isArray(keyError) ||
    Object.values(keyError).some(
      (possibleErrObj) =>
        typeof possibleErrObj === "object" &&
        (possibleErrObj as FieldError).message
    )
  ) {
    const expectedKeys = Array.isArray(keyError)
      ? Object.keys(keyError[0])
      : Object.keys(keyError);
    return `Expecting option(s) to have keys: ${expectedKeys.join(
      ", "
    )}. Received keys: ${optionValueName}, ${optionLabelName}.`;
  }

  // Should only be possible for it to be a regular error at this point
  return (keyError as FieldError).message;
};

interface CreateSearchOptionsInputProps<
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> {
  createable: boolean;
  searchable: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddOption: (
    value: string
  ) => SelectOption<OptionValueName, OptionLabelName>;
  onAddOptionChange: (
    newOption: SelectOption<OptionValueName, OptionLabelName>
  ) => void;
}

export const CreateSearchOptionsInput = <
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  createable,
  handleAddOption,
  searchTerm,
  searchable,
  setSearchTerm,
  onAddOptionChange,
}: CreateSearchOptionsInputProps<OptionValueName, OptionLabelName>) => {
  return (
    <div className="sticky top-0 bg-white z-10 pt-1">
      {(searchable || createable) && (
        <input
          type="text"
          className="w-full p-2 border rounded-md border-gray-400 focus:outline-none focus:border-gray-700"
          placeholder={`Type to ${createable ? "add" : ""}${
            createable && searchable ? " or " : ""
          }${searchable ? "search options..." : ""}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (createable && e.key === "Enter" && e.currentTarget.value) {
              const newOption = handleAddOption(e.currentTarget.value);
              onAddOptionChange(newOption);
              e.currentTarget.value = "";
              setSearchTerm("");
            }
          }}
        />
      )}
    </div>
  );
};

export interface SelectEditViewProps<
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
> extends SelectFieldProps<FormKeyNames, OptionValueName, OptionLabelName> {
  formMethods: UseFormReturn<any>;
}

const SelectEditView = <
  FormKeyNames extends string = string,
  OptionValueName extends string = "value",
  OptionLabelName extends string = "label"
>({
  label,
  name,
  isMulti,
  placeholder = "",
  options,
  clearable,
  size,
  onChange,
  onBlur,
  formMethods,
  required = false,
  createable = false,
  searchable = true,
  optionLabelName,
  optionValueName,
  helperText,
  warningText,
  tooltip,
  ...props
}: SelectEditViewProps<FormKeyNames, OptionValueName, OptionLabelName>) => {
  const {
    formState: { errors },
    control,
  } = formMethods;

  const [userOptions, setUserOptions] = useState<
    SelectOption<OptionValueName, OptionLabelName>[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Adds new option from create input
  const handleAddOption = (value: string) => {
    const newOption = {
      [optionLabelName]: value,
      [optionValueName]: value,
    } as SelectOption<OptionValueName, OptionLabelName>;
    setUserOptions((prev) => [...prev, newOption]);
    return newOption;
  };

  // Call on change when the new option is added
  const onAddOptionChange =
    (field: ControllerRenderProps) =>
    (newOption: SelectOption<OptionValueName, OptionLabelName>) => {
      const formattedValue = isMulti
        ? [...(field.value ?? []), newOption]
        : newOption;
      onChange?.(formattedValue);
      field.onChange(formattedValue);
    };

  // Merge and conditionally filter options based on the search term
  const { mergedOptions, filteredMergeOptions } = useMemo(() => {
    const mergedOptions = [...options, ...userOptions];
    let filteredMergeOptions = [...mergedOptions];
    if (searchable) {
      filteredMergeOptions = filteredMergeOptions.filter((option) =>
        option[optionLabelName].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return { mergedOptions, filteredMergeOptions };
  }, [options, userOptions, searchTerm, searchable]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: mergedOptions,
        itemToValue: (item) => item[optionValueName],
        itemToString: (item) => item[optionLabelName],
      }),
    [mergedOptions]
  );

  // Coerces value to string array based on single or multi select
  const calculateSelectValue = (
    field: ControllerRenderProps<FieldValues, FormKeyNames>
  ) => {
    if (isMulti) {
      const value =
        field.value || ([] as SelectOption<OptionValueName, OptionLabelName>[]);
      return value.map((option) => option[optionValueName]) as string[];
    }

    return [field.value?.[optionValueName] as string].filter((item) => item);
  };

  return (
    <Field
      label={<LabelWithTooltip tooltip={tooltip} label={label} />}
      invalid={!!errors[name]}
      errorText={getErrorText(errors, name, optionValueName, optionLabelName)}
      required={required}
      helperText={helperText}
      warningText={warningText}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SelectRoot
            data-testid={"selectRoot"}
            multiple={isMulti}
            name={field.name}
            value={calculateSelectValue(field)}
            onValueChange={({ items }) => {
              // keep in array for multi-select, otherwise pass object
              const formattedValue = isMulti ? items : items?.[0];
              onChange?.(formattedValue);
              return field.onChange(formattedValue);
            }}
            onInteractOutside={
              /* istanbul ignore next */
              () => {
                onBlur?.();
                field.onBlur();
              }
            }
            onOpenChange={({ open }) => {
              // Clear search on close
              if (!open) {
                setSearchTerm("");
              }
            }}
            collection={collection}
            size={size}
            closeOnSelect={!isMulti}
            className="border rounded-md"
            tabIndex={-1}
            {...props}
          >
            <SelectTrigger clearable={clearable}>
              <SelectValueText placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="pt-0">
              <CreateSearchOptionsInput<OptionValueName, OptionLabelName>
                createable={createable}
                handleAddOption={handleAddOption}
                onAddOptionChange={onAddOptionChange(field)}
                searchTerm={searchTerm}
                searchable={searchable}
                setSearchTerm={setSearchTerm}
              />
              {filteredMergeOptions.map((option) => (
                <SelectItem
                  data-testid={"selectOption"}
                  item={option}
                  key={option[optionValueName]}
                >
                  {option[optionLabelName]}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      />
    </Field>
  );
};

export default SelectEditView;
