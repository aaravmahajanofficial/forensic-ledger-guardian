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
  Download,
  ShieldCheck,
  Clock,
  ShieldAlert,
  Eye,
  FileSearch,
  ShieldQuestion,
  Copy
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const StatCard = ({ icon, label, value, variant }: { icon: React.ReactNode, label: string, value: string | number, variant: "success" | "warning" | "destructive" | "default" }) => {
  const variantClasses = {
    success: "bg-success/10 text-success-foreground border-success/20",
    warning: "bg-warning/10 text-warning-foreground border-warning/20",
    destructive: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    default: "bg-secondary/80 text-secondary-foreground border-secondary/20",
  };
  return (
    <Card className={`transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${variantClasses[variant]}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-background/50`}>{icon}</div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
};

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
  ): "destructive" | "warning" | "default" => {
    switch (relevance) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <ShieldCheck className="h-5 w-5 text-success" />;
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />;
      case "rejected":
        return <ShieldAlert className="h-5 w-5 text-destructive" />;
      default:
        return <ShieldQuestion className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const verifiedCount = evidence.filter((item) => item.status === "verified").length;
  const pendingCount = evidence.filter((item) => item.status === "pending").length;
  const rejectedCount = evidence.filter((item) => item.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Evidence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            icon={<ShieldCheck className="h-6 w-6 text-success" />} 
            label="Verified" 
            value={verifiedCount} 
            variant="success" 
        />
        <StatCard 
            icon={<Clock className="h-6 w-6 text-warning" />} 
            label="Pending" 
            value={pendingCount} 
            variant="warning"
        />
        <StatCard 
            icon={<ShieldAlert className="h-6 w-6 text-destructive" />} 
            label="Rejected" 
            value={rejectedCount} 
            variant="destructive"
        />
        <StatCard 
            icon={<FileSearch className="h-6 w-6 text-secondary-foreground" />} 
            label="Total Items" 
            value={evidence.length} 
            variant="default"
        />
      </div>

      {/* Evidence Table */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
            <FileSearch className="h-6 w-6" />
            Evidence Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Evidence Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Relevance</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidence.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>
                        <div>
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.type} - {item.size}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize text-xs px-2 py-0.5 rounded-md">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRelevanceBadgeVariant(item.relevance)} className="capitalize text-xs px-2 py-0.5 rounded-md">
                        {item.relevance}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-mono text-xs text-muted-foreground cursor-pointer flex items-center gap-2">
                              {item.hash.substring(0, 10)}...
                              <Copy className="h-3 w-3" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.hash}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8">
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
