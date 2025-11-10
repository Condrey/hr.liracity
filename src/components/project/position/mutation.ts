import { PositionData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePosition, upsertPosition } from "./action";

const queryKey: QueryKey = ["positions"];
export function upsertPositionMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: upsertPosition,
		async onSuccess(data, variables, context) {
			await queryClient.cancelQueries({ queryKey });
			queryClient.setQueryData<PositionData[]>(queryKey, (oldData) => {
				if (!oldData) return [data];
				if (variables.id) {
					toast.success("Position updated successfully");
					return oldData.map((p) => (p.id === data.id ? data : p));
				}
				toast.success("Position created successfully");
				return [data, ...oldData];
			});
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to save position. Please try again.");
		}
	});
}

export function deletePositionMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePosition,
		async onSuccess(data, variables, context) {
			await queryClient.cancelQueries({ queryKey });
			queryClient.setQueryData<PositionData[]>(queryKey, (oldData) => {
				if (!oldData) return;
				toast.success(`${data.jobTitle} was successfully removed from the database.`);
				return oldData.filter((d) => d.id !== data.id);
			});
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to remove position. Please try again.");
		}
	});
}
