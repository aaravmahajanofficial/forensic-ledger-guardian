import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

const PlaceholderPage = ({
  title,
  description,
  icon,
}: PlaceholderPageProps) => {
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-start gap-4">
          {icon ?? <AlertTriangle className="h-8 w-8 text-forensic-warning" />}
          <div>
            <h2 className="text-2xl font-bold text-forensic-800">{title}</h2>
            {description && (
              <p className="text-forensic-600 mt-1">{description}</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-forensic-600">
            This page is currently under development. The feature will be
            implemented in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
