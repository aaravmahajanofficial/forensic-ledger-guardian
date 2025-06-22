import React from "react";
import {
  BarChartBig,
  FileDown,
  FileText,
  Calendar,
  Briefcase,
  Download,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type VariantProps } from "class-variance-authority";

const firsData = [
  {
    id: "FF-2024-120",
    title: "Unauthorized Data Access",
    date: "Apr 09, 2024",
    status: "Pending",
  },
  {
    id: "FF-2024-119",
    title: "Enterprise Network Breach",
    date: "Apr 08, 2024",
    status: "Verified",
  },
  {
    id: "FF-2024-118",
    title: "Ransomware Attack",
    date: "Apr 05, 2024",
    status: "Assigned",
  },
  {
    id: "FF-2024-117",
    title: "Corporate Data Theft",
    date: "Apr 01, 2024",
    status: "Processed",
  },
  {
    id: "FF-2024-116",
    title: "Device Compromise",
    date: "Mar 28, 2024",
    status: "Verified",
  },
];

const casesData = [
  {
    id: "CC-2024-056",
    title: "Tech Corp Data Breach",
    date: "Apr 01, 2024",
    status: "Open",
  },
  {
    id: "CC-2024-078",
    title: "Financial Fraud Investigation",
    date: "Mar 15, 2024",
    status: "Open",
  },
  {
    id: "CC-2024-112",
    title: "Healthcare Records Theft",
    date: "Feb 28, 2024",
    status: "Closed",
  },
];

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const OfficerReports = () => {
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "verified":
        return "info";
      case "assigned":
        return "secondary";
      case "processed":
      case "open":
        return "success";
      case "closed":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Officer Reports
          </h1>
          <p className="text-muted-foreground">
            View and generate reports for your cases and FIRs.
          </p>
        </div>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Export All Reports
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:w-auto">
          <TabsTrigger value="summary">Dashboard Summary</TabsTrigger>
          <TabsTrigger value="firs">FIR Reports</TabsTrigger>
          <TabsTrigger value="cases">Case Reports</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  FIR Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total FIRs</span>
                  <span className="font-bold text-xl">36</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <Badge variant="warning">14</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Verified</span>
                  <Badge variant="info">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Processed</span>
                  <Badge variant="success">14</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  Case Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Cases</span>
                  <span className="font-bold text-xl">22</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Open</span>
                  <Badge variant="success">15</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <Badge variant="warning">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Closed</span>
                  <Badge variant="default">2</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">New FIRs</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cases Created</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Evidence Submitted</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Case Updates</span>
                  <span className="font-medium">16</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChartBig className="h-5 w-5 mr-2 text-primary" />
                Activity Overview
              </CardTitle>
              <CardDescription>
                Activity trends for the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-muted/30 rounded-lg border">
              <div className="text-center text-muted-foreground">
                <BarChartBig className="mx-auto h-16 w-16 opacity-20 mb-4" />
                <p className="font-semibold">Monthly Activity Chart</p>
                <p className="text-sm">
                  Data visualization will be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FIR Reports Tab */}
        <TabsContent value="firs" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>FIR Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports for First Information Reports.
                </CardDescription>
              </div>
              <Select defaultValue="this-month">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>FIR ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date Filed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firsData.map((fir) => (
                      <TableRow key={fir.id}>
                        <TableCell className="font-mono">{fir.id}</TableCell>
                        <TableCell className="font-medium">{fir.title}</TableCell>
                        <TableCell>{fir.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(fir.status)}>
                            {fir.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-3 w-3" />
                            Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Cases Reports Tab */}
        <TabsContent value="cases" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Case Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports for your assigned cases.
                </CardDescription>
              </div>
              <Select defaultValue="this-month">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casesData.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell className="font-mono">
                          {caseItem.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {caseItem.title}
                        </TableCell>
                        <TableCell>{caseItem.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(caseItem.status)}
                          >
                            {caseItem.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-3 w-3" />
                            Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfficerReports;
