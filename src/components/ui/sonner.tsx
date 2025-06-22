import React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group toast group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-green-600",
          error:
            "group toast group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-red-600",
          info: "group toast group-[.toaster]:bg-info group-[.toaster]:text-info-foreground group-[.toaster]:border-blue-600",
          warning:
            "group toast group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-yellow-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
