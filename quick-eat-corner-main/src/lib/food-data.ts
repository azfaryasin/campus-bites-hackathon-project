import { FoodItem } from './cart-provider';

export const foodData: FoodItem[] = [
  // Snacks Category
  {
    id: 's1',
    name: 'French Fries',
    description: 'Crispy golden fries served with ketchup',
    price: 80,
    category: 'Snacks',
    image: '/images/french-fries.jpg',
    isVeg: true,
    rating: 4.5,
    prepTime: 10,
    customization: {
      spiceLevel: 'Medium',
      options: ['Extra Salt', 'Cheese Topping', 'Garlic Mayo']
    },
    dietaryInfo: {
      glutenFree: true,
      vegan: true,
      spicy: false
    }
  },
  {
    id: 's2',
    name: 'Veg Sandwich',
    description: 'Fresh vegetables stacked between toasted bread',
    price: 70,
    category: 'Snacks',
    image: '/images/veg-sandwich.jpg',
    isVeg: true,
    rating: 4.2,
    prepTime: 8,
    customization: {
      options: ['Extra Cheese', 'Grilled', 'No Onion']
    },
    dietaryInfo: {
      glutenFree: false,
      vegan: false,
      spicy: false
    }
  },
  {
    id: 's3',
    name: 'Chicken Nuggets',
    description: '8 pieces of tender chicken nuggets with dip',
    price: 120,
    category: 'Snacks',
    image: '/images/chicken-nuggets.jpg',
    isVeg: false,
    rating: 4.6,
    prepTime: 12,
    customization: {
      options: ['BBQ Sauce', 'Sweet Chili', 'Mustard']
    },
    dietaryInfo: {
      glutenFree: false,
      vegan: false,
      spicy: false
    }
  },
  {
    id: 's4',
    name: 'Samosa',
    description: 'Traditional Indian snack filled with spiced potatoes',
    price: 30,
    category: 'Snacks',
    image: '/images/samosa.jpg',
    isVeg: true,
    rating: 4.7,
    prepTime: 5,
    customization: {
      spiceLevel: 'Medium',
      options: ['Extra Chutney', 'Yogurt Dip']
    },
    dietaryInfo: {
      glutenFree: false,
      vegan: true,
      spicy: true
    }
  },

  // Main Course Category
  {
    id: 'm1',
    name: 'Veg Biryani',
    description: 'Fragrant rice cooked with mixed vegetables and spices',
    price: 150,
    category: 'Main Course',
    image: '/images/veg-biryani.jpg',
    isVeg: true,
    rating: 4.4,
    prepTime: 18,
    customization: {
      spiceLevel: 'Medium',
      options: ['Extra Raita', 'No Peas', 'Extra Gravy']
    }
  },
  {
    id: 'm2',
    name: 'Chicken Curry with Rice',
    description: 'Spicy chicken curry served with steamed rice',
    price: 180,
    category: 'Main Course',
    image: '/images/chicken-curry.jpg',
    isVeg: false,
    rating: 4.8,
    prepTime: 20,
    customization: {
      spiceLevel: 'Medium',
      options: ['Extra Chicken', 'Less Spicy', 'Extra Rice']
    }
  },
  {
    id: 'm3',
    name: 'Pasta Alfredo',
    description: 'Creamy pasta with parmesan cheese and herbs',
    price: 160,
    category: 'Main Course',
    image: '/images/pasta-alfredo.jpg',
    isVeg: true,
    rating: 4.3,
    prepTime: 15,
    customization: {
      options: ['Extra Cheese', 'Add Mushrooms', 'Garlic Bread']
    }
  },
  {
    id: 'm4',
    name: 'Butter Chicken',
    description: 'Rich tomato-based curry with tender chicken pieces',
    price: 200,
    category: 'Main Course',
    image: '/images/butter-chicken.jpg',
    isVeg: false,
    rating: 4.9,
    prepTime: 25,
    customization: {
      spiceLevel: 'Medium',
      options: ['Extra Butter', 'Extra Gravy', 'Tandoori Roti']
    }
  },

  // Beverages Category
  {
    id: 'b1',
    name: 'Cold Coffee',
    description: 'Chilled coffee with ice cream and chocolate drizzle',
    price: 90,
    category: 'Beverages',
    image: '/images/cold-coffee.jpg',
    isVeg: true,
    rating: 4.7,
    prepTime: 5,
    customization: {
      options: ['Extra Ice Cream', 'Chocolate Syrup', 'No Sugar']
    }
  },
  {
    id: 'b2',
    name: 'Mango Shake',
    description: 'Fresh mango blended with milk and ice cream',
    price: 85,
    category: 'Beverages',
    image: '/images/mango-shake.jpg',
    isVeg: true,
    rating: 4.6,
    prepTime: 7,
    customization: {
      options: ['Less Sweet', 'Extra Thick', 'Add Cream']
    }
  },
  {
    id: 'b3',
    name: 'Masala Chai',
    description: 'Traditional Indian tea with aromatic spices',
    price: 30,
    category: 'Beverages',
    image: '/images/masala-chai.jpg',
    isVeg: true,
    rating: 4.8,
    prepTime: 8,
    customization: {
      options: ['Extra Strong', 'Less Sugar', 'Extra Masala']
    }
  },
  {
    id: 'b4',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with soda and mint',
    price: 50,
    category: 'Beverages',
    image: '/images/lime-soda.jpg',
    isVeg: true,
    rating: 4.4,
    prepTime: 5,
    customization: {
      options: ['Sweet', 'Salty', 'Mixed', 'Extra Lime']
    }
  }
];

