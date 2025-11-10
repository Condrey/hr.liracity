"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertStaffPersonalInformation } from "../../action";

export function upsertStaffPersonalInformationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertStaffPersonalInformation,
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["staff", "id"];
      if (typeof data === "string") {
        toast.warning("Duplicates", { description: data });
        return;
      }
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(
        `successfully updated staff ${data.name}'s personal information`
      );
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error(
        `Failed to update staff ${variables.name} personal information.`
      );
    },
  });
}
