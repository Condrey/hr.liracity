"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { PositionData } from "@/lib/types";
import { useState } from "react";
import { deletePositionMutation } from "./mutation";

interface ButtonDeletePositionProps extends ButtonProps {
	position: PositionData;
}

export default function ButtonDeletePosition({ position, ...props }: ButtonDeletePositionProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button title={position ? "Edit Position" : "Add Position"} onClick={() => setOpen(true)} {...props} />
			<DialogDeletePosition open={open} setOpen={setOpen} position={position} />
		</>
	);
}

interface DialogDeletePositionProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	position: PositionData;
}
export function DialogDeletePosition({ open, setOpen, position }: DialogDeletePositionProps) {
	const { isPending, mutate } = deletePositionMutation();
	const deleteItem = () => mutate(position.id, { onSuccess: () => setOpen(false) });

	return (
		<ResponsiveDrawer
			open={open}
			setOpen={setOpen}
			title={`Delete ${position.jobTitle}`}
			description="Please know that this action can not be undone, proceed with caution."
		>
			<DialogFooter>
				<Button variant={"outline"} onClick={() => setOpen(false)}>
					Cancel
				</Button>
				<LoadingButton loading={isPending} variant={"destructive"} onClick={deleteItem}>
					Delete
				</LoadingButton>
			</DialogFooter>
		</ResponsiveDrawer>
	);
}
