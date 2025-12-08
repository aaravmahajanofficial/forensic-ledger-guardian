import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import web3Service, { Role } from "@/services/web3Service";
import {
  Save,
  FileText,
  User,
  ShieldAlert,
  ChevronRight,
  FileCheck,
  UserPlus,
  Plus,
} from "lucide-react";
import { error } from "console";
import RoleManager from "@/components/admin/debug/RoleManager";
import { useWeb3 } from "@/hooks/useWeb3";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  roleManagementService,
  RoleAssignment,
} from "@/services/roleManagementService";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const CreateCase = () => {
  const { userRole: web3Role, account } = useWeb3();
  const { user } = useAuth();

  // Use auth role (from Supabase login) if available, otherwise fall back to web3 role
  const userRole = user?.role ?? web3Role;

  // State for form fields
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [caseTitle, setCaseTitle] = useState(
    "Default Case Title - Cyberbullying Incident"
  );
  const [caseType, setCaseType] = useState("criminal");
  const [priority, setPriority] = useState("high");
  const [jurisdiction, setJurisdiction] = useState("district");
  const [description, setDescription] = useState(
    "This is a default description for a cyberbullying case. The suspect is accused of sending harassing messages."
  );

  // FIR IDs from Supabase
  const [firIds, setFirIds] = useState<string[]>([]);
  const [selectedFirId, setSelectedFirId] = useState<string>("");

  // Case creation state
  const [createdCaseId, setCreatedCaseId] = useState<string>("");
  const [isCaseCreated, setIsCaseCreated] = useState(false);

  // Officer assignment state
  const [officers, setOfficers] = useState<RoleAssignment[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  useEffect(() => {
    async function loadFirIds() {
      try {
        const { fetchFirIds } = await import("@/services/firService");
        const ids = await fetchFirIds();
        setFirIds(ids);
      } catch (err) {
        console.error("Failed to fetch FIR IDs", err);
      }
    }
    loadFirIds();
  }, []);

  // Load officers on component mount
  useEffect(() => {
    async function loadOfficers() {
      try {
        const officersList =
          await roleManagementService.getRoleAssignmentsByRole(Role.Officer);
        setOfficers(officersList);
        console.log("Loaded officers:", officersList);
      } catch (err) {
        console.error("Failed to fetch officers", err);
      }
    }
    loadOfficers();
  }, []);

  // Complainant information
  const [complainantName, setComplainantName] = useState("Jane Doe");
  const [complainantContact, setComplainantContact] = useState("555-1234");
  const [complainantAddress, setComplainantAddress] = useState(
    "123 Main St, Anytown, USA"
  );

  // Suspect information
  const [suspectName, setSuspectName] = useState("John Smith");
  const [suspectContact, setSuspectContact] = useState("555-5678");
  const [suspectAddress, setSuspectAddress] = useState(
    "456 Oak Ave, Anytown, USA"
  );
  const [suspectDescription, setSuspectDescription] = useState(
    'The suspect is known to use the online alias "TrollMaster99".'
  );

  // Assignments
  const [leadOfficer, setLeadOfficer] = useState("john.smith");
  const [assistingOfficers, setAssistingOfficers] =
    useState<string>("officer2");
  const [leadForensic, setLeadForensic] = useState("emily.chen");
  const [assistingForensics, setAssistingForensics] =
    useState<string>("forensic1");
  const [forensicSpecialities, setForensicSpecialities] =
    useState<string>("digital");
  const [prosecutor, setProsecutor] = useState("sarah.lee");
  const [defenseAttorney, setDefenseAttorney] = useState<string>("lawyer2");
  const [judge, setJudge] = useState("michael.wong");

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleReset = () => {
    setCaseTitle("");
    setDescription("");
    setPriority("medium");
    setCaseType("criminal");
    setJurisdiction("district");
    setComplainantName("");
    setComplainantContact("");
    setComplainantAddress("");
    setSuspectName("");
    setSuspectContact("");
    setSuspectAddress("");
    setSuspectDescription("");
    setLeadOfficer("john.smith");
    setAssistingOfficers("");
    setLeadForensic("emily.chen");
    setAssistingForensics("");
    setForensicSpecialities("");
    setProsecutor("sarah.lee");
    setDefenseAttorney("");
    setJudge("michael.wong");
    setCreatedCaseId("");
    setIsCaseCreated(false);
    setSelectedOfficer("");

    toast({
      title: "Form Reset",
      description: "All form fields have been cleared.",
    });
  };

  const handleNextTab = (current: string) => {
    switch (current) {
      case "basic":
        setActiveTab("parties");
        break;

      default:
        break;
    }
  };

  const handlePreviousTab = (current: string) => {
    switch (current) {
      case "parties":
        setActiveTab("basic");
        break;
      default:
        break;
    }
  };

  // Handle officer assignment
  const handleAssignOfficer = async () => {
    if (!selectedOfficer) {
      toast({
        title: "No Officer Selected",
        description: "Please select an officer to assign to this case.",
        variant: "destructive",
      });
      return;
    }

    if (!createdCaseId) {
      toast({
        title: "No Case ID",
        description: "Please create a case first before assigning officers.",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);

    try {
      console.log(
        `Assigning officer ${selectedOfficer} to case ${createdCaseId}`
      );

      const success = await web3Service.assignCaseRole(
        createdCaseId,
        selectedOfficer,
        Role.Officer
      );

      if (success) {
        toast({
          title: "Officer Assigned",
          description: `Officer ${selectedOfficer} has been assigned to case ${createdCaseId}`,
        });
        setSelectedOfficer("");
      } else {
        throw new Error("Assignment transaction failed");
      }
    } catch (error) {
      console.error("Officer assignment error:", error);
      toast({
        title: "Assignment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign officer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSubmit = async () => {
    // Role validation first
    if (userRole !== Role.Court && userRole !== Role.Officer) {
      toast({
        title: "Insufficient Permissions",
        description:
          "You need Court or Officer role to create cases. Use the 'Manage Role' button to set the appropriate role.",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!caseTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide a case title before creating the case.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Initiating case creation...");

    const generateCaseId = () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const random = Math.floor(Math.random() * 900 + 100);
      return `CASE-${y}-${m}${d}-${random}`;
    };

    const caseId = generateCaseId();

    try {
      // Pre-checks before case creation
      console.log("Pre-flight checks...");

      // Test contract connection
      const contractConnected = await web3Service.testContractConnection();
      if (!contractConnected) {
        const networkInfo = await web3Service.getNetworkInfo();
        const contractAddress = web3Service.getContractAddress();

        console.log("Diagnostic Information:");
        console.log("Network:", networkInfo);
        console.log("Contract Address:", contractAddress);

        toast({
          title: "Connection Error",
          description:
            "Could not connect to the blockchain contract. Check console for details.",
          variant: "destructive",
        });
        return;
      }

      // Check user role
      const userRole = await web3Service.getUserRole();
      console.log("User role:", web3Service.getRoleString(userRole));

      if (userRole !== Role.Officer && userRole !== Role.Court) {
        if (userRole === Role.None) {
          toast({
            title: "Unauthorized Access",
            description:
              "You don't have permission to create cases. Please contact an administrator to get proper role assignment.",
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Insufficient Permissions",
            description:
              "Only Officers can create cases. Your current role: " +
              web3Service.getRoleString(userRole),
            variant: "destructive",
          });
          return;
        }
      }

      // Use selected FIR ID from dropdown
      const firIdToUse = selectedFirId;

      // Check if FIR exists
      const fir = await web3Service.getFIR(firIdToUse);
      console.log("FIR check result:", fir);

      if (fir.promotedToCase) {
        toast({
          title: "FIR Already Used",
          description: "This FIR has already been promoted to a case.",
          variant: "destructive",
        });
        return;
      }

      console.log("Step 1: Creating case with the following details:");
      console.log({
        caseId,
        firId: firIdToUse,
        caseTitle,
        description,
        tags: [caseType, priority, jurisdiction],
      });

      try {
        const response = await fetch(
          `${BACKEND_URL}/fir/${firIdToUse}/promote`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              caseId,
              title: caseTitle,
              type: caseType,
              description,
              tags: [caseType, priority, jurisdiction],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create case");
        }

        // Mark case as created and store the case ID
        setCreatedCaseId(data.caseId || caseId);
        setIsCaseCreated(true);
        setShowAssignDialog(true);

        toast({
          title: "Case Created Successfully",
          description: `Your case with ID ${
            data.caseId || caseId
          } has been filed on the blockchain. You can now assign officers.`,
        });
      } catch (error) {
        console.error("Case submission error:", error);
        toast({
          title: "Case Submission Failed",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Case creation error:", error);

      let errorTitle = "Case Creation Failed";
      let errorDescription =
        "There was a problem creating the case. Check the console for more details.";

      const err = error as { reason?: string; data?: string };
      if (err.reason) {
        console.error("Revert reason:", err.reason);

        if (err.reason.includes("Only Court can perform this action")) {
          errorTitle = "Permission Denied";
          errorDescription =
            "This operation requires Court role. Use the 'Manage Role' button to set yourself as Court role for testing.";
        } else if (err.reason.includes("Unauthorized role")) {
          errorTitle = "Unauthorized Role";
          errorDescription =
            "You don't have the required role to perform this action. Use the 'Manage Role' button to set the appropriate role.";
        } else if (err.reason.includes("Case already exists")) {
          errorTitle = "Case Already Exists";
          errorDescription =
            "A case with this ID already exists. Please try with a different case ID.";
        } else if (err.reason.includes("FIR not found")) {
          errorTitle = "FIR Not Found";
          errorDescription =
            "The specified FIR was not found. Please check the FIR ID.";
        } else {
          errorDescription = `Error: ${err.reason}`;
        }
      }

      if (err.data) {
        console.error("Error data:", err.data);
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("Case creation process finished.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">Create Case</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-forensic-court" />
            Create New Case from FIR
          </CardTitle>
          <CardDescription>
            Promote a First Information Report to a full case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger
                value="basic"
                className="flex items-center gap-2"
                disabled={isCaseCreated}
              >
                <FileText className="h-4 w-4" />
                <span>Basic Details</span>
              </TabsTrigger>
              <TabsTrigger
                value="parties"
                className="flex items-center gap-2"
                disabled={isCaseCreated}
              >
                <User className="h-4 w-4" />
                <span>Involved Parties</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firId">Select FIR</Label>
                    <Select
                      value={selectedFirId}
                      onValueChange={setSelectedFirId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select FIR ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {firIds.length === 0
                          ? null
                          : firIds
                              .filter((fir_id) => fir_id && fir_id !== "")
                              .map((fir_id) => (
                                <SelectItem key={fir_id} value={fir_id}>
                                  {fir_id}
                                </SelectItem>
                              ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseType">Case Type</Label>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="criminal">Criminal</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="juvenile">Juvenile</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jurisdiction">Jurisdiction</Label>
                    <Select
                      value={jurisdiction}
                      onValueChange={setJurisdiction}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="district">District Court</SelectItem>
                        <SelectItem value="highCourt">High Court</SelectItem>
                        <SelectItem value="special">Special Court</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseTitle">Case Title</Label>
                  <Input
                    id="caseTitle"
                    placeholder="Enter case title"
                    value={caseTitle}
                    onChange={(e) => setCaseTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseDescription">Case Description</Label>
                  <Textarea
                    id="caseDescription"
                    placeholder="Enter detailed case description"
                    className="min-h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button
                    className="bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-2"
                    onClick={() => handleNextTab("basic")}
                    disabled={isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                    Next: Involved Parties
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="parties" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <ShieldAlert className="h-4 w-4 mr-2 text-forensic-court" />
                      Complainant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complainantName">Name</Label>
                        <Input
                          id="complainantName"
                          placeholder="Full name"
                          value={complainantName}
                          onChange={(e) => setComplainantName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complainantContact">Contact</Label>
                        <Input
                          id="complainantContact"
                          placeholder="Phone number"
                          value={complainantContact}
                          onChange={(e) =>
                            setComplainantContact(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complainantAddress">Address</Label>
                      <Textarea
                        id="complainantAddress"
                        placeholder="Full address"
                        value={complainantAddress}
                        onChange={(e) => setComplainantAddress(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <ShieldAlert className="h-4 w-4 mr-2 text-forensic-warning" />
                      Suspect Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="suspectName">Name</Label>
                        <Input
                          id="suspectName"
                          placeholder="Full name"
                          value={suspectName}
                          onChange={(e) => setSuspectName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="suspectContact">
                          Contact (if known)
                        </Label>
                        <Input
                          id="suspectContact"
                          placeholder="Phone number"
                          value={suspectContact}
                          onChange={(e) => setSuspectContact(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suspectAddress">Address (if known)</Label>
                      <Textarea
                        id="suspectAddress"
                        placeholder="Full address"
                        value={suspectAddress}
                        onChange={(e) => setSuspectAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suspectDescription">Description</Label>
                      <Textarea
                        id="suspectDescription"
                        placeholder="Physical description and identifying features"
                        value={suspectDescription}
                        onChange={(e) => setSuspectDescription(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handlePreviousTab("parties")}
                    disabled={isCaseCreated}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back: Basic Details
                  </Button>
                  <Button
                    className="bg-forensic-court hover:bg-forensic-court/90 flex items-center gap-2"
                    onClick={handleSubmit}
                    disabled={
                      isLoading ||
                      isCaseCreated ||
                      (userRole !== Role.Court && userRole !== Role.Officer)
                    }
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Create Case
                  </Button>
                </div>

                {/* Role Information */}
                {userRole !== Role.Court &&
                  userRole !== Role.Officer &&
                  !isCaseCreated && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-yellow-600" />
                        <p className="text-sm text-yellow-800">
                          <strong>Role Required:</strong> You need Court or
                          Officer role to create cases. Current role:{" "}
                          {userRole === Role.None
                            ? "None"
                            : userRole === Role.Forensic
                            ? "Forensic"
                            : userRole === Role.Lawyer
                            ? "Lawyer"
                            : "Unknown"}
                        </p>
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">
                        Click "Manage Role" to set the appropriate role for
                        testing.
                      </p>
                    </div>
                  )}

                {/* Success State */}
                {isCaseCreated && (
                  <div className="mt-4 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <FileCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Case Created Successfully!
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                      Case ID:{" "}
                      <span className="font-mono font-semibold">
                        {createdCaseId}
                      </span>
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAssignDialog(true)}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Assign Officer
                      </Button>
                      <Button
                        onClick={handleReset}
                        className="bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create New Case
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Role Manager Modal */}
      {showRoleManager && (
        <RoleManager onClose={() => setShowRoleManager(false)} />
      )}

      {/* Officer Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-forensic-officer" />
              Assign Officer to Case
            </DialogTitle>
            <DialogDescription>
              Case ID:{" "}
              <span className="font-mono font-semibold">{createdCaseId}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="officerSelectDialog">Select Officer</Label>
              <Select
                value={selectedOfficer}
                onValueChange={setSelectedOfficer}
                disabled={isAssigning}
              >
                <SelectTrigger id="officerSelectDialog">
                  <SelectValue placeholder="Choose an officer to assign" />
                </SelectTrigger>
                <SelectContent>
                  {officers.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      No officers available
                    </div>
                  ) : (
                    officers.map((officer) => (
                      <SelectItem key={officer.id} value={officer.address}>
                        <span className="font-mono text-sm">
                          {officer.address}
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {officers.length} officer{officers.length !== 1 ? "s" : ""}{" "}
                available for assignment
              </p>
            </div>

            <div className="flex flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setShowAssignDialog(false)}
                className="w-1/2"
              >
                Skip
              </Button>
              <Button
                onClick={handleAssignOfficer}
                disabled={isAssigning || !selectedOfficer}
                className="bg-forensic-court text-white w-1/2 hover:bg-forensic-officer/90"
              >
                {isAssigning ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Assign
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCase;
