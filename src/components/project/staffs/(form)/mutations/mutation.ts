"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEmployee, upsertStaffEmployee } from "../../action";

export function upsertStaffEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertStaffEmployee,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["staff", "id", variables.id];
      if (typeof data === "string") {
        toast.warning("Duplicates", { description: data });
        return;
      }
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(
        `successfully updated staff ${data.user.name}'s information`
      );
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(
        `Failed to update staff ${variables.personalInformation.name} information.`
      );
    },
  });
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["staff", "id", data.id];

      queryClient.invalidateQueries({ queryKey });

      toast.success(`Successfully deleted ${data.user.name} from the system`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to delete employee.`);
    },
  });
}
