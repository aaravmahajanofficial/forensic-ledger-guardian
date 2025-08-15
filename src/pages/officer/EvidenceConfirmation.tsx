import {
  CheckCircle,
  FileCheck,
  Shield,
  Filter,
  Search,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EvidenceConfirmation = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-forensic-800">
            Evidence Confirmation
          </h1>
          <p className="text-sm text-forensic-600">
            Review and confirm evidence submitted to your assigned cases
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="pending">Pending ({5})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="all">All Evidence</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-500" />
            <Input
              placeholder="Search evidence..."
              className="pl-8 border-forensic-200"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-forensic-500" />
            <Select defaultValue="all">
              <SelectTrigger className="border-forensic-200 w-[160px]">
                <SelectValue placeholder="Filter by case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="CC-2023-056">CC-2023-056</SelectItem>
                <SelectItem value="CC-2023-078">CC-2023-078</SelectItem>
                <SelectItem value="CC-2023-112">CC-2023-112</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pending Tab */}
        <TabsContent value="pending" className="space-y-4">
          {[
            {
              id: "EV-2023-087",
              caseId: "CC-2023-056",
              title: "Server Access Logs",
              submittedBy: "Sarah Lee",
              submittedDate: "Apr 09, 2025",
              type: "Document",
              hash: "0x4a3d...8f21",
            },
            {
              id: "EV-2023-086",
              caseId: "CC-2023-056",
              title: "Network Traffic Capture",
              submittedBy: "Sarah Lee",
              submittedDate: "Apr 09, 2025",
              type: "Document",
              hash: "0xc7e5...2d9a",
            },
            {
              id: "EV-2023-085",
              caseId: "CC-2023-078",
              title: "Transaction Records",
              submittedBy: "Michael Chen",
              submittedDate: "Apr 08, 2025",
              type: "Document",
              hash: "0x9b2f...76c3",
            },
            {
              id: "EV-2023-084",
              caseId: "CC-2023-078",
              title: "Security Camera Footage",
              submittedBy: "Michael Chen",
              submittedDate: "Apr 08, 2025",
              type: "Video",
              hash: "0x3e1d...9a7b",
            },
            {
              id: "EV-2023-083",
              caseId: "CC-2023-112",
              title: "System Backup Files",
              submittedBy: "Alex Johnson",
              submittedDate: "Apr 07, 2025",
              type: "Other",
              hash: "0xf5c2...4e8d",
            },
          ].map((evidence) => (
            <Card key={evidence.id} className="border-forensic-200">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-forensic-50 p-2 rounded-full">
                        <FileCheck className="h-5 w-5 text-forensic-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-forensic-800">
                            {evidence.id}
                          </h3>
                          <Badge className="bg-forensic-warning/20 text-forensic-warning">
                            Pending Confirmation
                          </Badge>
                        </div>
                        <p className="text-sm text-forensic-500">
                          Submitted on {evidence.submittedDate} by{" "}
                          {evidence.submittedBy}
                        </p>
                      </div>
                    </div>

                    <p className="text-forensic-600 font-medium">
                      {evidence.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-forensic-600">
                      <span>
                        <strong>Case ID:</strong> {evidence.caseId}
                      </span>
                      <span>
                        <strong>Type:</strong> {evidence.type}
                      </span>
                      <span>
                        <strong>Hash:</strong> {evidence.hash}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>

                    <Button
                      size="sm"
                      className="bg-forensic-accent hover:bg-forensic-accent/90 h-8 flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Confirmed Tab */}
        <TabsContent value="confirmed" className="space-y-4">
          {[
            {
              id: "EV-2023-082",
              caseId: "CC-2023-056",
              title: "Email Correspondence",
              submittedBy: "John Doe",
              submittedDate: "Apr 06, 2025",
              confirmedDate: "Apr 07, 2025",
              type: "Document",
              hash: "0x2d9c...7b4e",
            },
            {
              id: "EV-2023-081",
              caseId: "CC-2023-078",
              title: "Database Dump",
              submittedBy: "John Doe",
              submittedDate: "Apr 05, 2025",
              confirmedDate: "Apr 06, 2025",
              type: "Document",
              hash: "0x7a3f...1c9d",
            },
            {
              id: "EV-2023-080",
              caseId: "CC-2023-112",
              title: "Access Control Logs",
              submittedBy: "Emily Wilson",
              submittedDate: "Apr 04, 2025",
              confirmedDate: "Apr 05, 2025",
              type: "Document",
              hash: "0x6b2e...8d5a",
            },
          ].map((evidence) => (
            <Card key={evidence.id} className="border-forensic-200">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-forensic-50 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-forensic-success" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-forensic-800">
                            {evidence.id}
                          </h3>
                          <Badge className="bg-forensic-success/20 text-forensic-success">
                            Confirmed
                          </Badge>
                        </div>
                        <p className="text-sm text-forensic-500">
                          Confirmed on {evidence.confirmedDate}
                        </p>
                      </div>
                    </div>

                    <p className="text-forensic-600 font-medium">
                      {evidence.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-forensic-600">
                      <span>
                        <strong>Case ID:</strong> {evidence.caseId}
                      </span>
                      <span>
                        <strong>Submitted by:</strong> {evidence.submittedBy}
                      </span>
                      <span>
                        <strong>Type:</strong> {evidence.type}
                      </span>
                      <span>
                        <strong>Hash:</strong> {evidence.hash}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Chain</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* All Evidence Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Evidence</CardTitle>
              <CardDescription>
                Complete list of all evidence items requiring your review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-4 py-3 text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Title</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Case ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Submitted
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "EV-2023-087",
                        title: "Server Access Logs",
                        caseId: "CC-2023-056",
                        date: "Apr 09, 2025",
                        status: "pending",
                      },
                      {
                        id: "EV-2023-086",
                        title: "Network Traffic Capture",
                        caseId: "CC-2023-056",
                        date: "Apr 09, 2025",
                        status: "pending",
                      },
                      {
                        id: "EV-2023-085",
                        title: "Transaction Records",
                        caseId: "CC-2023-078",
                        date: "Apr 08, 2025",
                        status: "pending",
                      },
                      {
                        id: "EV-2023-084",
                        title: "Security Camera Footage",
                        caseId: "CC-2023-078",
                        date: "Apr 08, 2025",
                        status: "pending",
                      },
                      {
                        id: "EV-2023-083",
                        title: "System Backup Files",
                        caseId: "CC-2023-112",
                        date: "Apr 07, 2025",
                        status: "pending",
                      },
                      {
                        id: "EV-2023-082",
                        title: "Email Correspondence",
                        caseId: "CC-2023-056",
                        date: "Apr 06, 2025",
                        status: "confirmed",
                      },
                      {
                        id: "EV-2023-081",
                        title: "Database Dump",
                        caseId: "CC-2023-078",
                        date: "Apr 05, 2025",
                        status: "confirmed",
                      },
                      {
                        id: "EV-2023-080",
                        title: "Access Control Logs",
                        caseId: "CC-2023-112",
                        date: "Apr 04, 2025",
                        status: "confirmed",
                      },
                    ].map((evidence, i) => (
                      <tr
                        key={evidence.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3">{evidence.id}</td>
                        <td className="px-4 py-3">{evidence.title}</td>
                        <td className="px-4 py-3">{evidence.caseId}</td>
                        <td className="px-4 py-3">{evidence.date}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              evidence.status === "pending"
                                ? "bg-forensic-warning/20 text-forensic-warning"
                                : "bg-forensic-success/20 text-forensic-success"
                            }
                          >
                            {evidence.status.charAt(0).toUpperCase() +
                              evidence.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="h-8">
                            {evidence.status === "pending" ? "Confirm" : "View"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Previous Page</Button>
              <Button variant="outline">Next Page</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvidenceConfirmation;
