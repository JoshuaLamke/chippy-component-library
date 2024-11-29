import { FormProvider, useForm } from "react-hook-form";
import SelectField from "./components/ui/lib/Select/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Grid, GridItem } from "@chakra-ui/react";

const errorMessage = { message: "Must add at least one option" };
const formSchema = z.object({
  framework: z
    .object(
      {
        label: z.string(),
        value: z.string(),
      },
      errorMessage
    )
    .passthrough()
    .array()
    .min(1, errorMessage),
});

type FormValues = z.infer<typeof formSchema>;

function App() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: undefined,
    },
  });

  return (
    <div className="flex justify-center w-screen h-screen mt-3">
      <FormProvider {...methods}>
        <form className="w-full">
          <Grid templateColumns="repeat(4, 1fr)" className="w-full">
            <GridItem colSpan={1}></GridItem>
            <GridItem colSpan={2} className="flex">
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
                isMulti={false}
                onChange={(v) => console.log(v)}
                onBlur={() => console.log("blur")}
                state="edit"
                required={false}
              />
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            <GridItem colSpan={4} className="flex justify-center">
              <button
                type="submit"
                onClick={methods.handleSubmit((values) => {
                  console.log(values);
                })}
              >
                Submit
              </button>
            </GridItem>
          </Grid>
        </form>
      </FormProvider>
    </div>
  );
}

export default App;
