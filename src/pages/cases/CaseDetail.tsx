import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import web3Service, {
  Case as BlockchainCase,
  Evidence,
} from "@/services/web3Service";
import { useToast } from "@/hooks/use-toast";

// Types for data from Supabase
type SupabaseCaseRow = {
  case_id: string;
  type: string | null;
  title: string | null;
  description: string | null;
  filed_date: string | null;
  filed_by: string | null;
  tags: string[] | string | null;
  fir_id: string | null;
  assigned_officer: string | null;
};

type SupabaseEvidenceRow = {
  evidence_id: string;
  container_id: string;
  cid: string;
  hash_original: string;
  original_filename: string | null;
  type: string | null;
  description: string | null;
  device_source: string | null;
  collection_location: string | null;
  created_at: string | null;
};

type SupabaseFIRRow = {
  fir_id: string;
  title: string | null;
  incident_type: string | null;
  incident_date: string | null;
  incident_time: string | null;
  incident_location: string | null;
  description: string | null;
  location: string | null;
  filed_by: string | null;
  status: string | null;
  created_at: string | null;
};

type CaseData = {
  id: string;
  title: string;
  status: string;
  dateCreated: string;
  filingOfficer: string;
  assignedOfficer: string | null;
  description: string;
  evidenceCount: number;
  tags: string[];
  firId: string | null;
  seal: boolean;
  open: boolean;
};

type EvidenceItem = {
  id: string;
  name: string;
  type: string;
  status: "verified" | "pending";
  hash: string;
  cid: string;
  submittedAt: string | null;
  description: string | null;
};

type TimelineEvent = {
  date: string;
  event: string;
  actor: string;
};

