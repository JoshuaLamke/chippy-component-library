import { FormProvider, useForm } from "react-hook-form";
import SelectField from "./components/ui/lib/Select/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import TextInputField from "./components/ui/lib/TextInput/Field";
import NumberInputField from "./components/ui/lib/NumberInput/Field";
import MaskedTextInputField from "./components/ui/lib/MaskedTextInput/Field";

const selectErrorMessage = { message: "Must add at least one option" };
const textErrorMessage = { message: "Must add text." };
const formSchema = z.object({
  framework: z
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
  text: z.string().min(1, textErrorMessage),
  number: z.number(),
  maskText: z.string().length(9),
});

type FormValues = z.infer<typeof formSchema>;

function App() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: [
        { name: "React", id: "react", val2: "1" },
        { name: "Vue", id: "vue", val2: "2" },
      ],
      text: "default",
      number: 123,
      maskText: "123456789",
    },
  });

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      width={"svw"}
      height={"svh"}
      marginTop={"3"}
    >
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={methods.handleSubmit(
            (data) => console.log(data),
            (error) => console.log(error)
          )}
        >
          <Grid
            templateColumns="repeat(4, 1fr)"
            gap={"2"}
            width={"svw"}
            paddingX={"5"}
          >
            <GridItem colSpan={1} className="flex">
              <SelectField<keyof FormValues, "id", "name">
                name="framework"
                optionLabelName="name"
                optionValueName="id"
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
                placeholder="Select Framework(s)"
                createable={true}
                searchable={true}
                clearable={true}
                isMulti={true}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state="edit"
                required={false}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <TextInputField
                name="text"
                label={"Text"}
                placeholder="Enter text..."
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state="edit"
                required={true}
                helperText="This is helper text"
              />
            </GridItem>
            <GridItem colSpan={1}>
              <NumberInputField
                name="number"
                label={"Number"}
                placeholder="Enter number..."
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state="edit"
                required={true}
                helperText="This is helper text"
              />
            </GridItem>
            <GridItem colSpan={1}>
              <MaskedTextInputField
                name="maskText"
                label={"Mask Text"}
                maskPlaceholder="___-__-____"
                maskSlotChar="_"
                formatFromDisplayValue={(val) => val.replace(/[_-]/g, "")}
                formatToDisplayValue={(
                  storedValue,
                  maskPlaceholder,
                  maskSlotChar
                ) => {
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
                }}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state="edit"
                required={true}
                helperText="This is helper text"
              />
            </GridItem>
            <GridItem
              colSpan={4}
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
