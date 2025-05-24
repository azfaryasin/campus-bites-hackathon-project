import { CartItem } from './cart-provider';

export interface StatusUpdate {
  status: string;
  timestamp: number;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  currentStatus: string;
  statusHistory: StatusUpdate[];
}

// Mock food items
export const mockFoodItems: CartItem[] = [
  {
    id: 'item-1',
    name: 'Butter Chicken',
    price: 299,
    quantity: 1,
    image: '/images/butter-chicken.jpg'
  },
  {
    id: 'item-2',
    name: 'Tandoori Roti',
    price: 30,
    quantity: 2,
    image: '/images/tandoori-roti.jpg'
  },
  {
    id: 'item-3',
    name: 'Paneer Tikka',
    price: 199,
    quantity: 1,
    image: '/images/paneer-tikka.jpg'
  }
];

// Helper function to create status history
const createStatusHistory = (startTime: number, isCompleted = false) => {
  const history: StatusUpdate[] = [
    { status: 'Order Received', timestamp: startTime },
    { status: 'Preparing', timestamp: startTime + 2 * 60 * 1000 },
    { status: 'Ready for Pickup', timestamp: startTime + 5 * 60 * 1000 },
  ];

  if (isCompleted) {
    history.push({ status: 'Completed', timestamp: startTime + 10 * 60 * 1000 });
  }

  return history;
};

// Mock orders including completed ones
export const mockOrders: Order[] = [
  {
    orderId: 'ORD-001',
    items: mockFoodItems.slice(0, 2),
    total: 359,
    timestamp: Date.now() - 30 * 60 * 1000,
    currentStatus: 'Completed',
    statusHistory: createStatusHistory(Date.now() - 30 * 60 * 1000, true)
  },
  {
    orderId: 'ORD-002',
    items: [mockFoodItems[2]],
    total: 199,
    timestamp: Date.now() - 15 * 60 * 1000,
    currentStatus: 'Ready for Pickup',
    statusHistory: createStatusHistory(Date.now() - 15 * 60 * 1000)
  },
  {
    orderId: 'ORD-003',
    items: mockFoodItems,
    total: 558,
    timestamp: Date.now() - 5 * 60 * 1000,
    currentStatus: 'Preparing',
    statusHistory: createStatusHistory(Date.now() - 5 * 60 * 1000)
  }
]; 