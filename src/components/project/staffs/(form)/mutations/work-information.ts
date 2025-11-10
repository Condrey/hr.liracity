"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateStaffWorkInformation } from "../../action";

export function updateStaffWorkInformationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStaffWorkInformation,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["staff", "id"];
      if (typeof data === "string") {
        toast.warning("Duplicates", { description: data });
        return;
      }
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(
        `successfully updated staff ${data.user.name}'s work information`
      );
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(`Failed to update staff work information.`);
    },
  });
}
