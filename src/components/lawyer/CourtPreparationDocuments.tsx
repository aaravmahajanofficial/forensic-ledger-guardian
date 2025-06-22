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
  Presentation,
  FileUp,
  Users,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className={`p-4 flex items-center gap-4 ${colorClass}`}>
      <div className="p-3 bg-white/20 rounded-lg">{icon}</div>
      <div>
        <div className="text-sm font-medium text-white/90">{label}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
    </CardContent>
  </Card>
);

const CourtPreparationDocuments: React.FC<CourtPreparationDocumentsProps> = ({
  documents,
}) => {
  const getStatusBadgeVariant = (
    status: "draft" | "review" | "final"
  ): "secondary" | "warning" | "success" => {
    switch (status) {
      case "draft":
        return "secondary";
      case "review":
        return "warning";
      case "final":
        return "success";
    }
  };

  const getDocumentIcon = (type: DocumentItem["type"]) => {
    switch (type) {
      case "Brief":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "Motion":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "Exhibit":
        return <Presentation className="h-5 w-5 text-purple-500" />;
      case "Pleading":
        return <FileText className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const draftCount = documents.filter((doc) => doc.status === "draft").length;
  const reviewCount = documents.filter((doc) => doc.status === "review").length;
  const finalCount = documents.filter((doc) => doc.status === "final").length;

  return (
    <div className="space-y-6">
      {/* Document Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="h-6 w-6 text-white" />}
          label="Drafts"
          value={draftCount}
          colorClass="bg-blue-500"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-white" />}
          label="In Review"
          value={reviewCount}
          colorClass="bg-yellow-500"
        />
        <StatCard
          icon={<FileUp className="h-6 w-6 text-white" />}
          label="Finalized"
          value={finalCount}
          colorClass="bg-green-500"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-white" />}
          label="Total Documents"
          value={documents.length}
          colorClass="bg-gray-700"
        />
      </div>

      {/* Documents Table */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white">
              <FileText className="h-7 w-7 text-primary" />
              Court Documents
            </CardTitle>
            <Button>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {doc.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(doc.status)}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border">
                          <AvatarImage
                            src={doc.author.avatarUrl}
                            alt={doc.author.name}
                          />
                          <AvatarFallback>
                            {doc.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {doc.author.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.lastModified}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
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

export default CourtPreparationDocuments;
