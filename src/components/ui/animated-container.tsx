import * as React from "react";
import { cn } from "../../lib/utils";

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fade-in" | "slide-in" | "scale-in";
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
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animations = {
    "fade-in": "opacity-0 transition-opacity duration-300 ease-in-out",
    "slide-in": "transform translate-y-4 opacity-0 transition-all duration-300 ease-in-out",
    "scale-in": "transform scale-95 opacity-0 transition-all duration-300 ease-in-out",
  };

  const visibleClasses = {
    "fade-in": "opacity-100",
    "slide-in": "translate-y-0 opacity-100",
    "scale-in": "scale-100 opacity-100",
  };

  return (
    <div
      className={cn(
        animations[animation],
        isVisible && visibleClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
} 