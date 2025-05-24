import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { CartItem } from '../lib/cart-provider';
import { Share2, X, RotateCcw, Star, Loader2 } from 'lucide-react';
import { OrderStatusProgress } from './OrderStatusProgress';
import { AnimatedContainer } from './ui/animated-container';
import { RatingDialog } from './RatingDialog';
import { toast } from './ui/sonner';
import { ratingService } from '../lib/rating-service';

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

  return (
    <AnimatedContainer 
      animation="fade-in" 
      delay={animationDelay}
      className="transition-all hover:shadow-md"
    >
      <Card className="overflow-hidden">
        {/* ... existing card header ... */}
        
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
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-muted-foreground">x{item.quantity}</span>
                    </div>
                    {canRate && (
                      isLoadingRatings ? (
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
                            ratings[item.id] ? (
                              <Button variant="default" size="sm" className="ml-2 transition-all duration-300 hover:scale-105">
                                View Rating
                              </Button>
                            ) : (
                              <Button variant="default" size="sm" className="ml-2 transition-all duration-300 hover:scale-105">
                                Rate Item
                              </Button>
                            )
                          }
                        />
                      )
                    )}
                  </div>
                  
                  {/* ... rest of the item details ... */}
                  
                </div>
                <div className="text-right">₹{item.price * item.quantity}</div>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between p-6 pt-0 bg-muted/40 border-t">
          <div className="font-medium">Total Amount</div>
          <div className="font-bold">₹{order.total}</div>
        </CardFooter>
      </Card>
    </AnimatedContainer>
  );
}
