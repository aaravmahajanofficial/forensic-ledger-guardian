import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
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
} from "recharts";
import { TooltipProps } from 'recharts';

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

// Updated colors from the design document
const COLORS = [
  "#1976D2", // Cerulean Blue (Secondary)
  "#2ECC71", // Emerald Green (Accent)
  "#FFB300", // Amber (Warning)
  "#1C1F2A", // Deep Navy (Primary)
  "#5F6368", // Slate Grey (Text Secondary)
  "#E53935", // Crimson Red (Error)
];

const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState("year");
  const { toast } = useToast();

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Export Initiated",
      description: `Generating and downloading ${reportType} report.`,
      variant: "default",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated.",
      variant: "default",
    });
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-background border rounded-lg shadow-lg">
          <p className="label text-foreground font-bold">{`${label}`}</p>
          {payload.map((pld, index) => (
            <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-background text-foreground">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize trends, analyze data, and export detailed reports.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button
            onClick={() => handleDownloadReport("Full Analytics")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full md:w-auto md:inline-grid">
          <TabsTrigger value="cases">
            <FileText className="h-5 w-5 mr-2" />
            Cases Analytics
          </TabsTrigger>
          <TabsTrigger value="evidence">
            <BarChart2 className="h-5 w-5 mr-2" />
            Evidence Analytics
          </TabsTrigger>
          <TabsTrigger value="users">
            <PieChart className="h-5 w-5 mr-2" />
            User Analytics
          </TabsTrigger>
        </TabsList>

        {/* Cases Analytics Tab */}
        <TabsContent value="cases" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-6 w-6 text-secondary" />
                  Monthly Case Trends
                </CardTitle>
                <CardDescription>
                  Case submission and resolution trends over the selected period.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyCases}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '14px' }} />
                      <Line
                        type="monotone"
                        dataKey="submitted"
                        stroke="var(--color-secondary)"
                        strokeWidth={2}
                        name="Submitted Cases"
                        dot={{ r: 4, fill: 'var(--color-secondary)' }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        name="Resolved Cases"
                        dot={{ r: 4, fill: 'var(--color-accent)' }}
                        activeDot={{ r: 8 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-6 w-6 text-secondary" />
                  Case Type Distribution
                </CardTitle>
                <CardDescription>Breakdown of cases by type.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[270px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={casesByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ _name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {casesByType.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {casesByType.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span>{entry.name}</span>
                      </div>
                      <span className="font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-secondary" />
                Case Status Overview
              </CardTitle>
              <CardDescription>
                Current status of all cases in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={caseStatus}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="value" name="Cases" radius={[4, 4, 0, 0]}>
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
          </Card>
        </TabsContent>

        {/* Evidence Analytics Tab */}
        <TabsContent value="evidence" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-6 w-6 text-accent" />
                  Evidence Processing Trends
                </CardTitle>
                <CardDescription>
                  Evidence upload and verification trends over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyEvidence}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '14px' }} />
                      <Line
                        type="monotone"
                        dataKey="uploaded"
                        stroke="var(--color-warning)"
                        strokeWidth={2}
                        name="Uploaded Evidence"
                        dot={{ r: 4, fill: 'var(--color-warning)' }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="verified"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        name="Verified Evidence"
                        dot={{ r: 4, fill: 'var(--color-accent)' }}
                        activeDot={{ r: 8 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-6 w-6 text-accent" />
                  Evidence Type Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of evidence by category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[270px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={evidenceByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ _name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {evidenceByType.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[(index + 1) % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {evidenceByType.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[(index + 1) % COLORS.length],
                          }}
                        />
                        <span>{entry.name}</span>
                      </div>
                      <span className="font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-accent" />
                Evidence Verification Status
              </CardTitle>
              <CardDescription>
                Current status of all evidence verifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={verificationStatus}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="value" name="Evidence Items" radius={[4, 4, 0, 0]}>
                      {verificationStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[(index + 1) % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Analytics Tab */}
        <TabsContent value="users" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-warning" />
                  Monthly Active Users
                </CardTitle>
                <CardDescription>
                  Trend of active users in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyActiveUsers}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '14px' }} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        name="Active Users"
                        dot={{ r: 4, fill: 'var(--color-primary)' }}
                        activeDot={{ r: 8 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-6 w-6 text-warning" />
                  User Role Distribution
                </CardTitle>
                <CardDescription>Breakdown of users by role.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[270px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={usersByRole}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ _name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {usersByRole.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[(index + 2) % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {usersByRole.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[(index + 2) % COLORS.length],
                          }}
                        />
                        <span>{entry.name}</span>
                      </div>
                      <span className="font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-warning" />
                User Activity Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of user activity by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivity}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="value" name="Activity Count" radius={[4, 4, 0, 0]}>
                      {userActivity.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[(index + 2) % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;
