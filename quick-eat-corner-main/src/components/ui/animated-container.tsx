
import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fade-in" | "slide-in" | "scale-in" | "bounce" | "pulse" | "none";
  delay?: number;
  duration?: number;
}

export function AnimatedContainer({
  children,
  className,
  animation = "fade-in",
  delay = 0,
  duration = 300,
  ...props
}: AnimatedContainerProps) {
  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in":
        return "animate-fade-in";
      case "slide-in":
        return "animate-slide-in";
      case "scale-in":
        return "animate-scale-in";
      case "bounce":
        return "animate-bounce-small";
      case "pulse":
        return "animate-pulse-scale";
      case "none":
        return "";
      default:
        return "animate-fade-in";
    }
  };

  return (
    <div
      className={cn(getAnimationClass(), className)}
      style={{ 
        animationDelay: `${delay}ms`, 
        animationDuration: `${duration}ms` 
      }}
      {...props}
    >
      {children}
    </div>
  );
}
