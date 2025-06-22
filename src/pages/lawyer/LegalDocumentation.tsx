import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge, BadgeProps } from "@/components/ui/badge";
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
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCcw,
  FileUp,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  version: number;
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
    version: 2,
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
    version: 1,
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
    version: 4,
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
    version: 1,
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

const statusBadgeMap: Record<DocumentStatus, { variant: BadgeProps["variant"]; icon: React.ElementType }> = {
  Draft: { variant: "secondary", icon: Clock },
  Review: { variant: "warning", icon: Clock },
  Finalized: { variant: "default", icon: CheckCircle2 },
  Filed: { variant: "info", icon: FileUp },
  Approved: { variant: "success", icon: CheckCircle2 },
  Rejected: { variant: "destructive", icon: AlertCircle },
};

const LegalDocumentation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    type: "Motion" as DocumentType,
    caseId: "",
    notes: "",
  });

  const filteredDocuments = useMemo(() => {
    setLoading(true);
    const filtered = documents
      .filter(doc => statusFilter === "all" || doc.status === statusFilter)
      .filter(doc => typeFilter === "all" || doc.type === typeFilter)
      .filter(doc =>
        searchTerm === "" ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setLoading(false);
    return filtered;
  }, [documents, searchTerm, statusFilter, typeFilter]);

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

  const getStatusBadge = (status: DocumentStatus) => {
    return statusBadgeMap[status] || { variant: "default", icon: AlertCircle };
  };

  const handleNewDocument = () => {
    resetForm();
    setDialogOpen(true);
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDocument = () => {
    if (!formData.title.trim() || !formData.caseId) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentDocument) {
      const updatedDocuments = documents.map(doc =>
        doc.id === currentDocument.id
          ? {
              ...doc,
              title: formData.title,
              type: formData.type,
              caseId: formData.caseId,
              notes: formData.notes,
              modifiedAt: new Date().toISOString(),
              version: doc.version + 1,
            }
          : doc
      );
      setDocuments(updatedDocuments);
      toast({
        title: "Document Updated",
        description: `Version ${currentDocument.version + 1} of "${formData.title}" has been saved.`,
        variant: "success",
      });
    } else {
      const newDocument: Document = {
        id: `DOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        title: formData.title,
        type: formData.type as DocumentType,
        caseId: formData.caseId,
        createdBy: "Alex Tran", // Placeholder for auth user
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        status: "Draft",
        version: 1,
        notes: formData.notes,
      };
      setDocuments([newDocument, ...documents]);
      toast({
        title: "Document Created",
        description: `"${formData.title}" has been created as a draft.`,
        variant: "success",
      });
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
    toast({
      title: "Document Deleted",
      description: "The document has been permanently removed.",
      variant: "destructive",
    });
  };

  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "Download Initiated",
      description: `Downloading "${document.title}"...`,
    });
  };

  const openDocumentView = (documentId: string) => {
    toast({
      title: "Opening Document",
      description: `Loading document ${documentId}...`,
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Legal Documentation Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage, create, and track all case-related legal documents.
          </p>
        </div>
        <Button onClick={handleNewDocument}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Document Repository
          </CardTitle>
          <CardDescription>
            A centralized place for all your legal documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title, case ID, or document ID..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {documentStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map(type => (
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
            <div className="text-center py-10 text-muted-foreground">Loading documents...</div>
          ) : filteredDocuments.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Case</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(doc => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary hover:underline cursor-pointer" onClick={() => openDocumentView(doc.id)}>{doc.title}</span>
                          <span className="text-xs text-muted-foreground">
                            ID: {doc.id} | v{doc.version}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-primary hover:underline cursor-pointer"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/cases/${doc.caseId}`);
                          }}
                        >
                          {doc.caseId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {(() => {
                            const { variant, icon: Icon } = getStatusBadge(doc.status);
                            return (
                              <Badge variant={variant}>
                                <Icon className="mr-1 h-3 w-3" />
                                {doc.status}
                              </Badge>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(doc.modifiedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDocumentView(doc.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditDocument(doc)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
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
            <div className="text-center py-16 px-4">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-primary">No Documents Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No documents matched your search criteria. Try adjusting your filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {isEditing ? "Edit Document" : "Create New Document"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Editing "${formData.title}". Make your changes below.`
                : "Fill in the details to create a new legal document."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Motion to Compel Discovery"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="type">Document Type *</Label>
                <Select value={formData.type} onValueChange={value => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="caseId">Associated Case *</Label>
                <Select value={formData.caseId} onValueChange={value => handleSelectChange("caseId", value)}>
                  <SelectTrigger id="caseId">
                    <SelectValue placeholder="Select a case" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseOptions.map(caseOption => (
                      <SelectItem key={caseOption.id} value={caseOption.id}>
                        {caseOption.id} - {caseOption.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any relevant notes, version changes, or comments here."
                className="min-h-[120px]"
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
            <Button onClick={handleSaveDocument}>
              {isEditing ? "Save Changes" : "Create Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalDocumentation;
