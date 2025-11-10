"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDepartment, upsertDepartment } from "./action";

const queryKey: QueryKey = ["department"];

export function useUpsertDepartmentMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertDepartment,
    onSuccess: async (data, variables) => {
      const key2: QueryKey = ["staff-list", "department", data.id];
      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: key2 }),
      ]);
      const isSubmission = !variables.id;

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: key2 });

      toast.success(
        `${isSubmission ? "Added" : "Updated"} ${
          data.name
        } department successfully`
      );
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(
        `Failed to ${variables.id ? "update" : "add"} ${
          variables.name
        } department.`
      );
    },
  });
  return mutation;
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    async onSuccess(data, variables, context) {
      const key2: QueryKey = ["staff-list", "department", data.id];

      await queryClient.cancelQueries({ queryKey });

      await Promise.all([
        await queryClient.cancelQueries({ queryKey }),
        await queryClient.cancelQueries({ queryKey: key2 }),
      ]);
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: key2 });
      toast.success(`Deleted ${data.name} department successfully`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to delete department.`);
    },
  });
}
