import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  FileText,
  PlusCircle,
  Download,
  Eye,
  ListFilter,
  Search,
} from "lucide-react";
import { EvidenceItem } from "@/types/case";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CaseEvidenceProps {
  evidenceItems: EvidenceItem[];
  caseId: string;
}

const CaseEvidence: React.FC<CaseEvidenceProps> = ({ evidenceItems }) => {
  // TODO: Implement filtering and searching state

  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Case Evidence
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage and review all evidence for this case
              </CardDescription>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Evidence
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search evidence..." className="pl-10" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Verified</DropdownMenuItem>
              <DropdownMenuItem>Pending</DropdownMenuItem>
              <DropdownMenuItem>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {evidenceItems.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Submitted On
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidenceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.type}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(item.dateAdded).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "verified"
                            ? "success"
                            : item.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                        className={cn("text-xs font-semibold")}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No Evidence Found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There is no evidence associated with this case yet.
            </p>
            <Button className="mt-6">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Evidence
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseEvidence;
