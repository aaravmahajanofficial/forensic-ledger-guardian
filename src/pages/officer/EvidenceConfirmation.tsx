import React from "react";
import {
  CheckCircle,
  FileCheck,
  Shield,
  Filter,
  Search,
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
    <div className="space-y-8">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Evidence Confirmation
              </h1>
              <p className="text-sm text-muted-foreground">
                Review and confirm evidence submitted to your assigned cases
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="pending">Pending ({5})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="all">All Evidence</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card className="mt-6 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search evidence..."
                    className="pl-8"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]">
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
            </CardContent>
          </Card>

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
              <Card key={evidence.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-warning/10 p-2 rounded-full">
                          <FileCheck className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground">
                              {evidence.id}
                            </h3>
                            <Badge variant="warning">
                              Pending Confirmation
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {evidence.submittedDate} by{" "}
                            {evidence.submittedBy}
                          </p>
                        </div>
                      </div>

                      <p className="text-foreground font-medium">
                        {evidence.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirm
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
              <Card key={evidence.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-success/10 p-2 rounded-full">
                          <Shield className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground">
                              {evidence.id}
                            </h3>
                            <Badge variant="success">
                              Confirmed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Confirmed on {evidence.confirmedDate}
                          </p>
                        </div>
                      </div>

                      <p className="text-foreground font-medium">
                        {evidence.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Chain
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
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-foreground">ID</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">Title</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Case ID
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Submitted
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
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
                          className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
                        >
                          <td className="px-4 py-3 text-foreground">{evidence.id}</td>
                          <td className="px-4 py-3 text-foreground">{evidence.title}</td>
                          <td className="px-4 py-3 text-foreground">{evidence.caseId}</td>
                          <td className="px-4 py-3 text-muted-foreground">{evidence.date}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={evidence.status === "pending" ? "warning" : "success"}
                            >
                              {evidence.status.charAt(0).toUpperCase() +
                                evidence.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="outline">
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
      </main>
    </div>
  );
};

export default EvidenceConfirmation;
