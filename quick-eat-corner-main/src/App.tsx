import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-provider";
import { CartProvider } from "@/lib/cart-provider";
// import { SoundProvider } from "@/lib/sound-provider"; // Commented out SoundProvider import
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
// import { FloatingMicButton } from "./components/FloatingMicButton"; // Removed import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      {/* <SoundProvider> */}{/* Commented out SoundProvider wrapper opening */}
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner richColors closeButton />
            <Header />
            <CartDrawer />
            {/* <FloatingMicButton /> */}{/* Removed component */}
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </TooltipProvider>
        </CartProvider>
      {/* </SoundProvider> */}{/* Commented out SoundProvider wrapper closing */}
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
