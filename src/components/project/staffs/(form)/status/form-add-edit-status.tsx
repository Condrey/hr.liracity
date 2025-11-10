"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
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
import { StatusType } from "@/generated/prisma";
import { EmployeeStatusData } from "@/lib/types";
import {
  EmployeeSchema,
  employeeStatusSchema,
  EmployeeStatusSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import {
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  useForm,
} from "react-hook-form";
import { upsertStaffStatusMutation } from "../mutations/status";

interface FormAddEditEmployeeStatusProps {
  append: UseFieldArrayAppend<EmployeeSchema>;
  update: UseFieldArrayUpdate<EmployeeSchema>;
  employeeStatus?: EmployeeStatusData;
  index?: number;
  employeeId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditEmployeeStatus({
  append: addEmployeeStatus,
  update: updateEmployeeStatus,
  employeeStatus,
  employeeId,
  open,
  index,
  setOpen,
}: FormAddEditEmployeeStatusProps) {
  const [openEmployeeStatusDate, setOpenEmployeeStatusDate] = useState(false);

  const form2 = useForm<EmployeeStatusSchema>({
    resolver: zodResolver(employeeStatusSchema),
    defaultValues: {
      ...employeeStatus,
      id: employeeStatus?.id || cuid(),
      date: employeeStatus?.date!,
      employeeId: employeeStatus?.employeeId || employeeId || "",
      reason: employeeStatus?.reason,
      statusType: employeeStatus?.statusType,
      minuteNumber: employeeStatus?.minuteNumber!,
    },
  });

  const { mutate, isPending } = upsertStaffStatusMutation();

  const onSubmit = (input: EmployeeStatusSchema) => {
    mutate(
      { input },
      {
        onSuccess: () => {
          if (!employeeStatus) {
            addEmployeeStatus(input);
          } else {
            updateEmployeeStatus(index!, input);
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
      title={
        employeeStatus ? "Edit this employeeStatus" : "Add a new employeeStatus"
      }
      description={
        employeeStatus
          ? "Make changes to this employeeStatus"
          : "Create a new employeeStatus in the database."
      }
      className="  w-full  px-4 max-w-4xl"
    >
      {/* <pre>{JSON.stringify(form2.formState.errors, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(form2.watch(), null, 2)}</pre> */}
      <Form {...form2}>
        <form className="space-y-4 " onSubmit={form2.handleSubmit(onSubmit)}>
          <FormField
            control={form2.control}
            name="statusType"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Employee Status type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <FormControl>
                      <SelectValue
                        placeholder="Please choose a type"
                        defaultValue={field.value}
                      />
                    </FormControl>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>EmployeeStatus types</SelectLabel>
                      {Object.values(StatusType).map((a) => {
                        return (
                          <SelectItem key={a} value={a as StatusType}>
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-1 flex-col gap-2">
                    <FormLabel required htmlFor="date-from" className="px-1">
                      Date of Occurrence
                    </FormLabel>
                    <Popover
                      open={openEmployeeStatusDate}
                      onOpenChange={setOpenEmployeeStatusDate}
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
                            }
                            setOpenEmployeeStatusDate(false);
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
            name="minuteNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minute number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter minute number"
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
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <TipTapEditorWithHeader
                    placeholder="enter administrative site"
                    onTextChanged={field.onChange}
                    initialContent={field.value!}
                    includeHeader={false}
                    {...field}
                  />
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
            {employeeStatus ? "Update" : "Create"}
          </LoadingButton>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