// Placeholder images for when real images aren't available
export const placeholderImages = {
  'french-fries': '/placeholder.svg',
  'veg-sandwich': '/placeholder.svg',
  'chicken-nuggets': '/placeholder.svg',
  'samosa': '/placeholder.svg',
  'veg-biryani': '/placeholder.svg',
  'chicken-curry': '/placeholder.svg',
  'pasta-alfredo': '/placeholder.svg',
  'butter-chicken': '/placeholder.svg',
  'cold-coffee': '/placeholder.svg',
  'mango-shake': '/placeholder.svg',
  'masala-chai': '/placeholder.svg',
  'lime-soda': '/placeholder.svg'
};

export const foodCategories = [
  'All',
  'Snacks',
  'Main Course',
  'Beverages'
];

export const getTimeBasedRecommendations = (): FoodItem[] => {
  const hour = new Date().getHours();
  
  // Early morning (6 AM - 9 AM)
  if (hour >= 6 && hour < 9) {
    return foodData.filter(item => 
      item.name.includes('Chai') || item.category === 'Snacks'
    ).slice(0, 3);
  }
  
  // Breakfast (9 AM - 11 AM)
  if (hour >= 9 && hour < 11) {
    return foodData.filter(item => 
      item.category === 'Snacks' || item.name.includes('Sandwich')
    ).slice(0, 3);
  }
  
  // Lunch (12 PM - 2 PM)
  if (hour >= 12 && hour < 14) {
    return foodData.filter(item => 
      item.category === 'Main Course'
    ).slice(0, 3);
  }
  
  // Tea time (4 PM - 6 PM)
  if (hour >= 16 && hour < 18) {
    return foodData.filter(item => 
      item.name.includes('Chai') || item.name.includes('Samosa') || item.category === 'Snacks'
    ).slice(0, 3);
  }
  
  // Dinner (7 PM - 9 PM)
  if (hour >= 19 && hour < 21) {
    return foodData.filter(item => 
      item.category === 'Main Course'
    ).slice(0, 3);
  }
  
  // Late night (9 PM - 12 AM)
  if (hour >= 21 || hour < 1) {
    return foodData.filter(item => 
      item.category === 'Snacks' || item.name.includes('Coffee')
    ).slice(0, 3);
  }
  
  // Default recommendations
  return foodData.filter(item => 
    item.rating >= 4.5
  ).slice(0, 3);
};

export function getOrderStatus(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Order placed in the last 60 seconds: "Order Received"
  if (diff < 60 * 1000) {
    return "Order Received";
  }
  
  // Order placed in the last 5 minutes: "Preparing"
  if (diff < 5 * 60 * 1000) {
    return "Preparing";
  }
  
  // Order placed in the last 10 minutes: "Ready for Pickup"
  if (diff < 10 * 60 * 1000) {
    return "Ready for Pickup";
  }
  
  // Order placed more than 10 minutes ago: "Completed"
  return "Completed";
}

export const dietaryFilters = [
  { id: 'glutenFree', label: 'Gluten-Free', description: 'Does not contain wheat or gluten' },
  { id: 'vegan', label: 'Vegan', description: 'No animal products' },
  { id: 'spicy', label: 'Spicy', description: 'Has a spicy flavor' }
];
