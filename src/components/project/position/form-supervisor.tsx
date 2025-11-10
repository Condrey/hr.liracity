import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { PositionSchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { getAllPositions } from "./action";

import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
interface FormSupervisorProps {
  form: UseFormReturn<PositionSchema>;
}

export default function FormSupervisor({ form }: FormSupervisorProps) {
  const query = useQuery({
    queryKey: ["supervisors"],
    queryFn: getAllPositions,
  });
  const { data, status } = query;
  if (status === "pending")
    return (
      <EmptyContainer message={"Fetching supervisors..."} className="min-h-fit">
        <Loader2Icon className="size-4 animate-spin" />
      </EmptyContainer>
    );
  if (status === "error")
    return (
      <ErrorContainer
        errorMessage="Failed to fetch supervisors"
        query={query}
        className="min-h-fit"
      />
    );
  if (status === "success" && !data.length)
    return (
      <EmptyContainer
        message="No supervisors found. Please add positions first"
        className="min-h-fit"
      />
    );
  return (
    <FormField
      control={form.control}
      name="reportsToId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Reports to</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? data.find((d) => d.id === field.value)?.jobTitle
                    : "Select supervisor"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search supervisor..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No supervisor found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="Not Applicable"
                      onSelect={() => form.setValue("reportsToId", "")}
                      className="text-muted-foreground"
                    >
                      Not Applicable
                    </CommandItem>
                    {data.map((d) => (
                      <CommandItem
                        value={d.jobTitle}
                        key={d.id}
                        onSelect={() => {
                          form.setValue("reportsToId", d.id);
                        }}
                      >
                        {d.jobTitle}
                        <Check
                          className={cn(
                            "ml-auto",
                            d.id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
