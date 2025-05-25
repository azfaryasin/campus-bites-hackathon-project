interface Rating {
  id: string;
  itemId: string;
  orderId: string;
  rating: number;
  review: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingInput {
  itemId: string;
  orderId: string;
  rating: number;
  review: string;
}

// Helper functions for localStorage
const RATINGS_KEY = 'quick-eat-corner-ratings';

function getRatingsFromStorage(): Rating[] {
  const stored = localStorage.getItem(RATINGS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRatingsToStorage(ratings: Rating[]) {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

export const ratingService = {
  // Submit a new rating
  async submitRating(data: RatingInput): Promise<Rating> {
    const ratings = getRatingsFromStorage();
    const newRating: Rating = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      userId: 'user-1', // Mock user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    ratings.push(newRating);
    saveRatingsToStorage(ratings);
    return newRating;
  },

  // Get ratings for an item
  async getItemRatings(itemId: string): Promise<Rating[]> {
    const ratings = getRatingsFromStorage();
    return ratings.filter(rating => rating.itemId === itemId);
  },

  // Get ratings for an order
  async getOrderRatings(orderId: string): Promise<Rating[]> {
    const ratings = getRatingsFromStorage();
    return ratings.filter(rating => rating.orderId === orderId);
  },

  // Update an existing rating
  async updateRating(ratingId: string, data: Partial<RatingInput>): Promise<Rating> {
    const ratings = getRatingsFromStorage();
    const index = ratings.findIndex(r => r.id === ratingId);
    
    if (index === -1) {
      throw new Error('Rating not found');
    }

    const updatedRating = {
      ...ratings[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    ratings[index] = updatedRating;
    saveRatingsToStorage(ratings);
    return updatedRating;
  },

  // Delete a rating
  async deleteRating(ratingId: string): Promise<void> {
    const ratings = getRatingsFromStorage();
    const filteredRatings = ratings.filter(r => r.id !== ratingId);
    saveRatingsToStorage(filteredRatings);
  }
}; 