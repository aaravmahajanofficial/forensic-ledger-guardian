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
  Copy,
  UploadCloud,
  Presentation,
} from "lucide-react";

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: "draft" | "review" | "final";
  lastModified: string;
  size: string;
  author: string;
}

interface CourtPreparationDocumentsProps {
  documents: DocumentItem[];
}

const CourtPreparationDocuments: React.FC<CourtPreparationDocumentsProps> = ({
  documents,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "final":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "brief":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "motion":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "exhibit":
        return <Presentation className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const draftCount = documents.filter((doc) => doc.status === "draft").length;
  const reviewCount = documents.filter((doc) => doc.status === "review").length;
  const finalCount = documents.filter((doc) => doc.status === "final").length;

  return (
    <div className="space-y-6">
      {/* Document Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium">Draft</h3>
            <p className="text-2xl font-bold text-blue-600">{draftCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Edit className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium">In Review</h3>
            <p className="text-2xl font-bold text-yellow-600">{reviewCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Copy className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium">Final</h3>
            <p className="text-2xl font-bold text-green-600">{finalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UploadCloud className="h-8 w-8 text-forensic-accent mx-auto mb-2" />
            <h3 className="font-medium">Total</h3>
            <p className="text-2xl font-bold text-forensic-accent">
              {documents.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-forensic-accent" />
              Court Documents
            </CardTitle>
            <Button>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(doc.type)}
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {doc.author}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {doc.lastModified}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {doc.size}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
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

export default CourtPreparationDocuments;
