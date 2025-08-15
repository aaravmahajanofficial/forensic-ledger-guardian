import { useParams, Link } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Calendar,
  User,
  Shield,
  FileDigit,
  Clock,
  Scale,
  ArrowUpRight,
} from "lucide-react";

const CaseDetail = () => {
  const { caseId } = useParams();

  // Mock data - in a real app this would be fetched from API or blockchain
  const caseData = {
    id: caseId || "FF-2023-123",
    title: "State vs. John Doe",
    status: "active",
    dateCreated: "April 15, 2023",
    courtDate: "October 10, 2023",
    filingOfficer: "Officer James Wilson",
    assignedJudge: "Hon. Sarah Mitchell",
    description:
      "Case involving alleged theft of digital assets worth approximately $75,000 from a cryptocurrency exchange.",
    evidenceCount: 12,
    parties: [
      { name: "John Doe", role: "Defendant" },
      { name: "State", role: "Prosecutor" },
    ],
    evidenceItems: [
      {
        id: "EV-2023-001",
        name: "Transaction Log",
        type: "digital",
        status: "verified",
      },
      {
        id: "EV-2023-002",
        name: "Access Records",
        type: "digital",
        status: "verified",
      },
      {
        id: "EV-2023-003",
        name: "Email Correspondence",
        type: "digital",
        status: "pending",
      },
    ],
    timeline: [
      {
        date: "April 12, 2023",
        event: "Case Filed",
        actor: "Officer James Wilson",
      },
      {
        date: "April 15, 2023",
        event: "Evidence Uploaded",
        actor: "Forensic Tech Sarah Johnson",
      },
      {
        date: "April 20, 2023",
        event: "Evidence Verified",
        actor: "Blockchain System",
      },
      { date: "May 5, 2023", event: "Court Date Set", actor: "Court Admin" },
    ],
  };

  // Determine badge color based on status
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-forensic-accent text-white";
      case "closed":
        return "bg-forensic-400 text-white";
      case "pending":
        return "bg-forensic-warning text-forensic-900";
      default:
        return "bg-forensic-600 text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-forensic-800">
              {caseData.title}
            </h1>
            <Badge className={getBadgeColor(caseData.status)}>
              {caseData.status.charAt(0).toUpperCase() +
                caseData.status.slice(1)}
            </Badge>
          </div>
          <p className="text-forensic-500">Case ID: {caseData.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-forensic-evidence"
          >
            <FileDigit className="h-4 w-4 mr-2" />
            View Evidence
          </Button>
          <Button variant="outline" size="sm" className="text-forensic-court">
            <Scale className="h-4 w-4 mr-2" />
            Legal Documents
          </Button>
        </div>
      </div>

      {/* Case Content */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <FileDigit className="h-4 w-4" />
            <span>Evidence ({caseData.evidenceCount})</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Details</CardTitle>
              <CardDescription>Overview and key information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-forensic-500">Date Filed</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-forensic-600 mr-2" />
                    <p>{caseData.dateCreated}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-forensic-500">Court Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-forensic-600 mr-2" />
                    <p>{caseData.courtDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-forensic-500">Filing Officer</p>
                  <div className="flex items-center mt-1">
                    <Shield className="h-4 w-4 text-forensic-600 mr-2" />
                    <p>{caseData.filingOfficer}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-forensic-500">Assigned Judge</p>
                  <div className="flex items-center mt-1">
                    <Scale className="h-4 w-4 text-forensic-600 mr-2" />
                    <p>{caseData.assignedJudge}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-forensic-500">Description</p>
                <p className="mt-1 p-2 bg-forensic-50 rounded-md">
                  {caseData.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Involved Parties</CardTitle>
                <CardDescription>
                  People associated with this case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.parties.map((party, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-forensic-600 mr-2" />
                        <span>{party.name}</span>
                      </div>
                      <Badge variant="outline">{party.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Evidence</CardTitle>
                <CardDescription>Recent evidence submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.evidenceItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <FileDigit className="h-4 w-4 text-forensic-accent mr-2" />
                        <span>{item.name}</span>
                      </div>
                      <Badge
                        className={
                          item.status === "verified"
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to={`/evidence?case=${caseData.id}`}>
                    View All Evidence
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Evidence</CardTitle>
              <CardDescription>
                All evidence associated with this case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseData.evidenceItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                  >
                    <div>
                      <div className="flex items-center">
                        <FileDigit className="h-4 w-4 text-forensic-accent mr-2" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-sm text-forensic-500 mt-1">
                        ID: {item.id} | Type: {item.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          item.status === "verified"
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }
                      >
                        {item.status}
                      </Badge>
                      <Button size="sm" className="bg-forensic-accent">
                        <span>View</span>
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between">
                <Button variant="outline">Add Evidence</Button>
                <Button variant="outline">Export List</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Timeline</CardTitle>
              <CardDescription>Chronological activity log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l border-forensic-200">
                {caseData.timeline.map((event, index) => (
                  <div key={index} className="mb-6 relative">
                    <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border-2 border-forensic-accent bg-white"></div>
                    <div>
                      <p className="text-sm text-forensic-500">{event.date}</p>
                      <p className="font-medium mt-0.5">{event.event}</p>
                      <p className="text-sm text-forensic-600 mt-0.5">
                        By: {event.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseDetail;
