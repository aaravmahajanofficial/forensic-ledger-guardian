import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Calendar,
  MapPin,
  Check,
  User,
  FileQuestion,
  AlertCircle,
  ArrowRight,
  Send,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FIRManagementProps {
  mode?: "view" | "create" | "edit";
}

interface FormErrors {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  incidentType?: string;
  description?: string;
  complainantName?: string;
  contactNumber?: string;
}

const FIRManagement: React.FC<FIRManagementProps> = ({ mode = "create" }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formCompleted, setFormCompleted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [complainantName, setComplainantName] = useState("");
  const [organization, setOrganization] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [suspectName, setSuspectName] = useState("");
  const [suspectType, setSuspectType] = useState("");
  const [suspectInfo, setSuspectInfo] = useState("");
  const [witnessName, setWitnessName] = useState("");
  const [witnessContact, setWitnessContact] = useState("");
  const [witnessStatement, setWitnessStatement] = useState("");

  const titles = {
    view: "FIR Management",
    create: "Create New FIR",
    edit: "Edit FIR",
  };

  const descriptions = {
    view: "View and manage your First Information Reports.",
    create:
      "File a new First Information Report with suspect and witness information.",
    edit: "Update an existing First Information Report.",
  };

  const validateStepOne = () => {
    const newErrors: FormErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!incidentType) newErrors.incidentType = "Incident type is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors: FormErrors = {};

    if (!complainantName.trim())
      newErrors.complainantName = "Complainant name is required";
    if (!contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      const isValid = validateStepOne();
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = validateStepTwo();
      if (isValid) setStep(3);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleCompleteForm = () => {
    // Generate FIR ID (in real implementation this would be done on the backend)
    const firId = "FF-2024-120";

    // In real implementation, this would validate and submit the form to the blockchain
    setFormCompleted(true);
    setStep(4); // Show success step
    toast({
      title: "FIR Created Successfully",
      description: `Your FIR with ID ${firId} has been created.`,
      variant: "success",
    });
  };

  const renderStepIndicator = () => {
    const steps = ["Incident Details", "Parties Involved", "Review & Submit"];
    return (
      <div className="flex items-center justify-between mb-8 p-4 bg-card rounded-lg border">
        {steps.map((name, index) => {
          const stepNumber = index + 1;
          const isCompleted = step > stepNumber;
          const isCurrent = step === stepNumber;

          return (
            <React.Fragment key={name}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300",
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-6 w-6" /> : stepNumber}
                </div>
                <p
                  className={cn(
                    "text-sm mt-2 font-medium",
                    isCompleted || isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {name}
                </p>
              </div>
              {stepNumber < steps.length && (
                <div className="flex-1 h-1 mx-4 bg-border" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {titles[mode]}
          </h1>
          <p className="text-muted-foreground">{descriptions[mode]}</p>
        </div>
        {mode === "create" && (
          <Badge variant="outline" className="text-base px-4 py-2">
            <FileText className="h-4 w-4 mr-2" />
            New FIR
          </Badge>
        )}
      </div>

      {mode === "create" && (
        <>
          {renderStepIndicator()}

          {/* Step 1: Incident Details */}
          {step === 1 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Step 1: Incident Details</CardTitle>
                <CardDescription>
                  Record the basic details about the incident.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="font-medium">Incident Title</label>
                  <Input
                    placeholder="e.g., Unauthorized Access to Financial Server"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={cn(errors.title && "border-destructive")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center mt-1">
                      <XCircle className="h-4 w-4 mr-1" /> {errors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      Date of Incident
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={cn(errors.date && "border-destructive")}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <XCircle className="h-4 w-4 mr-1" /> {errors.date}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium">Time of Incident</label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={cn(errors.time && "border-destructive")}
                    />
                    {errors.time && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <XCircle className="h-4 w-4 mr-1" /> {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    Location of Incident
                  </label>
                  <Input
                    placeholder="e.g., Server Room 4B, Main Office"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={cn(errors.location && "border-destructive")}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive flex items-center mt-1">
                      <XCircle className="h-4 w-4 mr-1" /> {errors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Type of Incident</label>
                  <Select
                    value={incidentType}
                    onValueChange={(value) => setIncidentType(value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        errors.incidentType && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data_breach">Data Breach</SelectItem>
                      <SelectItem value="unauthorized_access">
                        Unauthorized System Access
                      </SelectItem>
                      <SelectItem value="information_theft">
                        Information Theft
                      </SelectItem>
                      <SelectItem value="malware_attack">
                        Malware Attack
                      </SelectItem>
                      <SelectItem value="phishing">
                        Phishing Incident
                      </SelectItem>
                      <SelectItem value="identity_theft">
                        Identity Theft
                      </SelectItem>
                      <SelectItem value="data_loss">Data Loss</SelectItem>
                      <SelectItem value="physical">
                        Physical Device Theft
                      </SelectItem>
                      <SelectItem value="other">Other Cyber Crime</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.incidentType && (
                    <p className="text-sm text-destructive flex items-center mt-1">
                      <XCircle className="h-4 w-4 mr-1" />{" "}
                      {errors.incidentType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Incident Description</label>
                  <Textarea
                    placeholder="Provide a detailed description of the incident including how it was discovered..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={cn(errors.description && "border-destructive")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center mt-1">
                      <XCircle className="h-4 w-4 mr-1" />{" "}
                      {errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextStep}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Parties Involved */}
          {step === 2 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Step 2: Parties Involved</CardTitle>
                <CardDescription>
                  Enter information about complainant, suspects, and witnesses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6 p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center text-foreground">
                    <User className="h-5 w-5 mr-2" />
                    Complainant Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-medium">Complainant Name</label>
                      <Input
                        placeholder="Full name of complainant"
                        value={complainantName}
                        onChange={(e) => setComplainantName(e.target.value)}
                        className={cn(
                          errors.complainantName && "border-destructive"
                        )}
                      />
                      {errors.complainantName && (
                        <p className="text-sm text-destructive flex items-center mt-1">
                          <XCircle className="h-4 w-4 mr-1" />
                          {errors.complainantName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Organization</label>
                      <Input
                        placeholder="If representing an organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-medium">Contact Number</label>
                      <Input
                        placeholder="Phone number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className={cn(
                          errors.contactNumber && "border-destructive"
                        )}
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-destructive flex items-center mt-1">
                          <XCircle className="h-4 w-4 mr-1" />
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center text-foreground">
                    <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                    Suspect Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-medium">
                        Suspect Name/Identifier
                      </label>
                      <Input
                        placeholder="Name or ID (if known)"
                        value={suspectName}
                        onChange={(e) => setSuspectName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Suspect Type</label>
                      <Select
                        value={suspectType}
                        onValueChange={(value) => setSuspectType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">
                            Internal Actor
                          </SelectItem>
                          <SelectItem value="external">
                            External Actor
                          </SelectItem>
                          <SelectItem value="former_employee">
                            Former Employee
                          </SelectItem>
                          <SelectItem value="group">Organized Group</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">
                      Additional Information
                    </label>
                    <Textarea
                      placeholder="IP addresses, identifying characteristics, etc."
                      rows={3}
                      value={suspectInfo}
                      onChange={(e) => setSuspectInfo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6 p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center text-foreground">
                    <FileQuestion className="h-5 w-5 mr-2 text-accent-foreground" />
                    Witness Information (Optional)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-medium">Witness Name</label>
                      <Input
                        placeholder="Full name of witness"
                        value={witnessName}
                        onChange={(e) => setWitnessName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">
                        Contact Information
                      </label>
                      <Input
                        placeholder="Phone or email"
                        value={witnessContact}
                        onChange={(e) => setWitnessContact(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Witness Statement</label>
                    <Textarea
                      placeholder="Brief statement from witness"
                      rows={3}
                      value={witnessStatement}
                      onChange={(e) => setWitnessStatement(e.target.value)}
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    + Add Another Witness
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Previous Step
                </Button>
                <Button onClick={handleNextStep}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Step 3: Review & Submit</CardTitle>
                <CardDescription>
                  Review the information carefully before submitting the FIR.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Incident Details
                  </h3>
                  <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Title</p>
                        <p className="font-semibold text-foreground">
                          {title || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Date & Time
                        </p>
                        <p className="font-semibold text-foreground">
                          {date && time
                            ? `${new Date(
                                date
                              ).toLocaleDateString()}, ${time}`
                            : "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        <p className="font-semibold text-foreground">
                          {location || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-semibold text-foreground">
                          {incidentType.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Description
                      </p>
                      <p className="text-foreground whitespace-pre-wrap">
                        {description || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Complainant
                  </h3>
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold text-foreground">
                          {complainantName || "Not provided"}
                        </p>
                        {organization && (
                          <p className="text-sm text-muted-foreground">
                            ({organization})
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-semibold text-foreground">
                          {contactNumber || "Not provided"}
                        </p>
                        {email && (
                          <p className="text-sm text-muted-foreground">
                            {email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Suspect Information
                  </h3>
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Suspect</p>
                        <p className="font-semibold text-foreground">
                          {suspectName || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-semibold text-foreground">
                          {suspectType.replace(/_/g, " ") || "Not selected"}
                        </p>
                      </div>
                    </div>

                    {suspectInfo && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Additional Information
                        </p>
                        <p className="text-foreground whitespace-pre-wrap">
                          {suspectInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {witnessName && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Witness Information
                    </h3>
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-semibold text-foreground">
                            {witnessName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Contact
                          </p>
                          <p className="font-semibold text-foreground">
                            {witnessContact || "Not provided"}
                          </p>
                        </div>
                      </div>

                      {witnessStatement && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            Statement
                          </p>
                          <p className="text-foreground whitespace-pre-wrap">
                            {witnessStatement}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 border-l-4 border-primary bg-muted/30 rounded-r-lg">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-3 text-primary" />
                    <h4 className="font-semibold text-foreground">
                      Officer Declaration
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 pl-8">
                    I declare that the information provided in this First
                    Information Report is true and accurate to the best of my
                    knowledge.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Previous Step
                </Button>
                <Button onClick={handleCompleteForm}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit FIR
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4: Success */}
          {step === 4 && formCompleted && (
            <Card className="animate-fade-in">
              <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-6 ring-4 ring-success/20">
                  <ShieldCheck className="h-12 w-12 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  FIR Successfully Filed!
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  The FIR has been securely submitted to the ledger and
                  assigned the ID <strong>FF-2024-120</strong>.
                </p>
                <Card className="w-full max-w-lg bg-muted/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">FIR Number:</span>
                      <span className="font-mono text-foreground bg-background px-2 py-1 rounded">
                        FF-2024-120
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Filed By:</span>
                      <span className="font-medium text-foreground">
                        {user?.name || "Officer Johnson"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium text-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="warning">Pending Review</Badge>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-4 mt-8">
                  <Button variant="outline">View FIR Details</Button>
                  <Button variant="secondary">
                    Upload Evidence
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* For view and edit modes, we'd implement different UIs here */}
      {mode !== "create" && (
        <Card>
          <CardContent className="text-center py-24">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {mode === "view" ? "FIR Management" : "Edit FIR Form"}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {mode === "view"
                ? "The interface to view and manage all filed FIRs and their current status will be available here."
                : "The interface for editing an existing FIR with updated information will be available here."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FIRManagement;
