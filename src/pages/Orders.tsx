import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem, useCart } from '@/lib/cart-provider';
import { getOrderStatus } from '@/lib/food-data';
import { AlertCircle, Clock, ShoppingBag, Share2, X, RotateCcw } from 'lucide-react';
import { OrderStatusProgress } from '@/components/OrderStatusProgress';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { WelcomeMessage } from '@/components/WelcomeMessage';
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
import { HelpDialog } from '@/components/HelpDialog';
import { SimulatedOrderCard } from '@/components/SimulatedOrderCard';

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

const initialOrderSteps = ["Order Received", "Preparing", "Ready for Pickup", "Completed"];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const { addItem, setIsOpen: setCartOpen } = useCart();

  // Load orders from localStorage and initialize/migrate status structure
  useEffect(() => {
    const savedOrdersRaw = localStorage.getItem('cafeteria-orders');
    if (savedOrdersRaw) {
      try {
        const savedOrdersParsed = JSON.parse(savedOrdersRaw) as any[];
        const migratedOrders = savedOrdersParsed.map(order => {
          if (!order.statusHistory || !order.currentStatus) {
            const initialStatus = order.status || "Order Received";
            return {
              ...order,
              currentStatus: order.status === "Cancelled" ? "Cancelled" : initialStatus,
              statusHistory: order.status === "Cancelled" 
                ? [{ status: "Order Received", timestamp: order.timestamp }, { status: "Cancelled", timestamp: order.timestamp + 1000 }]
                : [{ status: initialStatus, timestamp: order.timestamp }],
            } as Order;
          }
          return order as Order;
        });
        setOrders(migratedOrders);
      } catch (error) {
        console.error('Failed to parse or migrate saved orders:', error);
        localStorage.removeItem('cafeteria-orders');
      }
    }
  }, []);

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Share order function
  const shareOrder = (order: Order) => {
    if (navigator.share) {
      const text = `I ordered ${order.items.map(item => item.name).join(', ')} from Campus Bites!`;
      navigator.share({
        title: 'My CampusBites Order',
        text: text,
        url: window.location.href
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(
        `Check out my order from CampusBites! I ordered ${order.items.map(item => item.name).join(', ')}`
      );
      toast('Order details copied to clipboard!');
    }
  };
  
  // Callback to update order status in the main list and save to localStorage
  const updateOrderStatusInMainList = useCallback((orderId: string, newStatus: string, newTimestamp: number) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(o => {
        if (o.orderId === orderId) {
          const lastStatusEntry = o.statusHistory[o.statusHistory.length -1];
          const newHistoryEntry = (lastStatusEntry && lastStatusEntry.status === newStatus) 
            ? [] 
            : [{ status: newStatus, timestamp: newTimestamp }];

          return {
            ...o,
            currentStatus: newStatus,
            statusHistory: [
              ...o.statusHistory,
              ...newHistoryEntry
            ].sort((a,b) => a.timestamp - b.timestamp)
          };
        }
        return o;
      });
      localStorage.setItem('cafeteria-orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  }, []);

  // Cancel order function
  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
  };
  
  // Confirm order cancellation
  const confirmCancelOrder = () => {
    if (!orderToCancel) return;
    
    const cancelTimestamp = Date.now();
    updateOrderStatusInMainList(orderToCancel, "Cancelled", cancelTimestamp);
    
    toast.info(`Order #${orderToCancel} has been cancelled`);
    setOrderToCancel(null);
  };
  
  // Check if order can be cancelled (only if not completed or already cancelled)
  const canBeCancelled = (status: string) => {
    return status !== "Completed" && status !== "Cancelled";
  };

  // Reorder function
  const handleReorder = (orderToReorder: Order) => {
    orderToReorder.items.forEach(item => {
      addItem(item, item.quantity, item.spiceLevel, item.selectedOptions, item.specialInstructions);
    });
    toast.success(`${orderToReorder.items.length} item(s) from order #${orderToReorder.orderId} added to cart!`);
    setCartOpen(true);
  };

  return (
    <div className="container px-4 md:px-6 py-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {orders.length === 0 ? (
        <AnimatedContainer animation="fade-in" className="text-center py-10 shadow-sm rounded-lg border bg-card">
          <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Your order history will appear here</p>
          <Link to="/">
            <Button className="transition-all hover:scale-105 active:scale-95">
              Browse Menu
            </Button>
          </Link>
        </AnimatedContainer>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index): JSX.Element => (
            <SimulatedOrderCard
              key={order.orderId || index}
              order={order}
              updateOrderStatusInParent={updateOrderStatusInMainList}
              onCancelOrder={handleCancelOrder}
              onShareOrder={shareOrder}
              onReorder={handleReorder}
              animationDelay={index * 150}
            />
          ))}
        </div>
      )}
      
      {orders.length > 0 && (
        <div className="mt-6 p-4 bg-muted rounded-lg border shadow-sm flex items-center gap-2 text-sm animate-fade-in">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <p className="font-medium">Order status updates automatically as your food is being prepared.</p>
        </div>
      )}
      
      {/* Help Dialog */}
      <HelpDialog />
      
      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your order. If preparation has already started, you may still be charged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelOrder} className="bg-destructive text-destructive-foreground">
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
