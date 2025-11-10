import { NumberInput } from "@/components/number-input/number-input";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  FormFooter,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EmployeeSchema } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import ButtonAddEditPosition from "../../position/button-add-edit-position";
import { getAllPositions } from "./action";
import { updateStaffWorkInformationMutation } from "./mutations/work-information";

interface WorkInformationProps {
  form: UseFormReturn<EmployeeSchema>;
}

export default function WorkInformation({ form }: WorkInformationProps) {
  const [openFrom, setOpenFrom] = useState(false);
  const watchedDob = form.watch("workInformation.dob");
  const { mutate, isPending } = updateStaffWorkInformationMutation();
  const query = useQuery({
    queryKey: ["positions"],
    queryFn: getAllPositions,
  });
  const { status, data: positions } = query;
  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex flex-col  md:justify-between md:flex-row gap-4">
        <div className="space-y-4 w-full max-w-2xl">
          {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
          {status === "error" ? (
            <ErrorContainer
              query={query}
              errorMessage=""
              className="min-h-fit"
            />
          ) : status === "pending" ? (
            <EmptyContainer message="" className="min-h-fit items-start w-full">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </EmptyContainer>
          ) : status === "success" && !positions.length ? (
            <EmptyContainer
              message="No positions in the database yet"
              className="min-h-fit w-full"
            >
              <ButtonAddEditPosition>Add position</ButtonAddEditPosition>
            </EmptyContainer>
          ) : (
            <FormField
              control={form.control}
              name="workInformation.position"
              render={({ field }) => {
                const positionId = field.value?.id;
                return (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between h-9",
                            !positionId && "text-muted-foreground"
                          )}
                        >
                          {positionId
                            ? positions.find(
                                (position) => position.id === positionId
                              )?.jobTitle
                            : "Select position"}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-sm p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search position."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No position found</CommandEmpty>
                            <CommandGroup>
                              {positions.map((position) => (
                                <CommandItem
                                  value={position.jobTitle}
                                  key={position.id}
                                  onSelect={() => {
                                    form.setValue("workInformation.position", {
                                      ...position,
                                      duties: position.duties.map(
                                        (p, index) => ({
                                          value: p,
                                          id: index.toString(),
                                        })
                                      ),
                                      reportsToId: position.reportsToId!,
                                    });
                                  }}
                                >
                                  {position.jobTitle}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto",
                                      position.id === positionId
                                        ? "opacity-100"
                                        : "opacity-0"
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
                );
              }}
            />
          )}

          <FormField
            name="workInformation.assumedOffice"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Year of current appointment</FormLabel>
                <FormControl>
                  <NumberInput
                    type="number"
                    placeholder="year of current appointment"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="workInformation.ippsNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Employee/ Computer/ IPPS number</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="enter staff employee/ ipps/ computer number"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="workInformation.supplierNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter supplier number"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="workInformation.fileNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>File number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter file number"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="workInformation.nationalIdNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>National Id number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter national Id number"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="workInformation.taxIdentificationNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>TaxPayer Id number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter taxPayer Id number"
                    type="number"
                    {...field}
                    value={field.value!}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4 w-full max-w-2xl">
          {/* dob Date */}
          <FormField
            control={form.control}
            name="workInformation.dob"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-1 flex-col gap-2">
                    <FormLabel htmlFor="date-from" className="px-1">
                      Date of birth
                    </FormLabel>
                    <Popover open={openFrom} onOpenChange={setOpenFrom}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-from"
                          className="w-full h-9 justify-between font-normal"
                        >
                          {field.value
                            ? field.value.toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={field.value!}
                          onSelect={(date) => {
                            if (date) {
                              // Preserve time when updating date
                              const updated = new Date(field.value ?? date);
                              updated.setFullYear(date.getFullYear());
                              updated.setMonth(date.getMonth());
                              updated.setDate(date.getDate());
                              field.onChange(updated);

                              // Optional: auto-set end date if empty (+2h)
                              if (!watchedDob) {
                                const autoEnd = new Date(updated);
                                autoEnd.setHours(autoEnd.getHours() + 2);
                                form.setValue("workInformation.dob", autoEnd);
                              }
                            }
                            setOpenFrom(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="workInformation.shortMessageToPublic"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Message to Public</FormLabel>
                <FormControl>
                  <TipTapEditorWithHeader
                    includeHeader={false}
                    onTextChanged={field.onChange}
                    initialContent={field.value!}
                    placeholder="what message would you like to convey to the general public?."
                    className="max-h-[30rem] md:min-h-[15rem]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormFooter>
        <LoadingButton
          loading={isPending}
          variant={"secondary"}
          onClick={() => {
            mutate(form.watch("workInformation"));
          }}
        >
          Safe Draft: Work Information
        </LoadingButton>
      </FormFooter>
    </div>
  );
}
