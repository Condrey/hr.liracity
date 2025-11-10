"use client";

import { cn } from "@/lib/utils";
import {
  DefinedUseQueryResult,
  QueryObserverLoadingErrorResult,
} from "@tanstack/react-query";
import LoadingButton from "../ui/loading-button";

interface ErrorContainerProps {
  errorMessage: string;
  query: DefinedUseQueryResult | QueryObserverLoadingErrorResult;
  className?: string;
}

export default function ErrorContainer({
  errorMessage,
  query,
  className,
}: ErrorContainerProps) {
  console.error(query.error);
  return (
    <div
      className={cn(
        "flex flex-col gap-4 min-h-[20rem] items-center justify-center",
        className
      )}
    >
      <p className="max-w-sm text-muted-foreground text-center">
        {errorMessage}
      </p>
      <LoadingButton
        loading={query.isFetching}
        variant={"destructive"}
        onClick={() => query.refetch()}
      >
        Refresh
      </LoadingButton>
    </div>
  );
}
