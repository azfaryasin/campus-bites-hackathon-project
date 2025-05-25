import { useEffect, useState } from "react";

import { cn } from "@/lib/utils"; // Import cn utility

interface WelcomeMessageProps {
  className?: string;
}

export function WelcomeMessage({ className }: WelcomeMessageProps) {
  // const [greeting, setGreeting] = useState(""); // No longer needed
  
  // useEffect(() => { // Time-based logic no longer needed
  //   const hour = new Date().getHours();
    
  //   if (hour < 12) {
  //     setGreeting("Good Morning! What's for breakfast today?");
  //   } else if (hour < 17) {
  //     setGreeting("Good Afternoon! Ready for a delicious meal?");
  //   } else {
  //     setGreeting("Good Evening! Looking for dinner options?");
  //   }
  // }, []);
  
  const staticGreeting = "No more waiting – your meal is just a click away!";

  return (
    <div className={cn("mb-6 animate-fade-in", className)}>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        {staticGreeting}
      </h2>
      <p className="text-muted-foreground mt-1">
        Browse our menu and place your order in just a few clicks.
      </p>
    </div>
  );
}
