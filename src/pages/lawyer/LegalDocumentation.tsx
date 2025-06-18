import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  FileText,
  Edit,
  Download,
  Trash2,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Types
type DocumentType =
  | "Motion"
  | "Brief"
  | "Affidavit"
  | "Court Order"
  | "Pleading"
  | "Agreement"
  | "Report"
  | "Statement"
  | "Letter"
  | "Other";

type DocumentStatus =
  | "Draft"
  | "Review"
  | "Finalized"
  | "Filed"
  | "Rejected"
  | "Approved";

type Document = {
  id: string;
  title: string;
  type: DocumentType;
  caseId: string;
  createdBy: string;
  createdAt: string;
  modifiedAt: string;
  status: DocumentStatus;
  notes?: string;
};

// Mock initial documents
const initialDocuments: Document[] = [
  {
    id: "DOC-2023-001",
    title: "Motion to Suppress Evidence",
    type: "Motion",
    caseId: "FF-2023-089",
    createdBy: "Jane Smith",
    createdAt: "2025-02-15T10:30:00Z",
    modifiedAt: "2025-02-18T14:45:00Z",
    status: "Filed",
    notes: "Filed with the District Court",
  },
  {
    id: "DOC-2023-002",
    title: "Expert Witness Statement",
    type: "Statement",
    caseId: "FF-2023-092",
    createdBy: "Robert Johnson",
    createdAt: "2025-03-05T09:15:00Z",
    modifiedAt: "2025-03-07T16:20:00Z",
    status: "Finalized",
    notes: "Ready for submission",
  },
  {
    id: "DOC-2023-003",
    title: "Case Summary Brief",
    type: "Brief",
    caseId: "FF-2023-089",
    createdBy: "Jane Smith",
    createdAt: "2025-02-10T11:45:00Z",
    modifiedAt: "2025-04-01T15:30:00Z",
    status: "Approved",
    notes: "Approved by senior counsel",
  },
  {
    id: "DOC-2023-004",
    title: "Evidence Chain of Custody Report",
    type: "Report",
    caseId: "FF-2023-104",
    createdBy: "Michael Chen",
    createdAt: "2025-03-25T14:00:00Z",
    modifiedAt: "2025-03-25T14:00:00Z",
    status: "Draft",
    notes: "First draft in progress",
  },
];

// Document type options
const documentTypes: DocumentType[] = [
  "Motion",
  "Brief",
  "Affidavit",
  "Court Order",
  "Pleading",
  "Agreement",
  "Report",
  "Statement",
  "Letter",
  "Other",
];

// Document status options
const documentStatuses: DocumentStatus[] = [
  "Draft",
  "Review",
  "Finalized",
  "Filed",
  "Rejected",
  "Approved",
];

// Mock case options
const caseOptions = [
  { id: "FF-2023-089", title: "Tech Corp Data Breach" },
  { id: "FF-2023-092", title: "Financial Fraud Investigation" },
  { id: "FF-2023-104", title: "Intellectual Property Theft" },
  { id: "FF-2023-118", title: "Server Room Security Breach" },
];

