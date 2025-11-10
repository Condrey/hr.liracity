import EmptyContainer from "@/components/query-containers/empty-container";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { EmployeeStatusData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface StatusesProps {
  employeeId: string;
  statuses: EmployeeStatusData[];
}

export default function Statuses({ employeeId, statuses }: StatusesProps) {
  return (
    <Item variant={"default"}>
      <ItemContent>
        <ItemActions className="justify-end">
          <Button>Add Status</Button>
        </ItemActions>
        <div>
          {!statuses.length ? (
            <EmptyContainer message="The staff has no status registered yet" />
          ) : (
            <ItemGroup className="space-y-4">
              {statuses.map((status) => (
                <EmployeeStatusItem key={status.id} employeeStatus={status} />
              ))}
            </ItemGroup>
          )}
        </div>{" "}
      </ItemContent>
    </Item>
  );
}

const EmployeeStatusItem = ({
  employeeStatus,
}: {
  employeeStatus: EmployeeStatusData;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Item
      variant={!isExpanded ? "outline" : "muted"}
      className="max-w-5xl transition-colors"
    >
      <ItemHeader className="flex-wrap">
        <span>{` ${formatDate(employeeStatus.date, "PPP")} `}</span>
        <Button
          variant={"secondary"}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon />
            </>
          ) : (
            <>
              Show more
              <ChevronDownIcon />
            </>
          )}
        </Button>
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="uppercase">
          {employeeStatus.statusType}{" "}
          {!!employeeStatus.minuteNumber && (
            <strong className="text-primary inline-flex">
              ( {employeeStatus.minuteNumber})
            </strong>
          )}
        </ItemTitle>
      </ItemContent>
      <ItemFooter
        className={cn(
          "transition-all border-t py-4 gap-1.5 flex-col items-start",
          isExpanded ? "flex animate-in" : "hidden animate-out"
        )}
      >
        <div className="pt-3">
          <strong className="block uppercase"> Reason:</strong>{" "}
          <TipTapViewer content={employeeStatus.reason || "N/A"} />{" "}
        </div>

        <Button
          variant={"secondary"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="max-w-fit mx-auto"
        >
          Show less <ChevronUpIcon />
        </Button>
      </ItemFooter>
    </Item>
  );
};
