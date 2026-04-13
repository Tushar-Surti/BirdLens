import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "grain-surface rounded-[28px] border border-[var(--color-border)] shadow-[var(--shadow-card)]",
        className
      )}
    >
      {children}
    </div>
  );
}
