"use client";

import { useSession } from "@/app/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Role } from "@/generated/prisma";
import { myPrivileges } from "@/lib/enums";
import { DepartmentData, EmployeeData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { departmentSchema, DepartmentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpsertDepartmentMutation } from "./mutation";

interface ButtonAssignHodProps extends ButtonProps {
  department: DepartmentData;
  staffs: EmployeeData[];
}
export default function ButtonAssignHod({
  department,
  staffs,
  ...props
}: ButtonAssignHodProps) {
  const { user } = useSession();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) return null;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        title={
          department
            ? `Update ${department.name} department's value`
            : "Create a new department"
        }
        {...props}
      />
      <FormAssignHodProps
        department={department}
        open={open}
        setOpen={setOpen}
        staffs={staffs}
      />
    </>
  );
}

interface FormAssignHodProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  department: DepartmentData;
  staffs: EmployeeData[];
}

function FormAssignHodProps({
  open,
  setOpen,
  department,
  staffs,
}: FormAssignHodProps) {
  const form = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
    values: {
      id: department.id,
      name: department.name,
      about: department.about || "",
      headOfDepartmentId: department.headOfDepartmentId || "",
    },
  });

  const { isPending, mutate } = useUpsertDepartmentMutation();
  function onSubmit(input: DepartmentSchema) {
    mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetContent side="top" className="min-h-[50vh]">
        <SheetHeader>
          <SheetTitle>
            {department ? "Update department" : "Add department"}
          </SheetTitle>
        </SheetHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-md w-full mx-auto"
            >
              <FormField
                control={form.control}
                name="headOfDepartmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Head of Department</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className=" justify-between"
                        >
                          {field.value
                            ? staffs.find((staff) => staff.id === field.value)
                                ?.user.name
                            : "Select HOD..."}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search HOD..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No staff found.</CommandEmpty>
                            <CommandGroup>
                              {staffs.map((staff) => (
                                <CommandItem
                                  key={staff.id}
                                  value={staff.user.name!}
                                  onSelect={() => field.onChange(staff.id)}
                                >
                                  {staff.user.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto",
                                      field.value === staff.id
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
                )}
              />
              <div className="flex w-full justify-end items-center gap-4">
                <LoadingButton
                  loading={isPending}
                  disabled={!form.formState.isDirty}
                >
                  {department.headOfDepartment ? "Update HOD" : "Assign HOD"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
