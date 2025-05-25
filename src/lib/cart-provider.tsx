import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  prepTime: number;
  rating?: number;
  customization?: {
    spiceLevel?: string;
    options?: string[];
  };
  dietaryInfo?: {
    glutenFree?: boolean;
    vegan?: boolean;
    spicy?: boolean;
  };
}

export interface CartItem extends FoodItem {
  quantity: number;
  spiceLevel?: string;
  selectedOptions?: string[];
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: FoodItem, quantity?: number, spiceLevel?: string, selectedOptions?: string[], specialInstructions?: string) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  updateItemCustomization: (id: string, spiceLevel?: string, selectedOptions?: string[], specialInstructions?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load cart and favorites from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cafeteria-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
    
    const savedFavorites = localStorage.getItem('cafeteria-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse saved favorites:', error);
      }
    }
  }, []);

  // Save cart and favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cafeteria-cart', JSON.stringify(items));
  }, [items]);
  
  useEffect(() => {
    localStorage.setItem('cafeteria-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addItem = (
    item: FoodItem, 
    quantity: number = 1, 
    spiceLevel?: string, 
    selectedOptions?: string[],
    specialInstructions?: string
  ) => {
    setItems((currentItems) => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        // Update customizations if provided
        if (spiceLevel) {
          updatedItems[existingItemIndex].spiceLevel = spiceLevel;
        }
        if (selectedOptions) {
          updatedItems[existingItemIndex].selectedOptions = selectedOptions;
        }
        if (specialInstructions) {
          updatedItems[existingItemIndex].specialInstructions = specialInstructions;
        }
        
        toast(`Added ${quantity} more ${item.name} to cart`, { duration: 2000 });
        setIsOpen(true);
        return updatedItems;
      }
      
      // Add new item
      toast(`Added ${item.name} to cart`, { duration: 2000 });
      const newItems = [...currentItems, {
        ...item,
        quantity,
        spiceLevel,
        selectedOptions,
        specialInstructions
      }];
      setIsOpen(true);
      return newItems;
    });
  };
  
  const updateItemCustomization = (
    id: string,
    spiceLevel?: string,
    selectedOptions?: string[],
    specialInstructions?: string
  ) => {
    setItems((currentItems) => {
      return currentItems.map((item) =>
        item.id === id 
          ? { 
              ...item, 
              spiceLevel: spiceLevel || item.spiceLevel,
              selectedOptions: selectedOptions || item.selectedOptions,
              specialInstructions: specialInstructions || item.specialInstructions
            } 
          : item
      );
    });
  };

  const updateItem = (id: string, quantity: number) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.id !== id);
      }
      
      return currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((item) => item.id !== id);
      return currentItems.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    toast('Cart cleared', { duration: 2000 });
  };
  
  const toggleFavorite = (id: string) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(id)) {
        toast('Removed from favorites', { duration: 2000 });
        return currentFavorites.filter((itemId) => itemId !== id);
      } else {
        toast('Added to favorites', { duration: 2000 });
        return [...currentFavorites, id];
      }
    });
  };
  
  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const total = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        itemCount,
        total,
        isOpen,
        setIsOpen,
        favorites,
        toggleFavorite,
        isFavorite,
        updateItemCustomization,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
