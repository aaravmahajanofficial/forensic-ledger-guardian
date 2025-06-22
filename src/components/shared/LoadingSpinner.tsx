import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large" | "xl";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  className,
  text,
}) => {
  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-[5px]",
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-4",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent",
          sizeClasses[size]
        )}
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
