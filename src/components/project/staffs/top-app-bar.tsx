"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn, siteConfig, webName } from "@/lib/utils";

interface TopAppBarProps {
  className?: string;
}

export default function TopAppBar({ className }: TopAppBarProps) {
  const isMobile = useIsMobile();
  return (
    <header className={cn("", className)}>
      <span className="uppercase">{isMobile ? webName : siteConfig.name}</span>
    </header>
  );
}
