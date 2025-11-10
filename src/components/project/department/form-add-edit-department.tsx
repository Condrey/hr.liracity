import ResponsiveDrawer from "@/components/responsive-drawer";
import TipTapEditorWithHeader from "@/components/tip-tap-editor/tip-tap-editor-with-header";
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
import { DepartmentData } from "@/lib/types";
import { departmentSchema, DepartmentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpsertDepartmentMutation } from "./mutation";

interface FormAddEditDepartmentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  departmentToEdit?: DepartmentData;
}
export default function FormAddEditDepartment({
  open,
  setOpen,
  departmentToEdit,
}: FormAddEditDepartmentProps) {
  const form = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
    values: {
      id: departmentToEdit?.id || "",
      name: departmentToEdit?.name || "",
      about: departmentToEdit?.about || "",
    },
  });
  const watchedName = form.watch("name");

  const { isPending, mutate } = useUpsertDepartmentMutation();
  function onSubmit(input: DepartmentSchema) {
    mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={departmentToEdit ? "Update department" : "Add department"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Department name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g Administration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief description</FormLabel>
                <FormControl>
                  <TipTapEditorWithHeader
                    onTextChanged={field.onChange}
                    placeholder={`Brief description about ${
                      watchedName || "this"
                    } department`}
                    initialContent={field.value}
                    includeHeader={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end items-center gap-4">
            <LoadingButton
              loading={isPending}
              disabled={!form.formState.isDirty}
            >
              {departmentToEdit ? "Update department" : "Add department"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
