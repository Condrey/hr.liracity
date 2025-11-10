"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import Linkify from "./linkify";

import { useSession } from "@/app/session-provider";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { UserDataSelect } from "@/lib/types";
import UserAvatar from "./user-avatar";

interface UserTooltipProps extends PropsWithChildren {
  user: UserDataSelect;
}

export default function UserTooltip({ user, children }: UserTooltipProps) {
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const userDetailsUrl = getNavigationLinkWithPathnameWithoutUpdate(
    `/users/${user.username}`
  );
  const { user: loggedInUser } = useSession();

  //   const followerState: FollowerInfo = {
  //     followersCount: user._count.followers,
  //     isFollowingByUser: !!user.followers.some(
  //       ({ followerId }) => followerId === loggedInUser.id,
  //     ),
  //   };
  return (
    <TooltipProvider key={user.id}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="outline">
          <div className="flex  max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-start gap-2">
              <Link href={userDetailsUrl}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              <div>
                <p>{user.telephone}</p>
                <p>{user.email}</p>
                {<p>{user.gender}</p>}
              </div>
              {/* {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )} */}
            </div>
            <div>
              <Link href={userDetailsUrl}>
                <div className="text-lg font-semibold hover:underline">
                  {user.name || user.username || user.email}
                </div>
                {user.username && <div className="">@{user.username}</div>}
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <TipTapViewer
                  content={user.bio}
                  className="line-clamp-4 whitespace-pre-line"
                />
              </Linkify>
            )}

            {/* <FollowerCount userId={user.id} initialState={followerState} /> */}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
