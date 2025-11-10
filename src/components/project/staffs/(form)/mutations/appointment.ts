"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteStaffAppointment, upsertStaffAppointment } from "../../action";

export function upsertStaffAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertStaffAppointment,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["staff", "id"];
      if (typeof data === "string") {
        toast.warning("Duplicates", { description: data });
        return;
      }
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(`successfully updated staff's appointment`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to update staff's appointment.`);
    },
  });
}

export function deleteStaffAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaffAppointment,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["staff", "id"];
      if (typeof data === "string") {
        toast.warning("Warning", { description: data });
        return;
      }
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(`successfully deleted staff's appointment`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to delete staff's appointment.`);
    },
  });
}
