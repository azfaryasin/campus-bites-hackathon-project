import * as React from 'react';
import { useState, useMemo } from 'react';
import { SimulatedOrderCard } from '../components/SimulatedOrderCard';
import { mockOrders } from '../lib/mock-data';
import { toast } from '../components/ui/sonner';
import { Order } from '../lib/mock-data';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';

export function Orders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderId.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.currentStatus.toLowerCase() === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortOrder]);

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

  const uniqueStatuses = [...new Set(orders.map(order => order.currentStatus))];

  return (
    <div className="container max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <div className="flex flex-col space-y-4 sm:space-y-8">
        {/* Header and Filters Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Orders</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col gap-3 w-full">
            {/* Search Bar - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            
            {/* Filters Row - Scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:overflow-x-visible">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="min-w-[130px] sm:w-[140px] whitespace-nowrap">
                  <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="min-w-[130px] sm:w-[140px] whitespace-nowrap">
                  <SlidersHorizontal className="w-4 h-4 mr-2 flex-shrink-0" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <ScrollArea className="h-[calc(100vh-11rem)] sm:h-[calc(100vh-12rem)] pr-4 -mr-4">
          <div className="space-y-4 sm:space-y-6">
            {filteredAndSortedOrders.map((order, index) => (
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
            {filteredAndSortedOrders.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-muted/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-semibold text-muted-foreground mb-2">
                  No orders found
                </div>
                <p className="text-sm text-muted-foreground px-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? "Try adjusting your filters or search query"
                    : "Your orders will appear here once you place them"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 