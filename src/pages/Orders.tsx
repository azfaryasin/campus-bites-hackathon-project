import * as React from 'react';
import { useState } from 'react';
import { SimulatedOrderCard } from '../components/SimulatedOrderCard';
import { mockOrders } from '../lib/mock-data';
import { toast } from '../components/ui/sonner';
import { Order } from '../lib/mock-data';

export function Orders() {
  const [orders, setOrders] = useState(mockOrders);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string, newTimestamp: number) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            currentStatus: newStatus,
            statusHistory: [
              ...order.statusHistory,
              { status: newStatus, timestamp: newTimestamp }
            ]
          };
        }
        return order;
      })
    );
  };

  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'Cancelled', Date.now());
    toast.success('Order cancelled successfully');
  };

  const handleShareOrder = (order: Order) => {
    // Implement share functionality
    toast.success('Order shared successfully');
  };

  const handleReorder = (order: Order) => {
    // Implement reorder functionality
    toast.success('Items added to cart');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <SimulatedOrderCard
            key={order.orderId}
            order={order}
            updateOrderStatusInParent={handleUpdateOrderStatus}
            onCancelOrder={handleCancelOrder}
            onShareOrder={handleShareOrder}
            onReorder={handleReorder}
            animationDelay={index * 100}
          />
        ))}
        {orders.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
} 