const CaseDetail = () => {
  const { caseId } = useParams();
  const { toast } = useToast();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Shorten wallet address for display
  const shortenAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Fetch case data from Supabase and blockchain
  useEffect(() => {
    const fetchCaseData = async () => {
      if (!caseId) {
        setError("No case ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch case from Supabase
        const { data: supabaseCase, error: supabaseError } = await supabase
          .from("cases")
          .select("*")
          .eq("case_id", caseId)
          .single();

        if (supabaseError) {
          console.error("Error fetching case from Supabase:", supabaseError);
          throw new Error("Case not found in database");
        }

        const row = supabaseCase as SupabaseCaseRow;

        // Parse tags
        let tags: string[] = [];
        if (Array.isArray(row.tags)) {
          tags = row.tags as string[];
        } else if (typeof row.tags === "string") {
          try {
            const parsed = JSON.parse(row.tags);
            if (Array.isArray(parsed)) tags = parsed;
          } catch {
            // ignore parse error
          }
        }

        // Try to get blockchain data for additional info
        let blockchainCase: BlockchainCase | null = null;
        try {
          blockchainCase = await web3Service.getCase(caseId);
        } catch (err) {
          console.warn("Could not fetch blockchain case data:", err);
        }

        // Build case data object
        const caseDataObj: CaseData = {
          id: row.case_id,
          title: row.title || "Untitled Case",
          status: row.type || "open",
          dateCreated: row.filed_date || new Date().toISOString(),
          filingOfficer: row.filed_by || "Unknown",
          assignedOfficer: row.assigned_officer || null,
          description: row.description || "No description provided",
          evidenceCount: blockchainCase?.evidenceCount || 0,
          tags,
          firId: row.fir_id || null,
          seal: blockchainCase?.seal || false,
          open: blockchainCase?.open ?? true,
        };

        setCaseData(caseDataObj);

        // Fetch evidence from Supabase
        const { data: evidenceData, error: evidenceError } = await supabase
          .from("evidence1")
          .select("*")
          .eq("container_id", caseId);

        if (evidenceError) {
          console.error("Error fetching evidence:", evidenceError);
        } else if (evidenceData) {
          const evidenceRows = evidenceData as SupabaseEvidenceRow[];

          // For each evidence, try to get blockchain verification status
          const evidenceItemsWithStatus: EvidenceItem[] = await Promise.all(
            evidenceRows.map(async (ev) => {
              let confirmed = false;
              try {
                // Try to get evidence from blockchain to check confirmed status
                const blockchainEvidence = await web3Service.getEvidence(
                  caseId,
                  0
                );
                if (
                  blockchainEvidence &&
                  blockchainEvidence.evidenceId === ev.evidence_id
                ) {
                  confirmed = blockchainEvidence.confirmed;
                }
              } catch {
                // Evidence may not be on blockchain yet
              }

              return {
                id: ev.evidence_id,
                name: ev.original_filename || ev.evidence_id,
                type: ev.type || "document",
                status: confirmed ? "verified" : "pending",
                hash: ev.hash_original,
                cid: ev.cid,
                submittedAt: ev.created_at,
                description: ev.description,
              };
            })
          );

          setEvidenceItems(evidenceItemsWithStatus);
        }

        // Build timeline from available data
        const timelineEvents: TimelineEvent[] = [];

        // Case creation event
        if (row.filed_date) {
          timelineEvents.push({
            date: new Date(row.filed_date).toLocaleDateString(),
            event: "Case Created",
            actor: row.filed_by ? shortenAddress(row.filed_by) : "System",
          });
        }

        // If promoted from FIR, add that event
        if (row.fir_id) {
          timelineEvents.push({
            date: new Date(row.filed_date || Date.now()).toLocaleDateString(),
            event: `Promoted from FIR: ${row.fir_id}`,
            actor: "Court",
          });
        }

        // Officer assignment event
        if (row.assigned_officer) {
          timelineEvents.push({
            date: new Date().toLocaleDateString(),
            event: "Officer Assigned",
            actor: shortenAddress(row.assigned_officer),
          });
        }

        // Add evidence submission events
        if (evidenceData && evidenceData.length > 0) {
          evidenceData.forEach((ev: SupabaseEvidenceRow) => {
            if (ev.created_at) {
              timelineEvents.push({
                date: new Date(ev.created_at).toLocaleDateString(),
                event: `Evidence Submitted: ${
                  ev.original_filename || ev.evidence_id
                }`,
                actor: "Forensic System",
              });
            }
          });
        }

        // Sort timeline by date (most recent first for display, but we'll reverse for chronological order)
        timelineEvents.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setTimeline(timelineEvents);
      } catch (err) {
        console.error("Error fetching case details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load case details"
        );
        toast({
          title: "Error",
          description: "Failed to load case details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [caseId, toast]);

  // Determine badge color based on status
  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "open":
        return "bg-forensic-accent text-white";
      case "closed":
        return "bg-forensic-400 text-white";
      case "pending":
        return "bg-forensic-warning text-forensic-900";
      case "sealed":
        return "bg-red-500 text-white";
      default:
        return "bg-forensic-600 text-white";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-forensic-accent" />
        <span className="ml-2 text-forensic-600">Loading case details...</span>
      </div>
    );
  }

  // Error state
  if (error || !caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-forensic-800 mb-2">
          Case Not Found
        </h2>
        <p className="text-forensic-500 mb-4">
          {error || "Unable to load case details"}
        </p>
        <Button asChild variant="outline">
          <Link to="/cases">Back to Cases</Link>
        </Button>
      </div>
    );
  }

  // Get display status
  const getDisplayStatus = () => {
    if (caseData.seal) return "sealed";
    if (!caseData.open) return "closed";
    return caseData.status;
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
            <Badge className={getBadgeColor(getDisplayStatus())}>
              {getDisplayStatus().charAt(0).toUpperCase() +
                getDisplayStatus().slice(1)}
            </Badge>
            {caseData.seal && (
              <Badge className="bg-red-600 text-white">Sealed</Badge>
            )}
          </div>
          <p className="text-forensic-500">Case ID: {caseData.id}</p>
          {caseData.firId && (
            <p className="text-forensic-400 text-sm">
              Originated from FIR: {caseData.firId}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-forensic-evidence"
            asChild
          >
            <Link to={`/evidence?case=${caseData.id}`}>
              <FileDigit className="h-4 w-4 mr-2" />
              View Evidence ({evidenceItems.length})
            </Link>
          </Button>
          {/* <Button variant="outline" size="sm" className="text-forensic-court">
            <Scale className="h-4 w-4 mr-2" />
            Legal Documents
          </Button> */}
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
            <span>Evidence ({evidenceItems.length})</span>
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
                    <p>{new Date(caseData.dateCreated).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-forensic-500">Evidence Count</p>
                  <div className="flex items-center mt-1">
                    <FileDigit className="h-4 w-4 text-forensic-600 mr-2" />
                    <p>{evidenceItems.length} items</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-forensic-500">Filed By</p>
                  <div className="flex items-center mt-1">
                    <Shield className="h-4 w-4 text-forensic-600 mr-2" />
                    <p className="font-mono text-sm">
                      {caseData.filingOfficer.startsWith("0x")
                        ? shortenAddress(caseData.filingOfficer)
                        : caseData.filingOfficer}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-forensic-500">Assigned Officer</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 text-forensic-600 mr-2" />
                    <p className="font-mono text-sm">
                      {caseData.assignedOfficer
                        ? shortenAddress(caseData.assignedOfficer)
                        : "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-forensic-500">Description</p>
                <p className="mt-1 p-2 bg-forensic-50 rounded-md">
                  {caseData.description}
                </p>
              </div>
              {caseData.tags.length > 0 && (
                <div>
                  <p className="text-sm text-forensic-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {caseData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Status</CardTitle>
                <CardDescription>Current state of the case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Case Open</span>
                    <Badge
                      className={caseData.open ? "bg-green-500" : "bg-gray-400"}
                    >
                      {caseData.open ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Case Sealed</span>
                    <Badge
                      className={caseData.seal ? "bg-red-500" : "bg-gray-400"}
                    >
                      {caseData.seal ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {caseData.firId && (
                    <div className="flex items-center justify-between">
                      <span>Source FIR</span>
                      <Badge variant="outline">{caseData.firId}</Badge>
                    </div>
                  )}
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
                  {evidenceItems.length === 0 ? (
                    <p className="text-forensic-500 text-center py-4">
                      No evidence submitted yet
                    </p>
                  ) : (
                    evidenceItems.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <FileDigit className="h-4 w-4 text-forensic-accent mr-2" />
                          <span className="truncate max-w-[150px]">
                            {item.name}
                          </span>
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
                    ))
                  )}
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
              {evidenceItems.length === 0 ? (
                <div className="text-center py-8">
                  <FileDigit className="h-12 w-12 text-forensic-300 mx-auto mb-4" />
                  <p className="text-forensic-500">
                    No evidence has been submitted for this case yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evidenceItems.map((item, index) => (
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
                          {item.submittedAt && (
                            <span>
                              {" "}
                              | Submitted:{" "}
                              {new Date(item.submittedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div className="text-sm text-forensic-400 mt-1">
                            {item.description}
                          </div>
                        )}
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
                        <Button
                          size="sm"
                          className="bg-forensic-accent"
                          asChild
                        >
                          <Link to={`/evidence?case=${caseData.id}`}>
                            <span>View</span>
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {/* <CardFooter>
              <div className="w-full flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/upload?case=${caseData.id}`}>Add Evidence</Link>
                </Button>
                <Button variant="outline">Export List</Button>
              </div>
            </CardFooter> */}
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
              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-forensic-300 mx-auto mb-4" />
                  <p className="text-forensic-500">No activity recorded yet.</p>
                </div>
              ) : (
                <div className="relative pl-6 border-l border-forensic-200">
                  {timeline.map((event, index) => (
                    <div key={index} className="mb-6 relative">
                      <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border-2 border-forensic-accent bg-white"></div>
                      <div>
                        <p className="text-sm text-forensic-500">
                          {event.date}
                        </p>
                        <p className="font-medium mt-0.5">{event.event}</p>
                        <p className="text-sm text-forensic-600 mt-0.5">
                          By: {event.actor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseDetail;
