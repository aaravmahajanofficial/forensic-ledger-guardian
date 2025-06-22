import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  linkTo?: string;
  className?: string;
  valueClassName?: string;
  index?: number; // For staggered animations
  footerText?: string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  linkTo,
  className,
  valueClassName,
  index = 0,
  footerText = "View Details",
  highlight = false,
}) => {
  const content = (
    <CardContent className="p-6 flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={cn("text-3xl font-bold text-foreground", valueClassName)}>
          {value}
        </p>
      </div>
      <div
        className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          highlight
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        )}
      >
        {icon}
      </div>
    </CardContent>
  );

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: index * 0.1 },
    },
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  if (linkTo) {
    return (
      <Link to={linkTo} className="group">
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Card
            className={cn(
              "overflow-hidden",
              className,
              { "border-destructive/50 shadow-lg shadow-destructive/20": highlight }
            )}
          >
            {content}
            <div
              className={cn(
                "px-6 py-2 flex items-center justify-end text-xs font-semibold",
                highlight
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              )}
            >
              {footerText}
              <ArrowRight className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Card>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card className={cn(className)}>{content}</Card>
    </motion.div>
  );
};

export default StatCard;
