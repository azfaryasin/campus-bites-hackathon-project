import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { foodCategories, dietaryFilters } from "@/lib/food-data";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchFilterProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onFilterChange: (filters: { vegOnly: boolean; priceBelow100: boolean; dietaryFilters: string[] }) => void;
  activeCategory: string;
  activeFilters: { vegOnly: boolean; priceBelow100: boolean; dietaryFilters?: string[] };
}

export default function SearchFilterExtended({
  onSearchChange,
  onCategoryChange,
  onFilterChange,
  activeCategory,
  activeFilters,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Dietary preferences filter state
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(
    activeFilters.dietaryFilters || []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  const toggleVegOnly = () => {
    onFilterChange({
      ...activeFilters,
      vegOnly: !activeFilters.vegOnly,
      dietaryFilters: dietaryPreferences
    });
  };

  const togglePriceBelow100 = () => {
    onFilterChange({
      ...activeFilters,
      priceBelow100: !activeFilters.priceBelow100,
      dietaryFilters: dietaryPreferences
    });
  };

  const handleDietaryFilterChange = (filter: string) => {
    const updatedFilters = dietaryPreferences.includes(filter)
      ? dietaryPreferences.filter((f) => f !== filter)
      : [...dietaryPreferences, filter];
    
    setDietaryPreferences(updatedFilters);
    
    onFilterChange({
      ...activeFilters,
      dietaryFilters: updatedFilters
    });
  };

  const clearFilters = () => {
    setDietaryPreferences([]);
    onFilterChange({ 
      vegOnly: false, 
      priceBelow100: false, 
      dietaryFilters: [] 
    });
    setIsFiltersOpen(false);
  };

  const filtersApplied = activeFilters.vegOnly || 
    activeFilters.priceBelow100 || 
    (dietaryPreferences.length > 0);

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Search dishes..."
            className="pl-3"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button 
              variant={filtersApplied ? "default" : "outline"} 
              size="icon" 
              className="shrink-0"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
              {filtersApplied && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                  {(activeFilters.vegOnly ? 1 : 0) + 
                   (activeFilters.priceBelow100 ? 1 : 0) + 
                   (dietaryPreferences?.length || 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="p-6">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Basic Filters</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="veg-only" 
                      checked={activeFilters.vegOnly} 
                      onCheckedChange={toggleVegOnly} 
                    />
                    <Label htmlFor="veg-only">Vegetarian Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="price-below" 
                      checked={activeFilters.priceBelow100} 
                      onCheckedChange={togglePriceBelow100} 
                    />
                    <Label htmlFor="price-below">Price below ₹100</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Dietary Preferences</h3>
                <div className="space-y-2">
                  {dietaryFilters.map(filter => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`dietary-${filter.id}`} 
                        checked={dietaryPreferences.includes(filter.id)} 
                        onCheckedChange={() => handleDietaryFilterChange(filter.id)} 
                      />
                      <div>
                        <Label htmlFor={`dietary-${filter.id}`}>{filter.label}</Label>
                        <p className="text-xs text-muted-foreground">{filter.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {foodCategories.map((category) => (
          <Badge
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
