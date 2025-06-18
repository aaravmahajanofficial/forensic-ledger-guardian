import React, { useState } from "react";
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
import {
  BarChart2,
  Download,
  FileText,
  PieChart,
  LineChart,
  Calendar,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import {
  Bar,
  BarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";

// Mock data for case statistics
const casesByType = [
  { name: "Cybercrime", value: 45 },
  { name: "Financial Fraud", value: 28 },
  { name: "Intellectual Property", value: 15 },
  { name: "Identity Theft", value: 12 },
  { name: "Other", value: 8 },
];

const caseStatus = [
  { name: "Active", value: 38 },
  { name: "Closed", value: 46 },
  { name: "Pending Review", value: 12 },
  { name: "Archived", value: 24 },
];

const monthlyCases = [
  { month: "Jan", submitted: 18, resolved: 12 },
  { month: "Feb", submitted: 22, resolved: 16 },
  { month: "Mar", submitted: 25, resolved: 20 },
  { month: "Apr", submitted: 32, resolved: 24 },
  { month: "May", submitted: 28, resolved: 22 },
  { month: "Jun", submitted: 30, resolved: 26 },
  { month: "Jul", submitted: 35, resolved: 28 },
  { month: "Aug", submitted: 40, resolved: 32 },
  { month: "Sep", submitted: 36, resolved: 30 },
  { month: "Oct", submitted: 29, resolved: 24 },
  { month: "Nov", submitted: 24, resolved: 20 },
  { month: "Dec", submitted: 20, resolved: 15 },
];

// Mock data for evidence statistics
const evidenceByType = [
  { name: "Digital Images", value: 112 },
  { name: "Documents", value: 86 },
  { name: "Audio/Video", value: 64 },
  { name: "Network Data", value: 45 },
  { name: "Other", value: 28 },
];

const verificationStatus = [
  { name: "Verified", value: 285 },
  { name: "Pending", value: 42 },
  { name: "Failed", value: 8 },
];

const monthlyEvidence = [
  { month: "Jan", uploaded: 24, verified: 20 },
  { month: "Feb", uploaded: 30, verified: 26 },
  { month: "Mar", uploaded: 35, verified: 30 },
  { month: "Apr", uploaded: 42, verified: 35 },
  { month: "May", uploaded: 38, verified: 32 },
  { month: "Jun", uploaded: 40, verified: 36 },
  { month: "Jul", uploaded: 46, verified: 42 },
  { month: "Aug", uploaded: 52, verified: 46 },
  { month: "Sep", uploaded: 48, verified: 44 },
  { month: "Oct", uploaded: 40, verified: 35 },
  { month: "Nov", uploaded: 32, verified: 28 },
  { month: "Dec", uploaded: 28, verified: 24 },
];

// Mock data for user statistics
const usersByRole = [
  { name: "Court", value: 8 },
  { name: "Officers", value: 24 },
  { name: "Forensic", value: 16 },
  { name: "Lawyers", value: 12 },
];

const userActivity = [
  { name: "Case Management", value: 38 },
  { name: "Evidence Processing", value: 42 },
  { name: "Authentication", value: 20 },
  { name: "Administration", value: 15 },
  { name: "Other", value: 8 },
];

const monthlyActiveUsers = [
  { month: "Jan", users: 35 },
  { month: "Feb", users: 38 },
  { month: "Mar", users: 40 },
  { month: "Apr", users: 42 },
  { month: "May", users: 45 },
  { month: "Jun", users: 44 },
  { month: "Jul", users: 46 },
  { month: "Aug", users: 48 },
  { month: "Sep", users: 50 },
  { month: "Oct", users: 52 },
  { month: "Nov", users: 54 },
  { month: "Dec", users: 58 },
];

// Colors for charts
const COLORS = [
  "#4F6AFF",
  "#FF6E36",
  "#36D399",
  "#FFBD49",
  "#8257E5",
  "#F688B1",
];

const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState("year");
  const { toast } = useToast();

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Downloaded",
      description: `${reportType} report has been downloaded.`,
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated to the latest information.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-forensic-800">
          Reports & Analytics
        </h1>

        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>

          <Button
            className="bg-forensic-court hover:bg-forensic-court/90"
            onClick={() => handleDownloadReport("Full Analytics")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cases">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Cases
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-forensic-court" />
                  Monthly Case Trends
                </CardTitle>
                <CardDescription>
                  Case submission and resolution trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyCases}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="submitted"
                        stroke="#4F6AFF"
                        name="Submitted Cases"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#36D399"
                        name="Resolved Cases"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-forensic-600">
                  Total Cases:{" "}
                  {monthlyCases.reduce((sum, item) => sum + item.submitted, 0)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport("Case Trends")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Chart
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-forensic-court" />
                  Case Distribution
                </CardTitle>
                <CardDescription>Breakdown of cases by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={casesByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {casesByType.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-1">
                  {casesByType.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span>
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-forensic-court" />
                Case Status Overview
              </CardTitle>
              <CardDescription>
                Current status of all cases in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={caseStatus}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Cases" fill="#4F6AFF">
                      {caseStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-forensic-600">
                Total Cases:{" "}
                {caseStatus.reduce((sum, item) => sum + item.value, 0)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport("Case Status")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Chart
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-forensic-accent" />
                  Evidence Processing Trends
                </CardTitle>
                <CardDescription>
                  Evidence upload and verification trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyEvidence}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="uploaded"
                        stroke="#FF6E36"
                        name="Uploaded Evidence"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="verified"
                        stroke="#36D399"
                        name="Verified Evidence"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-forensic-600">
                  Total Evidence:{" "}
                  {monthlyEvidence.reduce(
                    (sum, item) => sum + item.uploaded,
                    0
                  )}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport("Evidence Trends")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Chart
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-forensic-accent" />
                  Evidence Types
                </CardTitle>
                <CardDescription>
                  Breakdown of evidence by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={evidenceByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {evidenceByType.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-1">
                  {evidenceByType.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span>
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-forensic-accent" />
                Verification Status
              </CardTitle>
              <CardDescription>
                Current status of all evidence verifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={verificationStatus}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Evidence Items" fill="#FF6E36">
                      {verificationStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-forensic-600">
                Total Items:{" "}
                {verificationStatus.reduce((sum, item) => sum + item.value, 0)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport("Verification Status")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Chart
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-forensic-warning" />
                  Active Users Trend
                </CardTitle>
                <CardDescription>
                  Monthly active users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyActiveUsers}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#8257E5"
                        name="Active Users"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-forensic-600">
                  Current Active Users:{" "}
                  {monthlyActiveUsers[monthlyActiveUsers.length - 1].users}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport("User Trends")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Chart
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-forensic-warning" />
                  User Distribution
                </CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={usersByRole}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {usersByRole.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-1">
                  {usersByRole.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span>
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-forensic-warning" />
                User Activity Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of user activity by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivity}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Activity Count" fill="#8257E5">
                      {userActivity.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-forensic-600">
                Total Activities:{" "}
                {userActivity.reduce((sum, item) => sum + item.value, 0)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport("User Activity")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Chart
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;
