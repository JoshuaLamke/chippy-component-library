import { FormProvider, useForm } from "react-hook-form";
import SelectField from "./components/ui/lib/Select/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react";
import TextInputField from "./components/ui/lib/TextInput/Field";
import NumberInputField from "./components/ui/lib/NumberInput/Field";
import MaskedTextInputField from "./components/ui/lib/MaskedTextInput/Field";
import SSNInputField from "./components/ui/lib/MaskedTextInput/SSNInput/Field";
import PhoneNumberInputField from "./components/ui/lib/MaskedTextInput/PhoneNumberInput/Field";
import { useState } from "react";

const selectErrorMessage = { message: "Must add at least one option" };
const textErrorMessage = { message: "Must add text." };
const formSchema = z.object({
  frameworkMulti: z
    .object(
      {
        name: z.string(),
        id: z.string(),
      },
      selectErrorMessage
    )
    .passthrough()
    .array()
    .min(1, selectErrorMessage),
  frameworkSingle: z
    .object(
      {
        name: z.string(),
        id: z.string(),
      },
      selectErrorMessage
    )
    .passthrough(),
  text: z.string().min(1, textErrorMessage),
  number: z.number(),
  maskText: z.string().length(9),
  ssnText: z.string().length(9),
  phoneNumberText: z.string().length(10),
});

type FormValues = z.infer<typeof formSchema>;

function App() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frameworkMulti: [
        { name: "React", id: "react", val2: "1" },
        { name: "Vue", id: "vue", val2: "2" },
      ],
      frameworkSingle: undefined,
      text: "default",
      number: 123,
      maskText: "123456789",
      ssnText: "123456789",
      phoneNumberText: "1234567890",
    },
  });

  const [formState, setFormState] = useState<"read" | "edit">("edit");
  const [inputSize, setInputSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [inputValue, setInputValue] = useState("");
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      width={"vw"}
      height={"vh"}
      position={"relative"}
    >
      <Box position={"absolute"} top={"0"} right={"0"} width={"40"}>
        <Button
          onClick={() => setFormState(formState === "edit" ? "read" : "edit")}
          variant={"outline"}
          background={"bg.emphasized"}
        >
          {formState === "edit" ? "Go to read mode" : "Go to edit mode"}
        </Button>
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setInputSize(inputValue as any);
            }
          }}
        />
      </Box>
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={methods.handleSubmit(
            (data) => console.log(data),
            (error) => console.log(error)
          )}
        >
          <Grid
            templateColumns={[
              "repeat(2, minmax(0, 1fr))",
              "repeat(3, minmax(0, 1fr))",
              "repeat(4, minmax(0, 1fr))",
            ]}
            gap={"2"}
            width={"vw"}
            paddingX={"5"}
          >
            <GridItem colSpan={1} className="flex">
              <SelectField<keyof FormValues, "id", "name">
                required={true}
                name="frameworkMulti"
                optionLabelName="name"
                optionValueName="id"
                helperText="This is helper text"
                options={[
                  { name: "React", id: "react", val2: "1" },
                  { name: "Vue", id: "vue", val2: "2" },
                  { name: "Angular", id: "angular", val2: "3" },
                  { name: "React1", id: "react1", val2: "4" },
                  { name: "Vue1", id: "vue1", val2: "5" },
                  { name: "Angular1", id: "angular1", val2: "6" },
                  { name: "React2", id: "react2", val2: "7" },
                  { name: "Vue2", id: "vue2", val2: "8" },
                  { name: "Angular2", id: "angular2", val2: "9" },
                  { name: "React3", id: "react3", val2: "11" },
                  { name: "Vue3", id: "vue3", val2: "12" },
                  { name: "Angular3", id: "angular3", val2: "13" },
                ]}
                label={"Framework"}
                placeholder="Select Frameworks"
                createable={true}
                isMulti={true}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state={formState}
                onCreateOption={async (option) => {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(option);
                    }, 5000); // Simulates a 1-second API call delay
                  });
                }}
                size={inputSize}
              />
            </GridItem>
            <GridItem colSpan={1} className="flex">
              <SelectField<keyof FormValues, "id", "name">
                required={true}
                name="frameworkSingle"
                optionLabelName="name"
                optionValueName="id"
                helperText="This is helper text"
                options={[
                  { name: "React", id: "react", val2: "1" },
                  { name: "Vue", id: "vue", val2: "2" },
                  { name: "Angular", id: "angular", val2: "3" },
                  { name: "React1", id: "react1", val2: "4" },
                  { name: "Vue1", id: "vue1", val2: "5" },
                  { name: "Angular1", id: "angular1", val2: "6" },
                  { name: "React2", id: "react2", val2: "7" },
                  { name: "Vue2", id: "vue2", val2: "8" },
                  { name: "Angular2", id: "angular2", val2: "9" },
                  { name: "React3", id: "react3", val2: "11" },
                  { name: "Vue3", id: "vue3", val2: "12" },
                  { name: "Angular3", id: "angular3", val2: "13" },
                ]}
                label={"Framework"}
                placeholder="Select Framework"
                createable={true}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state={formState}
                onCreateOption={async (option) => {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(option);
                    }, 500000); // Simulates a 1-second API call delay
                  });
                }}
                size={inputSize}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <TextInputField
                name="text"
                label={"Text"}
                placeholder="Enter text..."
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state={formState}
                required={true}
                helperText="This is helper text"
                size={inputSize}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <NumberInputField
                name="number"
                label={"Number"}
                placeholder="Enter number..."
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state={formState}
                required={true}
                helperText="This is helper text"
                size={inputSize}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <MaskedTextInputField
                name="maskText"
                label={"Mask Text"}
                maskOptions={{
                  mask: "___ ___ ___",
                  replacement: {
                    _: /\d/,
                  },
                  showMask: true,
                }}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state={formState}
                required={true}
                helperText="This is helper text"
                size={inputSize}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <SSNInputField
                name="ssnText"
                label={"SSN Text"}
                maskOptions={{
                  showMask: true,
                }}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state={formState}
                required={true}
                helperText="This is helper text"
                size={inputSize}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <PhoneNumberInputField
                name="phoneNumberText"
                label={"Phone Number Text"}
                countryCode="44"
                phoneNumberFormat="Standard (With Parentheses)"
                maskOptions={{
                  showMask: true,
                }}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state={formState}
                required={true}
                helperText="This is helper text"
                size={inputSize}
              />
            </GridItem>
            <GridItem
              colSpan={[2, 3, 4]}
              display={"flex"}
              justifyContent={"center"}
              marginTop={"5"}
            >
              <Button variant={"outline"} type="submit">
                Submit
              </Button>
            </GridItem>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
}

export default App;
