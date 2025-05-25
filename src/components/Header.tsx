import { Link } from "react-router-dom";
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/lib/cart-provider";
import { useEffect, useState } from "react";

const NavLinks = ({ onClose }: { onClose?: () => void }) => (
  <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
    <Link 
      to="/" 
      className="text-base md:text-lg font-medium hover:text-primary transition-colors"
      onClick={onClose}
    >
      Menu
    </Link>
    <Link 
      to="/orders" 
      className="text-base md:text-lg font-medium hover:text-primary transition-colors"
      onClick={onClose}
    >
      My Orders
    </Link>
  </div>
);

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm" 
          : "bg-background"
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              CampusBites
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Button 
            variant="outline" 
            size="icon" 
            className="relative rounded-full"
            onClick={() => setIsOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-scale">
                {itemCount}
              </span>
            )}
          </Button>
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <div className="flex flex-col gap-6">
                <Link to="/" className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    CampusBites
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <NavLinks onClose={() => document.body.click()} />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
