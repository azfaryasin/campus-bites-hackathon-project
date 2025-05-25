import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { CartItem } from '../lib/cart-provider';
import { Share2, X, RotateCcw, Star, Loader2, Clock } from 'lucide-react';
import { OrderStatusProgress } from './OrderStatusProgress';
import { AnimatedContainer } from './ui/animated-container';
import { RatingDialog } from './RatingDialog';
import { toast } from './ui/sonner';
import { ratingService } from '../lib/rating-service';
import { cn } from '../lib/utils';

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

interface Rating {
  id: string;
  itemId: string;
  rating: number;
  review: string;
}

interface SimulatedOrderCardProps {
  order: Order;
  updateOrderStatusInParent: (orderId: string, newStatus: string, newTimestamp: number) => void;
  onCancelOrder: (orderId: string) => void;
  onShareOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
  animationDelay?: number;
}

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
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);

  // Load existing ratings when component mounts
  useEffect(() => {
    const loadRatings = async () => {
      try {
        const orderRatings = await ratingService.getOrderRatings(order.orderId);
        const ratingsMap = orderRatings.reduce((acc, rating) => ({
          ...acc,
          [rating.itemId]: rating
        }), {});
        setRatings(ratingsMap);
      } catch (error) {
        console.error('Error loading ratings:', error);
        toast.error('Failed to load ratings');
      } finally {
        setIsLoadingRatings(false);
      }
    };

    if (currentStatusInternal === "Completed") {
      loadRatings();
    } else {
      setIsLoadingRatings(false);
    }
  }, [order.orderId, currentStatusInternal]);

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

  const canRate = currentStatusInternal === "Completed";

  const handleRatingSubmit = async (itemId: string, rating: number, review: string) => {
    try {
      if (rating === 0) {
        // Rating was deleted
        setRatings(prev => {
          const newRatings = { ...prev };
          delete newRatings[itemId];
          return newRatings;
        });
      } else {
        setRatings(prev => ({
          ...prev,
          [itemId]: {
            id: prev[itemId]?.id || 'temp-id',
            itemId,
            rating,
            review
          }
        }));
      }
    } catch (error) {
      console.error('Error handling rating:', error);
      toast.error('Failed to update rating');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatedContainer 
      animation="fade-in" 
      delay={animationDelay}
      className="transition-all duration-300 hover:shadow-lg"
    >
      <Card className="overflow-hidden bg-card hover:bg-card/95 transition-colors duration-300">
        <CardHeader className="p-3 sm:p-4 md:p-6 space-y-2 bg-muted/10">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
                  <span>Order #{order.orderId.slice(-6)}</span>
                  <Badge variant={currentStatusInternal === "Completed" ? "default" : "secondary"} 
                        className="animate-fade-in">
                    {currentStatusInternal}
                  </Badge>
                </CardTitle>
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {formatDate(order.timestamp)}
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial hover:bg-primary/10 transition-colors text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => onShareOrder(order)}
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Share
                </Button>
                {currentStatusInternal === "Completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial hover:bg-primary/10 transition-colors text-xs sm:text-sm h-8 sm:h-9"
                    onClick={() => onReorder(order)}
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          <OrderStatusProgress 
            currentStatus={currentStatusInternal} 
            statusHistory={statusHistoryInternal} 
            orderId={order.orderId}
          />
          
          <ul className="space-y-4 divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="pt-4 first:pt-0">
                <div className="group flex flex-col sm:flex-row items-start gap-3 sm:gap-4 hover:bg-muted/30 p-2 sm:p-3 rounded-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-lg w-full sm:w-24 h-20 sm:h-24 flex-shrink-0">
                    <img 
                      src={`/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => handleImageError(e, item.name)}
                    />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <h3 className="font-medium text-sm sm:text-base leading-tight">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div className="text-right font-medium text-sm sm:text-base whitespace-nowrap">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                      {canRate && (
                        <div className="flex items-center">
                          {isLoadingRatings ? (
                            <div className="h-8 w-8 flex items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          ) : (
                            <RatingDialog
                              itemId={item.id}
                              itemName={item.name}
                              orderId={order.orderId}
                              onRatingSubmit={handleRatingSubmit}
                              existingRating={ratings[item.id]}
                              trigger={
                                <Button 
                                  variant={ratings[item.id] ? "default" : "outline"}
                                  size="sm"
                                  className={cn(
                                    "w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 transition-all duration-300 hover:scale-105",
                                    ratings[item.id] && "bg-primary/10 hover:bg-primary/20"
                                  )}
                                >
                                  <Star className={cn(
                                    "w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2",
                                    ratings[item.id] && "fill-primary text-primary"
                                  )} />
                                  {ratings[item.id] ? 'View Rating' : 'Rate Item'}
                                </Button>
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between p-3 sm:p-4 md:p-6 bg-muted/20 border-t">
          <div className="text-sm sm:text-base font-medium text-muted-foreground">Total Amount</div>
          <div className="text-base sm:text-lg font-bold text-primary">₹{order.total}</div>
        </CardFooter>
      </Card>
    </AnimatedContainer>
  );
}
