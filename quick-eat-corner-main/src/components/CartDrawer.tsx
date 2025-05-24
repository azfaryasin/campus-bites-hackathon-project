import { MinusCircle, PlusCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem, useCart } from "@/lib/cart-provider";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { placeholderImages } from "@/lib/food-data";
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
import { useState } from "react";

export default function CartDrawer() {
  const { items, updateItem, removeItem, total, isOpen, setIsOpen, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsPlacingOrder(true);
    
    // Simulate order processing delay
    setTimeout(() => {
      const orderData = {
        items: [...items],
        total,
        timestamp: Date.now(),
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "Order Received"
      };
      
      // Save the order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('cafeteria-orders') || '[]');
      localStorage.setItem(
        'cafeteria-orders', 
        JSON.stringify([orderData, ...existingOrders])
      );
      
      // Clear cart
      clearCart();
      
      // Close cart drawer
      setIsOpen(false);
      
      // Reset loading state
      setIsPlacingOrder(false);
      
      // Show success toast and redirect
      toast.success("Order placed successfully!", {
        description: "You'll be notified when it's ready for pickup."
      });
      
      navigate('/orders');
    }, 2000);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, item: CartItem) => {
    const imgName = item.image.split('/').pop()?.replace('.jpg', '') || '';
    e.currentTarget.src = placeholderImages[imgName as keyof typeof placeholderImages] || '/placeholder.svg';
  };
  
  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Your Cart
              </SheetTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {items.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowClearConfirm(true)} 
                className="gap-1 mt-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Cart
              </Button>
            )}
          </SheetHeader>
          
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="bg-muted rounded-full p-6">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground text-center">
                Add some delicious items from the menu
              </p>
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  navigate('/');
                }} 
                className="mt-4"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mt-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-md shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => handleImageError(e, item)}
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        ₹{item.price} × {item.quantity}
                      </div>
                      
                      {(item.spiceLevel || item.selectedOptions?.length || item.specialInstructions) && (
                        <div className="text-xs text-muted-foreground">
                          {item.spiceLevel && <>Spice: {item.spiceLevel}</>}
                          {item.spiceLevel && (item.selectedOptions?.length || item.specialInstructions) ? ' • ' : ''}
                          {item.selectedOptions?.length ? 
                            `Options: ${item.selectedOptions.join(', ')}` : ''
                          }
                          {item.specialInstructions && (
                            <div className="mt-1 italic">"{item.specialInstructions}"</div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 pt-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 shrink-0"
                          onClick={() => updateItem(item.id, item.quantity - 1)} 
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 shrink-0"
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="font-medium text-right">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full relative" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg 
                        className="animate-spin h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  )}
                  <span className={isPlacingOrder ? 'opacity-0' : ''}>
                    Place Order
                  </span>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all items from your cart. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCart} className="bg-destructive text-destructive-foreground">
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
