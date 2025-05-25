
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { foodCategories } from '@/lib/food-data';

interface SearchFilterProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onFilterChange: (filters: { vegOnly: boolean; priceBelow100: boolean }) => void;
  activeCategory: string;
  activeFilters: { vegOnly: boolean; priceBelow100: boolean };
}

export default function SearchFilter({
  onSearchChange,
  onCategoryChange,
  onFilterChange,
  activeCategory,
  activeFilters
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState(activeFilters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  const handleFilterChange = (key: keyof typeof filters, value: boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  const clearFilters = () => {
    const newFilters = { vegOnly: false, priceBelow100: false };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setFilterOpen(false);
  };

  const hasActiveFilters = activeFilters.vegOnly || activeFilters.priceBelow100;

  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search food items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
          {foodCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="ml-2 relative shrink-0"
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-3 w-3" />
              )}
              <span className="sr-only">Filter options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="p-2 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="veg-only"
                  checked={filters.vegOnly}
                  onCheckedChange={(checked) => handleFilterChange('vegOnly', !!checked)}
                />
                <label
                  htmlFor="veg-only"
                  className="text-sm font-medium leading-none"
                >
                  Vegetarian Only
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="under-100"
                  checked={filters.priceBelow100}
                  onCheckedChange={(checked) => handleFilterChange('priceBelow100', !!checked)}
                />
                <label
                  htmlFor="under-100"
                  className="text-sm font-medium leading-none"
                >
                  Price under ₹100
                </label>
              </div>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.vegOnly && (
            <Badge variant="secondary" className="gap-1">
              Vegetarian Only
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('vegOnly', false)} />
            </Badge>
          )}
          {activeFilters.priceBelow100 && (
            <Badge variant="secondary" className="gap-1">
              Under ₹100
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('priceBelow100', false)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
