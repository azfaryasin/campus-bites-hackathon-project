
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ShimmerProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Shimmer({ 
  className, 
  width = "100%", 
  height = "100%", 
  ...props 
}: ShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted rounded-md",
        className
      )}
      style={{ width, height }}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden h-full flex flex-col">
      <div className="relative">
        <Shimmer height="192px" />
        <div className="absolute top-2 right-2 h-8 w-8 bg-muted-foreground/20 rounded-full"></div>
      </div>
      <div className="p-4 flex-grow space-y-4">
        <Shimmer height="24px" width="70%" />
        <Shimmer height="16px" width="90%" />
        <div className="flex items-center justify-between">
          <Shimmer height="24px" width="40%" />
          <div className="flex gap-1">
            <Shimmer height="20px" width="20px" className="rounded-full" />
            <Shimmer height="20px" width="40px" className="rounded-md" />
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <Shimmer height="40px" />
      </div>
    </div>
  );
}

export function BadgeSkeleton() {
  return (
    <Shimmer className="h-6 w-16 rounded-full" />
  );
}
