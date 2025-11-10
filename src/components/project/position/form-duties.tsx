import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PositionSchema,
  stringArraySchema,
  StringArraySchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface FormDutiesProps {
  form: UseFormReturn<PositionSchema>;
}

export default function FormDuties({ form }: FormDutiesProps) {
  const form2 = useForm<StringArraySchema>({
    resolver: zodResolver(stringArraySchema),
    defaultValues: {
      value: "",
    },
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "duties",
  });
  const addValue = (input: StringArraySchema) => {
    append(input);
    form2.reset();
  };
  return (
    <>
      <FormField
        control={form.control}
        name="duties"
        render={() => (
          <FormItem>
            <FormLabel>
              Duties{" "}
              <span className="text-xs text-muted-foreground">
                ({form.watch("duties")?.length})
              </span>
            </FormLabel>
            <FormField
              control={form2.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter Key duty and responsibility for the JD"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), form2.handleSubmit(addValue)())
                        }
                        {...field}
                      />
                      <Button
                        type="button"
                        onClick={() => form2.handleSubmit(addValue)()}
                        size="icon"
                        variant={"outline"}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormMessage />
          </FormItem>
        )}
      />

      <ol className="flex list-inside list-decimal flex-col gap-2">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className={cn(
              "w-fit max-w-sm gap-1",
              badgeVariants({ variant: "secondary" })
            )}
          >
            <span className="line-clamp-1 text-ellipsis">
              {form.watch(`duties.${index}.value`)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-inline h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => remove(index)}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ol>
    </>
  );
}