const LegalDocumentation = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [filteredDocuments, setFilteredDocuments] =
    useState<Document[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Document creation/editing state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    type: "Motion" as DocumentType,
    caseId: "",
    notes: "",
  });

  // Filter documents based on search term and filters
  const filterDocuments = () => {
    setLoading(true);

    let filtered = [...documents];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(term) ||
          doc.caseId.toLowerCase().includes(term) ||
          doc.id.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter);
    }

    setFilteredDocuments(filtered);
    setLoading(false);
  };

  // Update filters
  React.useEffect(() => {
    filterDocuments();
  }, [searchTerm, statusFilter, typeFilter, documents]);

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      type: "Motion",
      caseId: "",
      notes: "",
    });
    setCurrentDocument(null);
    setIsEditing(false);
  };

  // Open dialog for new document
  const handleNewDocument = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing
  const handleEditDocument = (document: Document) => {
    setCurrentDocument(document);
    setFormData({
      id: document.id,
      title: document.title,
      type: document.type,
      caseId: document.caseId,
      notes: document.notes || "",
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save document
  const handleSaveDocument = () => {
    // Validate form
    if (!formData.title.trim() || !formData.caseId) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentDocument) {
      // Update existing document
      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id
          ? {
              ...doc,
              title: formData.title,
              type: formData.type,
              caseId: formData.caseId,
              notes: formData.notes,
              modifiedAt: new Date().toISOString(),
            }
          : doc
      );

      setDocuments(updatedDocuments);
      toast({
        title: "Document Updated",
        description: `${formData.title} has been updated successfully`,
      });
    } else {
      // Create new document
      const newDocument: Document = {
        id: `DOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        title: formData.title,
        type: formData.type as DocumentType,
        caseId: formData.caseId,
        createdBy: "Current User", // Would come from auth context
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        status: "Draft",
        notes: formData.notes,
      };

      setDocuments([...documents, newDocument]);
      toast({
        title: "Document Created",
        description: `${formData.title} has been created successfully`,
      });
    }

    // Close dialog and reset form
    setDialogOpen(false);
    resetForm();
  };

  // Delete document
  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId);
    setDocuments(updatedDocuments);
    toast({
      title: "Document Deleted",
      description: "The document has been deleted successfully",
    });
  };

  // Download document
  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "Downloading Document",
      description: `Downloading ${document.title}`,
    });
    // In a real implementation, this would download the document
  };

  // Status badge
  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "Draft":
        return (
          <Badge className="bg-forensic-400/20 text-forensic-600">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "Review":
        return (
          <Badge className="bg-forensic-warning/20 text-forensic-warning">
            <Clock className="h-3 w-3 mr-1" />
            Review
          </Badge>
        );
      case "Finalized":
        return (
          <Badge className="bg-forensic-success/20 text-forensic-success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Finalized
          </Badge>
        );
      case "Filed":
        return (
          <Badge className="bg-forensic-court/20 text-forensic-court">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Filed
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-forensic-danger/20 text-forensic-danger">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-forensic-accent/20 text-forensic-accent">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Update document status
  const handleChangeStatus = (
    documentId: string,
    newStatus: DocumentStatus
  ) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === documentId
        ? { ...doc, status: newStatus, modifiedAt: new Date().toISOString() }
        : doc
    );

    setDocuments(updatedDocuments);
    toast({
      title: "Status Updated",
      description: `Document status changed to ${newStatus}`,
    });
  };

  const openDocumentView = (documentId: string) => {
    toast({
      title: "Opening Document",
      description: `Opening document ${documentId} for viewing`,
    });
    // In a real implementation, this would open the document view page
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">
          Legal Documentation
        </h1>
        <Button
          className="bg-forensic-court hover:bg-forensic-court/90"
          onClick={handleNewDocument}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-forensic-court" />
            Document Repository
          </CardTitle>
          <CardDescription>
            Manage and organize case-related legal documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-1 items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-forensic-500" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-forensic-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {documentStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-forensic-500" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-forensic-500">Loading documents...</p>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Case</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      onClick={() => openDocumentView(doc.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{doc.title}</span>
                          <span className="text-xs text-forensic-500">
                            {doc.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-forensic-50">
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-forensic-court hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cases/${doc.caseId}`);
                          }}
                        >
                          {doc.caseId}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-forensic-500 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(doc.modifiedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className="flex justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditDocument(doc)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-forensic-danger hover:text-forensic-danger/90"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-forensic-500">
                No documents found matching your criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Document" : "Create New Document"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the selected document"
                : "Enter the details for the new legal document"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-forensic-700"
              >
                Document Title *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter document title"
                className="border-forensic-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-forensic-700"
              >
                Document Type *
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="caseId"
                className="text-sm font-medium text-forensic-700"
              >
                Associated Case *
              </label>
              <Select
                value={formData.caseId}
                onValueChange={(value) => handleSelectChange("caseId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select case" />
                </SelectTrigger>
                <SelectContent>
                  {caseOptions.map((caseOption) => (
                    <SelectItem key={caseOption.id} value={caseOption.id}>
                      {caseOption.id} - {caseOption.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="text-sm font-medium text-forensic-700"
              >
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any notes about this document"
                className="border-forensic-200 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-forensic-court hover:bg-forensic-court/90"
              onClick={handleSaveDocument}
            >
              {isEditing ? "Update Document" : "Create Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalDocumentation;
