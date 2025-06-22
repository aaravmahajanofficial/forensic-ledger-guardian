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
  ShieldCheck,
  Clock,
  ShieldAlert,
  Eye,
  FileSearch
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

const StatCard = ({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: string | number, colorClass: string }) => (
    <Card className={`text-white ${colorClass}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg">{icon}</div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );

const CourtPreparationEvidence: React.FC<CourtPreparationEvidenceProps> = ({
  evidence,
}) => {
  const getStatusBadgeVariant = (
    status: "verified" | "pending" | "rejected"
  ): "success" | "warning" | "destructive" => {
    switch (status) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "destructive";
    }
  };

  const getRelevanceBadgeVariant = (
    relevance: "high" | "medium" | "low"
  ): "destructive" | "warning" | "success" => {
    switch (relevance) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "rejected":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <FileDigit className="h-5 w-5 text-gray-500" />;
    }
  };

  const verifiedCount = evidence.filter(
    (item) => item.status === "verified"
  ).length;
  const pendingCount = evidence.filter(
    (item) => item.status === "pending"
  ).length;
  const rejectedCount = evidence.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <div className="space-y-6">
      {/* Evidence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            icon={<ShieldCheck className="h-6 w-6" />} 
            label="Verified" 
            value={verifiedCount} 
            colorClass="bg-green-600" 
        />
        <StatCard 
            icon={<Clock className="h-6 w-6" />} 
            label="Pending" 
            value={pendingCount} 
            colorClass="bg-yellow-500"
        />
        <StatCard 
            icon={<ShieldAlert className="h-6 w-6" />} 
            label="Rejected" 
            value={rejectedCount} 
            colorClass="bg-red-600"
        />
        <StatCard 
            icon={<FileSearch className="h-6 w-6" />} 
            label="Total Items" 
            value={evidence.length} 
            colorClass="bg-gray-700"
        />
      </div>

      {/* Evidence Table */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white">
            <FileCheck className="h-7 w-7 text-primary" />
            Evidence Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Evidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Relevance</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidence.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRelevanceBadgeVariant(item.relevance)} className="capitalize">
                        {item.relevance}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.size}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.timestamp}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourtPreparationEvidence;
