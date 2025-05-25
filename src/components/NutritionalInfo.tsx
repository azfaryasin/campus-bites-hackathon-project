import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { FoodItem } from "@/lib/cart-provider";

// Mock nutritional data for food items
const nutritionalData: Record<string, { 
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}> = {
  // Snacks
  's1': {
    calories: 312,
    protein: 4,
    carbs: 41,
    fat: 15,
    ingredients: ['Potatoes', 'Vegetable Oil', 'Salt']
  },
  's2': {
    calories: 240,
    protein: 8,
    carbs: 32,
    fat: 9,
    ingredients: ['Bread', 'Lettuce', 'Tomato', 'Cucumber', 'Cheese', 'Mayonnaise']
  },
  's3': {
    calories: 296,
    protein: 13,
    carbs: 18,
    fat: 19,
    ingredients: ['Chicken', 'Flour', 'Bread Crumbs', 'Spices', 'Vegetable Oil']
  },
  's4': {
    calories: 104,
    protein: 2,
    carbs: 14,
    fat: 5,
    ingredients: ['Potatoes', 'Peas', 'Flour', 'Vegetable Oil', 'Spices']
  },
  // Main Course
  'm1': {
    calories: 350,
    protein: 7,
    carbs: 62,
    fat: 8,
    ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Spices', 'Ghee']
  },
  'm2': {
    calories: 420,
    protein: 28,
    carbs: 40,
    fat: 16,
    ingredients: ['Chicken', 'Rice', 'Onions', 'Tomatoes', 'Spices', 'Oil']
  },
  'm3': {
    calories: 380,
    protein: 10,
    carbs: 48,
    fat: 18,
    ingredients: ['Pasta', 'Cream', 'Parmesan Cheese', 'Butter', 'Garlic', 'Herbs']
  },
  'm4': {
    calories: 450,
    protein: 32,
    carbs: 15,
    fat: 30,
    ingredients: ['Chicken', 'Tomato', 'Cream', 'Butter', 'Spices', 'Ginger-Garlic']
  },
  // Beverages
  'b1': {
    calories: 180,
    protein: 4,
    carbs: 27,
    fat: 8,
    ingredients: ['Coffee', 'Milk', 'Ice Cream', 'Sugar', 'Chocolate Syrup']
  },
  'b2': {
    calories: 160,
    protein: 3,
    carbs: 32,
    fat: 2,
    ingredients: ['Mangoes', 'Milk', 'Sugar', 'Ice Cream']
  },
  'b3': {
    calories: 60,
    protein: 1,
    carbs: 12,
    fat: 1,
    ingredients: ['Tea Leaves', 'Milk', 'Sugar', 'Cardamom', 'Cinnamon', 'Ginger']
  },
  'b4': {
    calories: 45,
    protein: 0,
    carbs: 12,
    fat: 0,
    ingredients: ['Lime Juice', 'Soda Water', 'Sugar', 'Mint Leaves', 'Salt']
  },
};

interface NutritionalInfoProps {
  item: FoodItem;
}

export function NutritionalInfo({ item }: NutritionalInfoProps) {
  const nutrition = nutritionalData[item.id] || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    ingredients: ['Information not available']
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 absolute top-2 left-2 bg-white/70 backdrop-blur-sm hover:bg-white/90 z-10 rounded-full">
          <Info className="h-3.5 w-3.5" />
          <span className="sr-only">Nutritional Information</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nutritional Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-muted/50 p-2 rounded-lg">
              <p className="text-lg font-medium">{nutrition.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <div className="bg-muted/50 p-2 rounded-lg">
              <p className="text-lg font-medium">{nutrition.protein}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>
            <div className="bg-muted/50 p-2 rounded-lg">
              <p className="text-lg font-medium">{nutrition.carbs}g</p>
              <p className="text-xs text-muted-foreground">Carbs</p>
            </div>
            <div className="bg-muted/50 p-2 rounded-lg">
              <p className="text-lg font-medium">{nutrition.fat}g</p>
              <p className="text-xs text-muted-foreground">Fat</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1 text-sm">Ingredients:</h4>
            <p className="text-sm text-muted-foreground">
              {nutrition.ingredients.join(', ')}
            </p>
          </div>
          
          {item.isVeg ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border border-green-500 rounded-sm flex items-center justify-center">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm">Vegetarian</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border border-red-500 rounded-sm flex items-center justify-center">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-sm">Non-Vegetarian</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
