import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileDigit,
  Download,
  FileCheck,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  status: "verified" | "pending" | "rejected";
  hash: string;
  timestamp: string;
  size: string;
  relevance: "high" | "medium" | "low";
}

interface CourtPreparationEvidenceProps {
  evidence: EvidenceItem[];
}

const CourtPreparationEvidence: React.FC<CourtPreparationEvidenceProps> = ({
  evidence,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <FileDigit className="h-4 w-4 text-gray-600" />;
    }
  };

  const verifiedCount = evidence.filter(
    (item) => item.status === "verified"
  ).length;
  const pendingCount = evidence.filter(
    (item) => item.status === "pending"
  ).length;
  const totalCount = evidence.length;

  return (
    <div className="space-y-6">
      {/* Evidence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium">Verified Evidence</h3>
            <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium">Pending Review</h3>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileDigit className="h-8 w-8 text-forensic-accent mx-auto mb-2" />
            <h3 className="font-medium">Total Evidence</h3>
            <p className="text-2xl font-bold text-forensic-accent">
              {totalCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-forensic-accent" />
            Evidence Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidence Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Relevance</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidence.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full border ${getRelevanceColor(
                        item.relevance
                      )}`}
                    >
                      {item.relevance}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {item.size}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {item.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourtPreparationEvidence;
