import Link from "next/link";
import React from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./user-link-with-tooltip";
interface LinkifyProps {
	children: React.ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
	return (
		<LinkifyUsername>
			<LinkifyHashtag>
				<LinkifyUrl>{children}</LinkifyUrl>
			</LinkifyHashtag>
		</LinkifyUsername>
	);
}

export function LinkifyUrl({ children }: LinkifyProps) {
	return <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>;
}

function LinkifyUsername({ children }: LinkifyProps) {
	return (
		<LinkIt
			regex={/(@[a-zA-Z0-9_-]+)/}
			component={(match, key) => {
				const username = match.slice(1);
				return (
					<UserLinkWithTooltip key={key} username={username}>
						{match}
					</UserLinkWithTooltip>
				);
			}}
		>
			{children}
		</LinkIt>
	);
}

function LinkifyHashtag({ children }: LinkifyProps) {
	return (
		<LinkIt
			regex={/(#[a-zA-Z0-9]+)/}
			component={(match, key) => {
				const hashTagText = match.slice(1);
				return (
					<Link key={key} href={`/hashtag/${hashTagText}`} className="text-primary hover:underline">
						{match}
					</Link>
				);
			}}
		>
			{children}
		</LinkIt>
	);
}
