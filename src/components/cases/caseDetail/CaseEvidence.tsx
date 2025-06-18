import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDigit, ArrowUpRight } from "lucide-react";
import { Evidence } from "@/types";
import { EvidenceItem } from "@/types/case";

interface CaseEvidenceProps {
  evidenceItems: EvidenceItem[];
  caseId: string;
}

const CaseEvidence: React.FC<CaseEvidenceProps> = ({
  evidenceItems,
  caseId: _caseId, // Prefix with _ to indicate intentionally unused
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Case Evidence</CardTitle>
        <CardDescription>
          All evidence associated with this case
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {evidenceItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
            >
              <div>
                <div className="flex items-center">
                  <FileDigit className="h-4 w-4 text-forensic-accent mr-2" />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-sm text-forensic-500 mt-1">
                  ID: {item.id} | Type: {item.type}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    item.status === "verified" ? "bg-green-500" : "bg-amber-500"
                  }
                >
                  {item.status === "pending" ? "Pending" : item.status === "verified" ? "Verified" : "Rejected"}
                </Badge>
                <Button size="sm" className="bg-forensic-accent">
                  <span>View</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between">
          <Button variant="outline">Add Evidence</Button>
          <Button variant="outline">Export List</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CaseEvidence;
