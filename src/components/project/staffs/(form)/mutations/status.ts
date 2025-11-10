"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteStaffStatus, upsertStaffStatus } from "../../action";

export function upsertStaffStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertStaffStatus,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["staff", "id"];
      if (typeof data === "string") {
        toast.warning("Duplicates", { description: data });
        return;
      }
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(`successfully updated staff's status`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to update staff's status.`);
    },
  });
}

export function deleteStaffStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaffStatus,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["staff", "id"];
      if (typeof data === "string") {
        toast.warning("Warning", { description: data });
        return;
      }
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(`successfully deleted staff's status`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to delete staff's status.`);
    },
  });
}
