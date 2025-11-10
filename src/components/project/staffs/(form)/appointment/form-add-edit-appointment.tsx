"use client";

import { NumberInput } from "@/components/number-input/number-input";
import { getAllPositions } from "@/components/project/position/action";
import ButtonAddEditPosition from "@/components/project/position/button-add-edit-position";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import ResponsiveDrawer from "@/components/responsive-drawer";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentType } from "@/generated/prisma";
import { AppointmentData } from "@/lib/types";
import { cn, organization } from "@/lib/utils";
import {
  appointmentSchema,
  AppointmentSchema,
  EmployeeSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import cuid from "cuid";
import { CheckIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import {
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  useForm,
} from "react-hook-form";
import { upsertStaffAppointmentMutation } from "../mutations/appointment";

interface FormAddEditAppointmentProps {
  append: UseFieldArrayAppend<EmployeeSchema>;
  update: UseFieldArrayUpdate<EmployeeSchema>;
  appointment?: AppointmentData;
  open: boolean;
  index?: number;
  employeeId: string;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditAppointment({
  append: addAppointment,
  update: updateAppointment,
  appointment,
  index,
  employeeId,
  open,
  setOpen,
}: FormAddEditAppointmentProps) {
  const [openAppointmentDate, setOpenAppointmentDate] = useState(false);
  const [openAssumptionDate, setOpenAssumptionDate] = useState(false);

  const form2 = useForm<AppointmentSchema>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      ...appointment,
      id: appointment?.id || cuid(),
      dateOfAppointment: appointment?.dateOfAppointment!,
      number: appointment?.number!,
      position: !appointment?.position
        ? undefined
        : {
            ...appointment?.position,
            id: appointment?.position.id!,
            reportsToId: appointment?.position.reportsToId!,
            duties: appointment?.position.duties.map((d, index) => ({
              value: d,
              id: index.toString(),
            }))!,
          },
      organization: appointment?.organization || organization,
      dateOfAssumptionOfDuty: appointment?.dateOfAssumptionOfDuty!,
      dutyStation: appointment?.dutyStation!,
      minuteNumber: appointment?.minuteNumber!,
    },
  });
  const watchedDateOfAppointment = form2.watch("dateOfAppointment");
  const watchedDateOfAssumptionOfDuty = form2.watch("dateOfAssumptionOfDuty");
  const query = useQuery({
    queryKey: ["positions"],
    queryFn: getAllPositions,
  });
  const { status, data: positions } = query;
  const { mutate, isPending } = upsertStaffAppointmentMutation();

  const onSubmit = (input: AppointmentSchema) => {
    mutate(
      { input, employeeId },
      {
        onSuccess: () => {
          if (!appointment) {
            addAppointment(input);
          } else {
            updateAppointment(index!, input);
          }
          setOpen(false);
        },
      }
    );
  };

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      modal={true}
      title={appointment ? "Edit this appointment" : "Add a new appointment"}
      description={
        appointment
          ? "Make changes to this appointment"
          : "Create a new appointment in the database."
      }
      className="  w-full  px-4 max-w-4xl"
    >
      {/* <pre>{JSON.stringify(form2.formState.errors, null, 2)}</pre> */}
      <Form {...form2}>
        <form className="space-y-4 " onSubmit={form2.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 md:gap-6 border-t pt-2 *:flex-1 md:flex-row  ">
            <div className="flex flex-col gap-4 md:pe-2 ">
              {status === "error" ? (
                <ErrorContainer
                  query={query}
                  errorMessage=""
                  className="min-h-fit"
                />
              ) : status === "pending" ? (
                <EmptyContainer
                  message=""
                  className="min-h-fit items-start w-full"
                >
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
                  control={form2.control}
                  name="position"
                  render={({ field }) => {
                    const positionId = field.value?.id;
                    return (
                      <FormItem>
                        <FormLabel required>Position</FormLabel>
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
                                        form2.setValue("position", {
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
                control={form2.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Appointment type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <FormControl>
                          <SelectValue
                            placeholder="Please choose a type"
                            defaultValue={field.value!}
                          />
                        </FormControl>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Appointment types</SelectLabel>
                          {Object.values(AppointmentType).map((a) => {
                            return (
                              <SelectItem key={a} value={a}>
                                <div className="flex gap-2">{a}</div>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form2.control}
                name="basicSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Basic Monthly Salary</FormLabel>
                    <FormControl>
                      <NumberInput
                        placeholder="enter basic salary"
                        {...field}
                        value={field.value!}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form2.control}
                name="dateOfAppointment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-1 flex-col gap-2">
                        <FormLabel
                          required
                          htmlFor="date-from"
                          className="px-1"
                        >
                          Date of Appointment
                        </FormLabel>
                        <Popover
                          open={openAppointmentDate}
                          onOpenChange={setOpenAppointmentDate}
                        >
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
                                  if (!watchedDateOfAppointment) {
                                    const autoEnd = new Date(updated);
                                    autoEnd.setHours(autoEnd.getHours() + 2);
                                    form2.setValue(
                                      "dateOfAppointment",
                                      autoEnd
                                    );
                                  }
                                }
                                setOpenAppointmentDate(false);
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
                control={form2.control}
                name="dutyStation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Duty Station</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Which location shall the staff be working at?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 md:ps-2">
              <FormField
                control={form2.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Number of appointment</FormLabel>
                    <FormControl>
                      <NumberInput
                        type="number"
                        placeholder="e.g., 3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Give the nth number of appointment
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form2.control}
                name="minuteNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Minute number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter appointment minute number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form2.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Site/ vote</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter administrative site"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form2.control}
                name="dateOfAssumptionOfDuty"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-1 flex-col gap-2">
                        <FormLabel
                          required
                          htmlFor="date-from"
                          className="px-1"
                        >
                          Date of Assumption Of Duty
                        </FormLabel>
                        <Popover
                          open={openAssumptionDate}
                          onOpenChange={setOpenAssumptionDate}
                        >
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
                                  if (!watchedDateOfAssumptionOfDuty) {
                                    const autoEnd = new Date(updated);
                                    autoEnd.setHours(autoEnd.getHours() + 2);
                                    form2.setValue(
                                      "dateOfAssumptionOfDuty",
                                      autoEnd
                                    );
                                  }
                                }
                                setOpenAssumptionDate(false);
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
              <LoadingButton
                loading={isPending}
                type="button"
                className="w-full"
                onClick={() => form2.handleSubmit(onSubmit)()}
              >
                {appointment ? "Update" : "Create"}
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
