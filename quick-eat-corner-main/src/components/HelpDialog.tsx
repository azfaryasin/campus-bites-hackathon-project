
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function HelpDialog() {
  const faqItems = [
    {
      question: "How do I place an order?",
      answer: "Browse the menu, click 'Add to Cart' for items you want, adjust quantities in the cart, and click 'Place Order' when ready."
    },
    {
      question: "How do I customize my order?",
      answer: "When adding items to cart, you can select spice level and other options if available for that dish."
    },
    {
      question: "How long does it take to prepare my order?",
      answer: "Most orders are ready within 10-15 minutes. You can track the status on the Orders page."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel pending orders from the Orders page before they reach the 'Ready for Pickup' status."
    },
    {
      question: "How do I add items to favorites?",
      answer: "Click the heart icon on any menu item to add it to your favorites. View all favorites in the Favorites section."
    }
  ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full fixed bottom-6 right-6 shadow-md bg-background z-50 h-12 w-12"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help & FAQs</DialogTitle>
        </DialogHeader>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Need more help? Contact the cafeteria staff at the counter or call ext. 1234.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
