import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UserAvatar from "@/components/ui/user-avatar";
import { UserDataSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotIcon,
  VerifiedIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PersonalInformationProps {
  user: UserDataSelect;
}

export default function PersonalInformation({
  user: {
    avatarUrl,
    bio,
    name,
    email,
    isVerified,
    telephone,
    username,
    gender,
  },
}: PersonalInformationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Item variant={"default"}>
      <ItemHeader className="justify-start">
        <ItemMedia variant={"default"}>
          <UserAvatar avatarUrl={avatarUrl} size={150} />
        </ItemMedia>
        <div>
          <ItemTitle className="uppercase">
            <span>{name}</span>
            {isVerified && (
              <VerifiedIcon className="inline size-4 fill-success text-success-foreground" />
            )}
          </ItemTitle>
          <ItemTitle>{gender || "gender not specified"}</ItemTitle>
          <ItemTitle>
            {!username ? "Missing user name" : `@${username}`}
          </ItemTitle>
          <div className="flex text-muted-foreground items-center text-xs ">
            {email ? (
              <Link
                href={`mailto:${email}`}
                className="hover:text-primary underline"
              >
                {email}
              </Link>
            ) : (
              <em className="text-xs text-muted-foreground">
                --Missing contact--
              </em>
            )}
            <DotIcon />
            {telephone ? (
              <Link
                href={`tel:${telephone}`}
                className="hover:text-primary underline"
              >
                {telephone}
              </Link>
            ) : (
              <em className="text-xs text-muted-foreground">
                --Missing telephone--
              </em>
            )}
          </div>
        </div>
      </ItemHeader>
      <ItemContent>
        <TipTapViewer
          className={cn(
            " border-t pt-4 mt-4 text-sm max-w-4xl w-full line-clamp-5 text-justify hyphens-auto leading-relaxed  ",
            isExpanded ? "line-clamp-none" : "line-clamp-[10] mask-b-from-0%"
          )}
          content={
            bio || "No bio available. Please update staff bio information."
          }
        />
        <div className="w-full flex  max-w-4xl flex-row justify-center">
          <Button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <>
                View less <ChevronUpIcon />
              </>
            ) : (
              <>
                Read More <ChevronDownIcon />
              </>
            )}
          </Button>
        </div>
      </ItemContent>
    </Item>
  );
}
