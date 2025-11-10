"use client";

import kyInstance from "@/lib/ky";
import { UserDataSelect } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserTooltip from "./user-tooltip";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

interface UserLinkWithTooltipProps extends PropsWithChildren {
	username: string;
}

export default function UserLinkWithTooltip({ children, username }: UserLinkWithTooltipProps) {
		const {getNavigationLinkWithPathnameWithoutUpdate} = useCustomSearchParams()
		const userDetailsUrl = getNavigationLinkWithPathnameWithoutUpdate(`/users/${username}`)
	const { data } = useQuery({
		queryKey: ["user-data", username],
		queryFn: () => kyInstance.get(`/api/users/username/${username}`).json<UserDataSelect>(),
		retry(failureCount, error) {
			if (error instanceof HTTPError && error.response.status === 404) {
				return false;
			}
			return failureCount < 3;
		},
		staleTime: Infinity
	});

	if (!data) {
		return (
			<Link href={userDetailsUrl} className="text-primary hover:underline">
				{children}
			</Link>
		);
	}

	return (
		<UserTooltip user={data} >
			<Link href={userDetailsUrl} className="text-primary hover:underline">
				{children}
			</Link>
		</UserTooltip>
	);
}
