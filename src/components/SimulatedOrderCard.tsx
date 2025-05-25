import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem, useCart } from '@/lib/cart-provider';
// import { getOrderStatus } from '@/lib/food-data'; // Not needed here, status comes from props
import { Share2, X, RotateCcw, Star } from 'lucide-react';
import { OrderStatusProgress } from '@/components/OrderStatusProgress';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { RatingDialog } from './RatingDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";

// Mirror the Order and StatusUpdate interfaces from Orders.tsx
interface StatusUpdate {
  status: string;
  timestamp: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  timestamp: number; 
  currentStatus: string;
  statusHistory: StatusUpdate[];
}

interface SimulatedOrderCardProps {
  order: Order;
  updateOrderStatusInParent: (orderId: string, newStatus: string, newTimestamp: number) => void;
  onCancelOrder: (orderId: string) => void;
  onShareOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
  animationDelay?: number;
}

const orderSimulationSteps = ["Order Received", "Preparing", "Ready for Pickup", "Completed"];

// Helper function to handle image errors and provide fallbacks
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, itemName: string) => {
  const imgElement = e.currentTarget;
  const fallbackImage = `/images/${itemName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  
  if (imgElement.src !== fallbackImage) {
    console.log(`Attempting to load fallback image: ${fallbackImage}`);
    imgElement.src = fallbackImage;
    // Add a second error handler for the fallback image
    imgElement.onerror = (err) => {
      console.error(`Error loading fallback image ${fallbackImage}:`, err);
      imgElement.src = '/placeholder.svg';
      imgElement.onerror = null; // Prevent infinite loops
    };
  } else {
    imgElement.src = '/placeholder.svg';
    imgElement.onerror = null;
  }
};

export function SimulatedOrderCard({ 
  order,
  updateOrderStatusInParent,
  onCancelOrder,
  onShareOrder,
  onReorder,
  animationDelay = 0 
}: SimulatedOrderCardProps) {
  const [currentStatusInternal, setCurrentStatusInternal] = useState(order.currentStatus);
  const [statusHistoryInternal, setStatusHistoryInternal] = useState<StatusUpdate[]>(order.statusHistory);
  const [ratings, setRatings] = useState<Record<string, { rating: number; review: string }>>({});

  // Simulation effect
  useEffect(() => {
    if (currentStatusInternal === "Completed" || currentStatusInternal === "Cancelled") {
      return; // Stop simulation if order is completed or cancelled
    }

    const currentStepIndex = orderSimulationSteps.indexOf(currentStatusInternal);
    if (currentStepIndex === -1 || currentStepIndex >= orderSimulationSteps.length - 1) {
      return; // Current status not in steps or is the last step (Completed)
    }

    const nextStatus = orderSimulationSteps[currentStepIndex + 1];
    // Simulate varying delays (e.g., 10 to 25 seconds)
    const delay = Math.random() * 15000 + 10000; 

    const timer = setTimeout(() => {
      const newTimestamp = Date.now();
      setCurrentStatusInternal(nextStatus);
      setStatusHistoryInternal(prevHistory => 
        [...prevHistory, { status: nextStatus, timestamp: newTimestamp }]
        .sort((a,b) => a.timestamp - b.timestamp)
      );
      updateOrderStatusInParent(order.orderId, nextStatus, newTimestamp);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStatusInternal, order.orderId, updateOrderStatusInParent]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const canBeCancelled = (status: string) => {
    return status !== "Completed" && status !== "Cancelled";
  };

  const handleRatingSubmit = (itemId: string, rating: number, review: string) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: { rating, review }
    }));

    // Here you would typically send this to your backend
    console.log(`Rating submitted for item ${itemId}:`, { rating, review });
  };

  const canRate = currentStatusInternal === "Completed";

  return (
    <AnimatedContainer 
      animation="fade-in" 
      delay={animationDelay}
      className="transition-all hover:shadow-md"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order #{order.orderId}</p>
              <CardTitle className="text-lg mt-1">{formatDate(order.timestamp)}</CardTitle>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 self-start md:self-auto">
              {canBeCancelled(currentStatusInternal) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onCancelOrder(order.orderId)}
                  className="gap-1 text-destructive hover:text-destructive w-full sm:w-auto"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel Order
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onReorder(order)}
                className="gap-1 w-full sm:w-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reorder
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onShareOrder(order)}
                className="gap-1 w-full sm:w-auto"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share Order
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <OrderStatusProgress 
            currentStatus={currentStatusInternal} 
            statusHistory={statusHistoryInternal} 
            orderId={order.orderId}
          />
          
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row justify-between gap-4 hover:bg-muted/30 p-3 rounded-md transition-colors">
                <img 
                  src={`/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  alt={item.name}
                  className="h-24 w-full sm:h-20 sm:w-20 rounded-lg object-cover transition-transform hover:scale-105 bg-muted"
                  style={{ display: 'block' }}
                  onError={(e) => handleImageError(e, item.name)}
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-muted-foreground">x{item.quantity}</span>
                    </div>
                    {canRate && (
                      <RatingDialog
                        itemId={item.id}
                        itemName={item.name}
                        orderId={order.orderId}
                        onRatingSubmit={handleRatingSubmit}
                          trigger={
                            ratings[item.id] ? (
                              null // Render nothing if rating exists
                            ) : (
                              <Button variant="default" size="sm" className="sm:ml-2 transition-all duration-300 hover:scale-105 border-2">
                                Rate Item
                              </Button>
                            )
                          }
                      />
                    )}
                  </div>
                  
                  {(item.spiceLevel || item.selectedOptions?.length || item.specialInstructions) && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.spiceLevel && <>Spice: {item.spiceLevel}</>}
                      {item.spiceLevel && (item.selectedOptions?.length || item.specialInstructions) ? ' • ' : ''}
                      {item.selectedOptions?.length ? 
                        `Options: ${item.selectedOptions.join(', ')}` : ''
                      }
                      {item.specialInstructions && (
                        <div className="mt-0.5 italic">"{item.specialInstructions}"</div>
                      )}
                    </div>
                  )}
                  
                </div>
                <div className="text-right">₹{item.price * item.quantity}</div>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between px-4 py-4 bg-muted/40 border-t md:px-6 md:py-0">
          <div className="font-medium">Total Amount</div>
          <div className="font-bold">₹{order.total}</div>
        </CardFooter>
      </Card>
    </AnimatedContainer>
  );
}
