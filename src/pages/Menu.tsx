import { useState, useEffect } from 'react';
import { FoodItem, useCart } from '@/lib/cart-provider';
import FoodCard from '@/components/FoodCard';
import { foodData, getTimeBasedRecommendations } from '@/lib/food-data';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import { FoodCardSkeleton } from '@/components/ui/shimmer';
import { AnimatedContainer } from '@/components/ui/animated-container';
import SearchFilterExtended from '@/components/SearchFilterExtended';
import { Clock, Heart, History } from 'lucide-react';
import { HelpDialog } from '@/components/HelpDialog';
import { NutritionalInfo } from '@/components/NutritionalInfo';

export default function Menu() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [filters, setFilters] = useState({
    vegOnly: false,
    priceBelow100: false,
    dietaryFilters: [] as string[]
  });
  const [recommendations, setRecommendations] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousOrders, setPreviousOrders] = useState<FoodItem[]>([]);
  
  const { favorites, toggleFavorite, isFavorite } = useCart();
  const favoriteItems = foodData.filter(item => favorites.includes(item.id));

  // Load time-based recommendations and simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecommendations(getTimeBasedRecommendations());
      setIsLoading(false);
      
      // Load previous orders from localStorage
      try {
        const savedOrders = localStorage.getItem('cafeteria-orders');
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          // Extract unique items from previous orders
          const uniqueItems = new Map();
          orders.forEach((order: any) => {
            order.items.forEach((item: FoodItem) => {
              uniqueItems.set(item.id, item);
            });
          });
          setPreviousOrders(Array.from(uniqueItems.values()).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to parse previous orders:', error);
      }
      
      // Update recommendations every minute (if time changes significantly)
      const interval = setInterval(() => {
        setRecommendations(getTimeBasedRecommendations());
      }, 60000);
      
      return () => clearInterval(interval);
    }, 1000); // Simulate loading for 1 second
    
    return () => clearTimeout(timer);
  }, []);

  // Filter food items based on search, category, and other filters
  const filteredItems = foodData.filter((item) => {
    // Search filter
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (category !== 'All' && item.category !== category) {
      return false;
    }

    // Vegetarian filter
    if (filters.vegOnly && !item.isVeg) {
      return false;
    }

    // Price filter
    if (filters.priceBelow100 && item.price >= 100) {
      return false;
    }
    
    // Dietary filters
    if (filters.dietaryFilters && filters.dietaryFilters.length > 0) {
      return filters.dietaryFilters.every(filter => {
        return item.dietaryInfo?.[filter as keyof typeof item.dietaryInfo];
      });
    }

    return true;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce<Record<string, FoodItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Show recommendations only when no filters are applied
  const showRecommendations = !searchQuery && 
    category === 'All' && 
    !filters.vegOnly && 
    !filters.priceBelow100 && 
    (!filters.dietaryFilters || filters.dietaryFilters.length === 0);

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 max-w-screen-xl">
      <WelcomeMessage className="mb-8" />
      
      <SearchFilterExtended
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategory}
        onFilterChange={setFilters}
        activeCategory={category}
        activeFilters={filters}
      />

      {/* Favorites section */}
      {favorites.length > 0 && (
        <AnimatedContainer animation="fade-in" className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold">Your Favorites</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteItems.map((item, index) => (
              <AnimatedContainer key={item.id} animation="scale-in" delay={index * 150}>
                <div className="h-full relative">
                  <FoodCard 
                    item={item} 
                    isFavorite={isFavorite(item.id)} 
                    onToggleFavorite={toggleFavorite} 
                  />
                  <NutritionalInfo item={item} />
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </AnimatedContainer>
      )}

      {/* Recommendations section */}
      {showRecommendations && (
        <AnimatedContainer animation="fade-in" className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl md:text-2xl font-bold">Recommended for you</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <FoodCardSkeleton key={`skeleton-${i}`} />
              ))
            ) : (
              recommendations.map((item, index) => (
                <AnimatedContainer key={item.id} animation="scale-in" delay={index * 150}>
                  <div className="h-full relative">
                    <FoodCard 
                      item={item} 
                      isFavorite={isFavorite(item.id)} 
                      onToggleFavorite={toggleFavorite} 
                    />
                    <NutritionalInfo item={item} />
                  </div>
                </AnimatedContainer>
              ))
            )}
          </div>
        </AnimatedContainer>
      )}
      
      {/* Previously ordered items section */}
      {showRecommendations && previousOrders.length > 0 && (
        <AnimatedContainer animation="fade-in" delay={300} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl md:text-2xl font-bold">Previously Ordered</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {previousOrders.map((item, index) => (
              <AnimatedContainer key={item.id} animation="scale-in" delay={index * 150}>
                <div className="h-full relative">
                  <FoodCard 
                    item={item} 
                    isFavorite={isFavorite(item.id)} 
                    onToggleFavorite={toggleFavorite} 
                  />
                  <NutritionalInfo item={item} />
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </AnimatedContainer>
      )}

      {/* Main food sections */}
      {Object.keys(groupedItems).length > 0 ? (
        Object.entries(groupedItems).map(([category, items], categoryIndex) => (
          <AnimatedContainer key={category} animation="fade-in" delay={categoryIndex * 150} className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item, itemIndex) => (
                <AnimatedContainer key={item.id} animation="scale-in" delay={itemIndex * 100}>
                  <div className="h-full relative">
                    <FoodCard 
                      item={item} 
                      isFavorite={isFavorite(item.id)} 
                      onToggleFavorite={toggleFavorite} 
                    />
                    <NutritionalInfo item={item} />
                  </div>
                </AnimatedContainer>
              ))}
            </div>
          </AnimatedContainer>
        ))
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">Try changing your search or filter criteria</p>
        </div>
      )}
      
      {/* Help Dialog */}
      <HelpDialog />
    </div>
  );
}
