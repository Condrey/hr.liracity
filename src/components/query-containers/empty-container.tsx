import { cn } from "@/lib/utils";

interface EmptyContainerProps {
	message: string;
	children?: React.ReactNode;
	className?: string;
}
export default function EmptyContainer({ message, children, className }: EmptyContainerProps) {
	return (
		<div className={cn("flex flex-col gap-4 min-h-[20rem] items-center justify-center", className)}>
			<p className="max-w-sm text-muted-foreground text-center">{message}</p>
			{children}
		</div>
	);
}
