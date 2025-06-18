import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDigit, Scale } from "lucide-react";

const getBadgeColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-forensic-accent text-white";
    case "closed":
      return "bg-forensic-400 text-white";
    case "pending":
      return "bg-forensic-warning text-forensic-900";
    default:
      return "bg-forensic-600 text-white";
  }
};

interface CaseDetailHeaderProps {
  title: string;
  status: string;
  id: string;
}

const CaseDetailHeader: React.FC<CaseDetailHeaderProps> = ({
  title,
  status,
  id,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-forensic-800">{title}</h1>
          <Badge className={getBadgeColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <p className="text-forensic-500">Case ID: {id}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-forensic-evidence">
          <FileDigit className="h-4 w-4 mr-2" />
          View Evidence
        </Button>
        <Button variant="outline" size="sm" className="text-forensic-court">
          <Scale className="h-4 w-4 mr-2" />
          Legal Documents
        </Button>
      </div>
    </div>
  );
};

export default CaseDetailHeader;
