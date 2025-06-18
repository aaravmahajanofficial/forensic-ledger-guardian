import React, { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Save,
  FileText,
  User,
  UserCog,
  ShieldAlert,
  ChevronRight,
  FileCheck,
} from "lucide-react";

const CreateCase = () => {
  // State for form fields
  const [activeTab, setActiveTab] = useState("basic");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseType, setCaseType] = useState("criminal");
  const [priority, setPriority] = useState("medium");
  const [jurisdiction, setJurisdiction] = useState("district");
  const [description, setDescription] = useState("");

  // Complainant information
  const [complainantName, setComplainantName] = useState("");
  const [complainantContact, setComplainantContact] = useState("");
  const [complainantAddress, setComplainantAddress] = useState("");

  // Suspect information
  const [suspectName, setSuspectName] = useState("");
  const [suspectContact, setSuspectContact] = useState("");
  const [suspectAddress, setSuspectAddress] = useState("");
  const [suspectDescription, setSuspectDescription] = useState("");

  // Assignments
  const [leadOfficer, setLeadOfficer] = useState("john.smith");
  const [assistingOfficers, setAssistingOfficers] = useState<string>("");
  const [leadForensic, setLeadForensic] = useState("emily.chen");
  const [assistingForensics, setAssistingForensics] = useState<string>("");
  const [forensicSpecialities, setForensicSpecialities] = useState<string>("");
  const [prosecutor, setProsecutor] = useState("sarah.lee");
  const [defenseAttorney, setDefenseAttorney] = useState<string>("");
  const [judge, setJudge] = useState("michael.wong");

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleReset = () => {
    setCaseTitle("");
    setDescription("");
    setPriority("medium");
    setCaseType("criminal");
    setJurisdiction("district");

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
      case "parties":
        setActiveTab("assignments");
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
      case "assignments":
        setActiveTab("parties");
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!caseTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide a case title before creating the case.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Case Created",
      description: `Case "${caseTitle}" has been successfully created.`,
    });

    navigate("/cases");
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
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Basic Details</span>
              </TabsTrigger>
              <TabsTrigger value="parties" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Involved Parties</span>
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="flex items-center gap-2"
              >
                <UserCog className="h-4 w-4" />
                <span>Role Assignments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border border-forensic-200 rounded-md bg-forensic-50 flex items-start gap-3">
                  <FileText className="h-5 w-5 text-forensic-800 mt-0.5" />
                  <div>
                    <p className="font-medium text-forensic-800">
                      Source FIR: #FF-2023-120
                    </p>
                    <p className="text-sm text-forensic-600">
                      Filed by Officer John Smith on April 9, 2023 at 13:45:22
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caseNumber">Case Number</Label>
                    <Input
                      id="caseNumber"
                      value="FF-2023-120-C"
                      disabled
                      className="bg-forensic-50"
                    />
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
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back: Basic Details
                  </Button>
                  <Button
                    className="bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-2"
                    onClick={() => handleNextTab("parties")}
                  >
                    <ChevronRight className="h-4 w-4" />
                    Next: Role Assignments
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <User className="h-4 w-4 mr-2 text-forensic-800" />
                        Assigned Officers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="leadOfficer">Lead Officer</Label>
                        <Select
                          value={leadOfficer}
                          onValueChange={setLeadOfficer}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select officer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john.smith">
                              John Smith
                            </SelectItem>
                            <SelectItem value="robert.johnson">
                              Robert Johnson
                            </SelectItem>
                            <SelectItem value="officer3">
                              James Wilson
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assistingOfficers">
                          Assisting Officers
                        </Label>
                        <Select
                          value={assistingOfficers}
                          onValueChange={setAssistingOfficers}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select officers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="officer1">
                              James Wilson
                            </SelectItem>
                            <SelectItem value="officer2">
                              Maria Garcia
                            </SelectItem>
                            <SelectItem value="officer3">David Lee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <FileCheck className="h-4 w-4 mr-2 text-forensic-accent" />
                        Assigned Forensic Experts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="leadForensic">
                          Lead Forensic Expert
                        </Label>
                        <Select
                          value={leadForensic}
                          onValueChange={setLeadForensic}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select forensic expert" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emily.chen">
                              Emily Chen
                            </SelectItem>
                            <SelectItem value="david.williams">
                              David Williams
                            </SelectItem>
                            <SelectItem value="forensic3">
                              Thomas Brown
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assistingForensics">
                          Assisting Forensic Experts
                        </Label>
                        <Select
                          value={assistingForensics}
                          onValueChange={setAssistingForensics}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select forensic experts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="forensic1">
                              Thomas Brown
                            </SelectItem>
                            <SelectItem value="forensic2">
                              Lisa Anderson
                            </SelectItem>
                            <SelectItem value="forensic3">
                              Mark Wilson
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="forensicSpecialities">
                          Required Specialities
                        </Label>
                        <Select
                          value={forensicSpecialities}
                          onValueChange={setForensicSpecialities}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialities" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="digital">
                              Digital Forensics
                            </SelectItem>
                            <SelectItem value="dna">DNA Analysis</SelectItem>
                            <SelectItem value="chemical">
                              Chemical Analysis
                            </SelectItem>
                            <SelectItem value="ballistic">
                              Ballistic Examination
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <User className="h-4 w-4 mr-2 text-forensic-warning" />
                      Assigned Legal Representatives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prosecutor">Prosecution Lead</Label>
                        <Select
                          value={prosecutor}
                          onValueChange={setProsecutor}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select prosecutor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sarah.lee">Sarah Lee</SelectItem>
                            <SelectItem value="jennifer.miller">
                              Jennifer Miller
                            </SelectItem>
                            <SelectItem value="lawyer3">
                              Daniel Martinez
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="defenseAttorney">
                          Defense Attorney (if known)
                        </Label>
                        <Select
                          value={defenseAttorney}
                          onValueChange={setDefenseAttorney}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select defense attorney" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lawyer1">
                              Daniel Martinez
                            </SelectItem>
                            <SelectItem value="lawyer2">Susan Clark</SelectItem>
                            <SelectItem value="lawyer3">
                              Richard Wright
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <User className="h-4 w-4 mr-2 text-forensic-court" />
                      Judicial Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="judge">Assigned Judge</Label>
                      <Select value={judge} onValueChange={setJudge}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select judge" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="michael.wong">
                            Michael Wong
                          </SelectItem>
                          <SelectItem value="judge2">
                            Eleanor Rodriguez
                          </SelectItem>
                          <SelectItem value="judge3">William Taylor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handlePreviousTab("assignments")}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back: Involved Parties
                  </Button>
                  <Button
                    className="bg-forensic-court hover:bg-forensic-court/90 flex items-center gap-2"
                    onClick={handleSubmit}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Create Case
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCase;
