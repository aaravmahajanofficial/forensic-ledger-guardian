import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Printer, ShieldAlert } from "lucide-react";
import { CaseStatus } from "@/types/case";

interface CaseDetailHeaderProps {
  title: string;
  status: CaseStatus;
  id: string;
}

const CaseDetailHeader: React.FC<CaseDetailHeaderProps> = ({
  title,
  status,
  id,
}) => {
  const getStatusVariant = (
    status: CaseStatus
  ): "success" | "destructive" | "warning" | "info" => {
    switch (status) {
      case "active":
        return "success";
      case "closed":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-lg p-6 bg-gradient-to-r from-card to-muted/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShieldAlert className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Case ID: {id}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Status:
            </span>
            <Badge
              variant={getStatusVariant(status)}
              className="capitalize text-sm px-3 py-1"
            >
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 border-l border-border pl-3 mt-3 sm:mt-0">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailHeader;
