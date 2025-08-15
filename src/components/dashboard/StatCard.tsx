import type { FC, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  linkTo?: string;
  className?: string;
  highlight?: boolean;
  valueClassName?: string; // Added this prop to support styling the value text
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon,
  linkTo,
  className,
  highlight,
  valueClassName,
}) => {
  const content = (
    <div className="p-6 flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-forensic-500">{title}</p>
        <p
          className={cn(
            "text-3xl font-bold text-forensic-800",
            highlight && "text-forensic-warning",
            valueClassName
          )}
        >
          {value}
        </p>
      </div>
      <div
        className={cn(
          "h-12 w-12 rounded-lg bg-forensic-50 flex items-center justify-center",
          highlight && "bg-forensic-warning/10"
        )}
      >
        {icon}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <Card
          className={cn(
            "group cursor-pointer border-forensic-200 hover:border-forensic-300 hover:shadow-md transition-all duration-300",
            highlight && "border-forensic-warning/50",
            className
          )}
        >
          <CardContent className="p-0">
            <div className="relative">
              {content}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-forensic-800/5 rounded-lg">
                <ChevronRight className="h-6 w-6 text-forensic-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card
      className={cn(
        "border-forensic-200",
        highlight && "border-forensic-warning/50",
        className
      )}
    >
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
};

export default StatCard;
