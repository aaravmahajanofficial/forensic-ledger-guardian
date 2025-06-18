import React from "react";
import {
  BarChart2,
  FileDown,
  FileText,
  Calendar,
  BarChart,
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
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OfficerReports = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-forensic-800">
            Officer Reports
          </h1>
          <p className="text-sm text-forensic-600">
            View and generate reports for your cases and FIRs
          </p>
        </div>
        <Button className="flex items-center bg-forensic-800 hover:bg-forensic-800/90">
          <FileDown className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="firs">FIR Reports</TabsTrigger>
          <TabsTrigger value="cases">Case Reports</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-forensic-800" />
                  FIR Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">
                      Total FIRs
                    </span>
                    <span className="font-medium">36</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">Pending</span>
                    <Badge className="bg-forensic-warning/20 text-forensic-warning">
                      14
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">Verified</span>
                    <Badge className="bg-forensic-accent/20 text-forensic-accent">
                      8
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">Processed</span>
                    <Badge className="bg-forensic-success/20 text-forensic-success">
                      14
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-forensic-evidence" />
                  Case Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">
                      Total Cases
                    </span>
                    <span className="font-medium">22</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">Open</span>
                    <Badge className="bg-forensic-success/20 text-forensic-success">
                      15
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">Pending</span>
                    <Badge className="bg-forensic-warning/20 text-forensic-warning">
                      5
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">Closed</span>
                    <Badge className="bg-gray-200 text-gray-600">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-forensic-accent" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">
                      New FIRs (This Month)
                    </span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">
                      Cases Created
                    </span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">
                      Evidence Submitted
                    </span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-forensic-600">
                      Case Updates
                    </span>
                    <span className="font-medium">16</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-forensic-800" />
                Activity Overview
              </CardTitle>
              <CardDescription>
                Activity trends for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-slate-50">
              <div className="text-center text-forensic-500">
                <BarChart2 className="mx-auto h-16 w-16 opacity-50 mb-2" />
                <p>Monthly activity chart will appear here</p>
                <p className="text-sm">
                  Data visualization requires actual data integration
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FIR Reports Tab */}
        <TabsContent value="firs" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>FIR Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports for First Information Reports
                </CardDescription>
              </div>
              <Select defaultValue="this-month">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="half-year">Last 6 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-4 py-3 text-left font-medium">
                        FIR ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Title</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Date Filed
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
                        id: "FF-2023-120",
                        title: "Unauthorized Data Access",
                        date: "Apr 09, 2025",
                        status: "pending",
                      },
                      {
                        id: "FF-2023-119",
                        title: "Enterprise Network Breach",
                        date: "Apr 08, 2025",
                        status: "verified",
                      },
                      {
                        id: "FF-2023-118",
                        title: "Ransomware Attack",
                        date: "Apr 05, 2025",
                        status: "assigned",
                      },
                      {
                        id: "FF-2023-117",
                        title: "Corporate Data Theft",
                        date: "Apr 01, 2025",
                        status: "processed",
                      },
                      {
                        id: "FF-2023-116",
                        title: "Device Compromise",
                        date: "Mar 28, 2025",
                        status: "verified",
                      },
                    ].map((fir, i) => (
                      <tr
                        key={fir.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3">{fir.id}</td>
                        <td className="px-4 py-3">{fir.title}</td>
                        <td className="px-4 py-3">{fir.date}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              fir.status === "pending"
                                ? "bg-forensic-warning/20 text-forensic-warning"
                                : fir.status === "verified"
                                ? "bg-forensic-accent/20 text-forensic-accent"
                                : fir.status === "assigned"
                                ? "bg-forensic-court/20 text-forensic-court"
                                : "bg-forensic-success/20 text-forensic-success"
                            }
                          >
                            {fir.status.charAt(0).toUpperCase() +
                              fir.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="h-8">
                            View Report
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

        {/* Cases Reports Tab */}
        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Case Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports for your assigned cases
                </CardDescription>
              </div>
              <Select defaultValue="this-month">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="half-year">Last 6 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-4 py-3 text-left font-medium">
                        Case ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Title</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Created Date
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
                        id: "CC-2023-056",
                        title: "Tech Corp Data Breach",
                        date: "Apr 01, 2025",
                        status: "open",
                      },
                      {
                        id: "CC-2023-078",
                        title: "Financial Fraud",
                        date: "Mar 15, 2025",
                        status: "open",
                      },
                      {
                        id: "CC-2023-112",
                        title: "Healthcare Records Theft",
                        date: "Feb 28, 2025",
                        status: "closed",
                      },
                    ].map((caseItem, i) => (
                      <tr
                        key={caseItem.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3">{caseItem.id}</td>
                        <td className="px-4 py-3">{caseItem.title}</td>
                        <td className="px-4 py-3">{caseItem.date}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              caseItem.status === "open"
                                ? "bg-forensic-success/20 text-forensic-success"
                                : caseItem.status === "pending"
                                ? "bg-forensic-warning/20 text-forensic-warning"
                                : "bg-gray-200 text-gray-600"
                            }
                          >
                            {caseItem.status.charAt(0).toUpperCase() +
                              caseItem.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="h-8">
                            View Report
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

export default OfficerReports;
