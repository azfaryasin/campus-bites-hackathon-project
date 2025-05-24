import { useState } from 'react';
import { Heart, Star, PlusCircle } from 'lucide-react';
import { FoodItem } from '@/lib/cart-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart-provider';
import { placeholderImages } from '@/lib/food-data';
import { FoodCardDialog } from './FoodCardDialog';
import { NutritionalInfo } from './NutritionalInfo';

interface FoodCardProps {
  item: FoodItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function FoodCard({ item, isFavorite, onToggleFavorite }: FoodCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const currentSrc = e.currentTarget.src;
    const intendedSrc = item.image;
    console.error(`Error loading image. Intended src: ${intendedSrc}, Attempted src: ${currentSrc}`);
    const imgName = item.image.split('/').pop()?.replace('.jpg', '') || '';
    const fallbackSrc = placeholderImages[imgName as keyof typeof placeholderImages] || '/placeholder.svg';
    console.log(`Attempting to load fallback image: ${fallbackSrc} for ${imgName}`);
    e.currentTarget.src = fallbackSrc;
    // Second error handler for the fallback image itself
    e.currentTarget.onerror = (err_event) => {
      console.error(`Error loading fallback image ${fallbackSrc}:`, err_event);
      e.currentTarget.src = '/placeholder.svg'; // Final fallback
      e.currentTarget.onerror = null; // Prevent infinite loops
    };
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(item);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <FoodCardDialog item={item}>
      <Card 
        className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2 right-2 z-10 h-8 w-8 bg-white/70 backdrop-blur-sm hover:bg-white/90 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
          />
        </button>
        
        {item.rating && (
          <div className="absolute top-2 left-10 z-10 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="relative h-48 overflow-hidden group">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={handleImageError}
          />
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="absolute bottom-2 right-2 z-10 h-10 w-10 bg-primary/80 text-primary-foreground hover:bg-primary rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
          </button>

          {/* Veg/Non-Veg Badge - Moved to bottom-left for better visibility */}
          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant={item.isVeg ? "success" : "destructive"} className="text-xs">
              {item.isVeg ? "Veg" : "Non-Veg"}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {item.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 flex-grow">
          <p className="font-bold text-xl">₹{item.price}</p>
          <p className="text-xs text-muted-foreground mt-1">Prep time: {item.prepTime} mins</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button className="w-full btn active:scale-95">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </FoodCardDialog>
  );
}
