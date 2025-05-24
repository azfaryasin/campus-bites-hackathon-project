import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FoodItem, useCart } from "@/lib/cart-provider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NutritionalInfo } from "./NutritionalInfo";
import { Heart } from "lucide-react";
import { placeholderImages } from "@/lib/food-data";

interface FoodCardDialogProps {
  item: FoodItem;
  children: React.ReactNode;
}

export function FoodCardDialog({ item, children }: FoodCardDialogProps) {
  const { addItem, isFavorite, toggleFavorite } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState(item.customization?.spiceLevel || "Medium");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAddToCart = () => {
    addItem(
      item, 
      quantity, 
      spiceLevel, 
      selectedOptions.length > 0 ? selectedOptions : undefined,
      specialInstructions.trim() || undefined
    );
    setIsOpen(false);
    
    // Reset the form for next time
    setQuantity(1);
    setSpiceLevel(item.customization?.spiceLevel || "Medium");
    setSelectedOptions([]);
    setSpecialInstructions("");
  };
  
  const handleOptionToggle = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgName = item.image.split('/').pop()?.replace('.jpg', '') || '';
    e.currentTarget.src = placeholderImages[imgName as keyof typeof placeholderImages] || '/placeholder.svg';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{item.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite(item.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
              />
              <span className="sr-only">
                {isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
              </span>
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative h-48 rounded-md overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <NutritionalInfo item={item} />
            {item.isVeg ? (
              <div className="absolute top-2 left-2 h-6 w-6 bg-white rounded-full flex items-center justify-center">
                <div className="h-4 w-4 border border-green-500 rounded-sm flex items-center justify-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="absolute top-2 left-2 h-6 w-6 bg-white rounded-full flex items-center justify-center">
                <div className="h-4 w-4 border border-red-500 rounded-sm flex items-center justify-center">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <p className="font-medium">₹{item.price}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Select 
                value={quantity.toString()} 
                onValueChange={(value) => setQuantity(parseInt(value, 10))}
              >
                <SelectTrigger id="quantity">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {item.customization?.spiceLevel && (
              <div>
                <Label htmlFor="spice">Spice Level</Label>
                <Select 
                  value={spiceLevel} 
                  onValueChange={setSpiceLevel}
                >
                  <SelectTrigger id="spice">
                    <SelectValue placeholder="Select spice level" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mild", "Medium", "Hot", "Extra Hot"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {item.customization?.options && item.customization.options.length > 0 && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="grid grid-cols-1 gap-2">
                {item.customization.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`option-${option}`} 
                      checked={selectedOptions.includes(option)}
                      onCheckedChange={() => handleOptionToggle(option)}
                    />
                    <label 
                      htmlFor={`option-${option}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea 
              id="instructions"
              placeholder="Any special requests?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none"
              maxLength={100}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
          >
            Add to Cart - ₹{item.price * quantity}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
