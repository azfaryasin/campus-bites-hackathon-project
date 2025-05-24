import * as React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Orders } from './pages/Orders';
import { Toaster } from './components/ui/sonner';
import { CartProvider } from './lib/cart-provider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex gap-4">
            <li>
              <Link to="/" className="hover:text-primary">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-primary">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<div>Menu Page (Coming Soon)</div>} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </CartProvider>
  );
} 