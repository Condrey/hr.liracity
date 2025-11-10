"use client";

import { useTheme } from "next-themes";

import { Button, ButtonProps } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, Monitor, Moon, Sun } from "lucide-react";

interface ThemeToggleProps extends ButtonProps {}
export function ThemeToggle({ children, ...props }: ThemeToggleProps) {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="relative " title="Theme" {...props}>
					<Moon className="hidden size-4 dark:inline" />
					<Sun className="inline size-4 dark:hidden" />
					<span className="sr-only">Toggle theme</span>
					{children}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="*:flex *:items-center *:gap-2">
				<DropdownMenuLabel>UI Theme</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun className="size-5" /> Light <Check className={cn("size-4", theme !== "light" && "hidden")} />
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon className="size-5" /> Dark <Check className={cn("size-4", theme !== "dark" && "hidden")} />
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<Monitor className="size-5" /> System <Check className={cn("size-4", theme !== "system" && "hidden")} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
