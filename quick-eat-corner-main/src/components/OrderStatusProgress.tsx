import { motion } from 'framer-motion';
// import { Progress } from "@/components/ui/progress"; // Not directly used for animation anymore
import { Badge } from "@/components/ui/badge";
import { Clock, Check, ChefHat, UserCheck, RefreshCw, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/components/ui/sonner";
import { useState, useEffect } from "react";

interface StatusUpdate {
  status: string;
  timestamp: number;
}

interface OrderStatusProgressProps {
  currentStatus: string;
  statusHistory: StatusUpdate[];
  orderId: string;
}

const orderSteps = ["Order Received", "Preparing", "Ready for Pickup", "Completed"];

// Helper to format timestamp to a readable time string (e.g., 10:30 AM)
const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function OrderStatusProgress({ currentStatus, statusHistory, orderId }: OrderStatusProgressProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(-1);

  useEffect(() => {
    setCurrentStatusIndex(orderSteps.indexOf(currentStatus));
  }, [currentStatus]);

  const getProgressPercentage = () => {
    if (currentStatus === "Cancelled") return 0;
    return currentStatusIndex >= 0 ? ((currentStatusIndex + 1) / orderSteps.length) * 100 : 0;
  };

  const getCurrentStatusInfo = () => {
    const currentStatusUpdate = statusHistory.find(s => s.status === currentStatus) || statusHistory[statusHistory.length - 1];
    if (!currentStatusUpdate) return "Updating status...";

    const now = Date.now();
    const elapsedMinutes = Math.floor((now - currentStatusUpdate.timestamp) / (60 * 1000));

    switch (currentStatus) {
      case "Order Received":
        return `Prep starts in ~1 min`;
      case "Preparing":
        // Example: 10 min prep time from when "Preparing" status was set
        const preparingTimestamp = statusHistory.find(s => s.status === "Preparing")?.timestamp || currentStatusUpdate.timestamp;
        const prepElapsedMinutes = Math.floor((now - preparingTimestamp) / (60 * 1000));
        return `Ready in ~${Math.max(10 - prepElapsedMinutes, 1)} mins`; 
      case "Ready for Pickup":
        return `Fresh for ~10 mins`;
      case "Completed":
        return `Order completed ${elapsedMinutes > 0 ? elapsedMinutes + ' mins ago' : 'just now'}`;
      case "Cancelled":
        return `Order cancelled ${elapsedMinutes > 0 ? elapsedMinutes + ' mins ago' : 'just now'}`;
      default:
        return `Updated ${elapsedMinutes > 0 ? elapsedMinutes + ' mins ago' : 'just now'}`;
    }
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "Order Received":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {currentStatus}</Badge>;
      case "Preparing":
        return <Badge variant="secondary" className="gap-1"><ChefHat className="h-3 w-3" /> {currentStatus}</Badge>;
      case "Ready for Pickup":
        return <Badge variant="default" className="gap-1 text-primary-foreground"><UserCheck className="h-3 w-3" /> {currentStatus}</Badge>;
      case "Completed":
        return <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> {currentStatus}</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> {currentStatus}</Badge>; 
      default:
        return <Badge>{currentStatus}</Badge>;
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // In a real app, this would fetch new status from a backend
    setTimeout(() => {
      toast(`Simulated check for order #${orderId} status updates.`);
      // Potentially update statusHistory and currentStatus here if new data was fetched
      setIsRefreshing(false);
    }, 1000);
  };

  const progressBarVariants = {
    initial: { width: "0%" }, // Ensure width is a string percentage
    animate: { 
      width: `${getProgressPercentage()}%`,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const stepLabelVariants = {
    initial: { opacity: 0.5, y: 5 },
    active: { opacity: 1, y: 0, fontWeight: 'bold', color: 'var(--primary)' },
    completed: { opacity: 1, y: 0, color: 'var(--primary)' },
    inactive: { opacity: 0.6, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4" // Increased spacing for timestamps
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {getStatusBadge()}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{getCurrentStatusInfo()}</span>
          {currentStatus !== "Completed" && currentStatus !== "Cancelled" && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh order status"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>
      
      {currentStatus !== "Cancelled" ? (
        <>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              variants={progressBarVariants}
              initial="initial"
              animate="animate"
            />
          </div>
          
          <div className="flex justify-between text-xs mt-1.5"> {/* Adjusted margin top */}
            {orderSteps.map((step, index) => {
              const statusUpdateForStep = statusHistory.find(s => s.status === step);
              const stepTimestamp = statusUpdateForStep ? formatTimestamp(statusUpdateForStep.timestamp) : "";
              
              return (
                <motion.div // Changed to div to allow stacking of label and timestamp
                  key={step}
                  className="flex flex-col items-center text-center flex-1 px-1" // Added flex-1 for even distribution
                  variants={stepLabelVariants}
                  initial="initial"
                  animate={index === currentStatusIndex ? "active" : (index < currentStatusIndex ? "completed" : "inactive")}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <span className="text-muted-foreground">{step}</span>
                  {stepTimestamp && (
                    <span className="text-muted-foreground/80 text-[10px] mt-0.5">
                      {stepTimestamp}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-sm text-destructive text-center py-2">
          This order was cancelled.
          {statusHistory.find(s => s.status === "Cancelled") && (
            <span className="block text-xs text-muted-foreground">
              At: {formatTimestamp(statusHistory.find(s => s.status === "Cancelled")!.timestamp)}
            </span>
          )}
        </p>
      )}
    </motion.div>
  );
}
