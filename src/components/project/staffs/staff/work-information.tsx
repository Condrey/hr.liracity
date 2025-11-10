import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Button } from "@/components/ui/button";
import { Item, ItemContent } from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmployeeData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WorkInformationProps {
  employee: EmployeeData;
}

export default function WorkInformation({ employee }: WorkInformationProps) {
  const {
    assumedOffice,
    departMentalSector,
    dob,
    endedOffice,
    fileNumber,
    hierarchy,
    position,
    taxIdentificationNumber,
    shortMessageToPublic,
    supplierNumber,
    departMents,
    ippsNumber,
    nationalIdNumber,
    user: { name },
  } = employee;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider>
      <Item variant={"default"}>
        <ItemContent className="text-sm space-y-8">
          {/* Commence and end of service  */}
          <p>
            <strong className="capitalize">{name?.toLocaleLowerCase()}</strong>{" "}
            joined service in {assumedOffice}{" "}
            <strong className="text-destructive">
              {endedOffice ? `and left on ${endedOffice}` : ""}
            </strong>
          </p>
          <div>
            <h1 className="text-xl h-8 text-muted-foreground tracking-tighter">
              Work related information
            </h1>
            <div className="flex gap-2 flex-col *:bg-muted *:even:bg-muted/50 *:p-2 *:max-w-5xl *:text-sm">
              {/* Job title and reporting officer  */}
              <p className='before:content-["Position:_"] before:font-bold'>
                {!position ? (
                  "Missing Job title"
                ) : (
                  <>
                    Works as {position?.jobTitle}{" "}
                    {!position.reportsTo
                      ? ""
                      : ` reporting to ${position.reportsTo.jobTitle}`}{" "}
                  </>
                )}
              </p>

              {/* Date of birth  */}
              <p className='before:content-["DOB:_"] before:font-bold'>
                {!dob ? "Missing date of birth" : formatDate(dob, "PPPP")}
              </p>
              {/* Ipps number  */}
              <p className='before:content-["Ipps_No.:_"] before:font-bold'>
                {!ippsNumber ? (
                  "Missing IPPS number"
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ippsNumber);
                          toast.success("Copied IPPS number to clipboard");
                        }}
                        className="slashed-zero cursor-pointer proportional-nums text-card-foreground underline hover:text-primary"
                      >
                        {ippsNumber}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy staff IPPS number</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </p>
              {/* Supplier number  */}
              <p className='before:content-["Supplier_No.:_"] before:font-bold'>
                {!supplierNumber ? (
                  "Missing Supplier number"
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(supplierNumber);
                          toast.success("Copied Supplier number to clipboard");
                        }}
                        className="slashed-zero cursor-pointer proportional-nums text-card-foreground underline hover:text-primary"
                      >
                        {supplierNumber}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy staff Supplier number</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </p>
              {/* File number  */}
              <p className='before:content-["File_No.:_"] before:font-bold'>
                {!fileNumber ? (
                  "Missing file number"
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(fileNumber);
                          toast.success("Copied file number to clipboard");
                        }}
                        className="slashed-zero cursor-pointer proportional-nums text-card-foreground underline hover:text-primary"
                      >
                        {fileNumber}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy staff file number</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </p>
              {/* National ID number  */}
              <p className='before:content-["National_Id_Number(NIN):_"] before:font-bold'>
                {!nationalIdNumber ? (
                  "Missing NIN"
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(nationalIdNumber);
                          toast.success("Copied NIN number to clipboard");
                        }}
                        className="slashed-zero cursor-pointer proportional-nums text-card-foreground underline hover:text-primary"
                      >
                        {nationalIdNumber}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy staff NIN</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </p>
              {/* Taxpayer Id Number  */}
              <p className='before:content-["Taxpayer_Id_Number(TIN):_"] before:font-bold'>
                {!taxIdentificationNumber ? (
                  "Missing TIN"
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            taxIdentificationNumber
                          );
                          toast.success("Copied TIN number to clipboard");
                        }}
                        className="slashed-zero cursor-pointer proportional-nums text-card-foreground underline hover:text-primary"
                      >
                        {taxIdentificationNumber}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy staff TIN</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </p>
            </div>
          </div>
          <div>
            <h1 className="text-xl h-8 text-muted-foreground tracking-tighter">
              Head of department of
            </h1>
            {!departMents.length ? (
              <p>Not head of any department</p>
            ) : (
              <div className="flex gap-2 flex-col *:bg-muted *:even:bg-muted/50 *:p-2 *:max-w-5xl *:text-sm">
                {departMents.map((dept) => (
                  <p key={dept.id}>{dept.name} Department</p>
                ))}
              </div>
            )}
          </div>

          <TipTapViewer
            content={
              shortMessageToPublic ||
              "No short message to public available. Please update staff work information."
            }
            className={cn(
              " border-t pt-4 mt-4 text-sm max-w-4xl w-full line-clamp-5 text-justify hyphens-auto leading-relaxed  ",
              isExpanded ? "line-clamp-none" : "line-clamp-[10] mask-b-from-0%"
            )}
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
    </TooltipProvider>
  );
}
