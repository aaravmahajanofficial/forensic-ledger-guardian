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
  FileText,
  Download,
  Edit,
  UploadCloud,
  BookMarked,
  FileUp,
  Users,
  FileClock, 
  FileCheck2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface DocumentItem {
  id: string;
  name: string;
  type: "Brief" | "Motion" | "Exhibit" | "Pleading" | "Other";
  status: "draft" | "review" | "final";
  lastModified: string;
  size: string;
  author: { name: string; avatarUrl?: string };
}

interface CourtPreparationDocumentsProps {
  documents: DocumentItem[];
}

const StatCard = ({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  variant: "info" | "warning" | "success" | "default";
}) => {
  const variantClasses = {
    info: "bg-info/10 text-info-foreground border-info/20",
    warning: "bg-warning/10 text-warning-foreground border-warning/20",
    success: "bg-success/10 text-success-foreground border-success/20",
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
  );
};

const CourtPreparationDocuments: React.FC<CourtPreparationDocumentsProps> = ({
  documents,
}) => {
  const getStatusBadgeVariant = (
    status: "draft" | "review" | "final"
  ): "default" | "warning" | "success" => {
    switch (status) {
      case "draft":
        return "default";
      case "review":
        return "warning";
      case "final":
        return "success";
    }
  };

  const getDocumentIcon = (type: DocumentItem["type"]) => {
    switch (type) {
      case "Brief":
        return <BookMarked className="h-5 w-5 text-blue-500" />;
      case "Motion":
        return <FileUp className="h-5 w-5 text-indigo-500" />;
      case "Exhibit":
        return <FileCheck2 className="h-5 w-5 text-emerald-500" />;
      case "Pleading":
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  const draftCount = documents.filter((doc) => doc.status === "draft").length;
  const reviewCount = documents.filter((doc) => doc.status === "review").length;
  const finalCount = documents.filter((doc) => doc.status === "final").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Edit className="h-6 w-6 text-info" />}
          label="Drafts"
          value={draftCount}
          variant="info"
        />
        <StatCard
          icon={<FileClock className="h-6 w-6 text-warning" />}
          label="In Review"
          value={reviewCount}
          variant="warning"
        />
        <StatCard
          icon={<FileCheck2 className="h-6 w-6 text-success" />}
          label="Finalized"
          value={finalCount}
          variant="success"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-secondary-foreground" />}
          label="Total Documents"
          value={documents.length}
          variant="default"
        />
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
              <FileText className="h-6 w-6" />
              Court Documents
            </CardTitle>
            <Button size="sm">
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Document Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">{getDocumentIcon(doc.type)}</div>
                        <div>
                          <span className="font-medium text-foreground">
                            {doc.name}
                          </span>
                          <div className="text-xs text-muted-foreground">{doc.type} - {doc.size}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(doc.status)} className="capitalize text-xs px-2 py-0.5 rounded-md">
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer">
                              <Avatar className="h-8 w-8 border-2 border-border/20">
                                <AvatarImage
                                  src={doc.author.avatarUrl}
                                  alt={doc.author.name}
                                />
                                <AvatarFallback>
                                  {doc.author.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                {doc.author.name}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{doc.author.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.lastModified).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
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

export default CourtPreparationDocuments;
