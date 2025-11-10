"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import FormAddEditPosition from "./form-add-edit-position";
import { PositionData } from "@/lib/types";

interface ButtonAddEditPositionProps extends ButtonProps {
	position?: PositionData;
}

export default function ButtonAddEditPosition({ position, ...props }: ButtonAddEditPositionProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button title={position ? "Edit Position" : "Add Position"} onClick={() => setOpen(true)} {...props} />
			<FormAddEditPosition open={open} setOpen={setOpen} position={position} />
		</>
	);
}
