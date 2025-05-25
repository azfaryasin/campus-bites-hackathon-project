import * as React from "react";
import { cn } from "../lib/utils";
import { Check, Clock } from "lucide-react";

interface StatusUpdate {
  status: string;
  timestamp: number;
}

interface OrderStatusProgressProps {
  currentStatus: string;
  statusHistory: StatusUpdate[];
  orderId: string;
}

const orderStatuses = [
  "Order Received",
  "Preparing",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];

export function OrderStatusProgress({
  currentStatus,
  statusHistory,
  orderId,
}: OrderStatusProgressProps) {
  const currentStep = orderStatuses.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  const getStatusTime = (status: string) => {
    const update = statusHistory.find((s) => s.status === status);
    return update ? new Date(update.timestamp).toLocaleTimeString() : "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Order Status</span>
        <span className="text-muted-foreground">#{orderId}</span>
      </div>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />

        {/* Status Steps */}
        <div className="relative space-y-4">
          {orderStatuses.map((status, index) => {
            if (status === "Cancelled" && !isCancelled) return null;
            if (!isCancelled && currentStatus !== "Cancelled" && index > currentStep)
              return null;

            const isActive = index <= currentStep;
            const statusTime = getStatusTime(status);

            return (
              <div
                key={status}
                className={cn(
                  "flex items-center gap-3",
                  status === "Cancelled" && "text-destructive"
                )}
              >
                <div
                  className={cn(
                    "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                    isActive
                      ? status === "Cancelled"
                        ? "border-destructive bg-destructive text-destructive-foreground"
                        : "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-muted text-muted-foreground"
                  )}
                >
                  {isActive ? (
                    status === "Cancelled" ? (
                      <span className="text-xs">✕</span>
                    ) : (
                      <Check className="h-3 w-3" />
                    )
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {status}
                  </span>
                  {statusTime && (
                    <span className="text-xs text-muted-foreground">
                      {statusTime}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 