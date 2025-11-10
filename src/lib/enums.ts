import { EventStatus, NewsArticleStatus, Role } from "@/generated/prisma";
import { InboxIcon, LetterTextIcon, LockIcon, LucideIcon, TrashIcon, UploadIcon } from "lucide-react";

// role
const allRoles = Object.values(Role);
export const myPrivileges: Record<Role, Role[]> = {
	ADMIN: allRoles,
	MODERATOR: allRoles.filter((role) => role !== Role.ADMIN),
	STAFF: [Role.STAFF,Role.USER],
	USER: []
};
export const userRoles: Record<Role, { role: string }> = {
	USER: {
		role: "Visitor"
	},
	ADMIN: {
		role: "Administrator"
	},
	MODERATOR: {
		role: "Moderator"
	},
	STAFF: {
		role: "Staff"
	}
};

// event
export const allEventStatuses = Object.values(EventStatus);
export const eventStatuses: Record<
	EventStatus,
	{
		eventStatus: string;
		icon: LucideIcon;
		variant: "default" | "success" | "outline" | "destructive" | "secondary" | "warning" | null | undefined;
	}
> = {
	DRAFT: {
		eventStatus: "Draft",
		icon: LetterTextIcon,
		variant: "warning"
	},
	PUBLISHED: {
		eventStatus: "Published",
		icon: UploadIcon,
		variant: "success"
	},
	CANCELLED: {
		eventStatus: "Cancelled",
		icon: TrashIcon,
		variant: "destructive"
	},
	PRIVATE: {
		eventStatus: "Private",
		icon: LockIcon,
		variant: "destructive"
	}
};

// news article

export const allNewsArticleStatuses = Object.values(NewsArticleStatus);
export const newsArticleStatuses: Record<
	NewsArticleStatus,
	{
		newsArticleStatus: string;
		icon: LucideIcon;
		variant: "default" | "success" | "outline" | "destructive" | "secondary" | "warning" | null | undefined;
	}
> = {
	DRAFT: {
		newsArticleStatus: "Draft",
		icon: LetterTextIcon,
		variant: "warning"
	},
	PUBLISHED: {
		newsArticleStatus: "Published",
		icon: UploadIcon,
		variant: "success"
	},
	PRIVATE: {
		newsArticleStatus: "Private",
		icon: LockIcon,
		variant: "destructive"
	},
	ARCHIVED: {
		newsArticleStatus: "Archived",
		icon: InboxIcon,
		variant: "outline"
	}
};
