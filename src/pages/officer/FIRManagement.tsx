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
  Save,
  Calendar,
  MapPin,
  Check,
  User,
  FileQuestion,
  AlertCircle,
  ArrowRight,
  Send,
  XCircle,
  Loader2,
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFirId, setSubmittedFirId] = useState<string | null>(null);
  const [submittedDate, setSubmittedDate] = useState<string | null>(null);

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
  // Witnesses: array of { name, contact, statement }
  const [witnesses, setWitnesses] = useState([
    { name: "", contact: "", statement: "" },
  ]);

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

  const generateFirId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto
      .getRandomValues(new Uint32Array(1))[0]
      .toString(36)
      .toUpperCase()
      .slice(0, 5);
    return `FIR-${date}-${random}`;
  };

  const handleCompleteForm = async () => {
    setIsSubmitting(true);

    // Generate a unique FIR ID
    const firId = generateFirId();

    // Build the full description with all relevant details
    const fullDescription = `
      Title: ${title}
      Incident Type: ${incidentType}
      Date/Time: ${
        date ? new Date(date).toLocaleDateString() : "Not specified"
      } ${time || ""}
      Description: ${description}
      Suspect: ${suspectName || "Unknown"} (${suspectType || "Unknown type"})
      Additional Suspect Info: ${suspectInfo || "None"}
      Witnesses: ${
        witnesses
          .filter((w) => w.name)
          .map((w) => `${w.name} - ${w.statement}`)
          .join("; ") || "None"
      }
    `.trim();

    try {
      const response = await fetch(`${BACKEND_URL}/fir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firId,
          description: fullDescription,
          location,
          // Incident details
          incident: {
            title,
            type: incidentType,
            date: date || null,
            time: time || null,
            location,
            description,
          },
          // Complainant information
          complainant: {
            name: complainantName,
            organization: organization || null,
            contactNumber,
            email: email || null,
          },
          // Suspect information
          suspect: {
            name: suspectName || null,
            type: suspectType || null,
            additionalInfo: suspectInfo || null,
          },
          // Witnesses array
          witnesses: witnesses.filter(
            (w) => w.name || w.contact || w.statement
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to file FIR");
      }

      // Store the returned FIR ID and current date
      setSubmittedFirId(data.firId || firId);
      setSubmittedDate(new Date().toLocaleDateString());
      setFormCompleted(true);
      setStep(4); // Show success step

      toast({
        title: "FIR Created Successfully",
        description: `Your FIR with ID ${
          data.firId || firId
        } has been filed on the blockchain.`,
      });
    } catch (error) {
      console.error("FIR submission error:", error);
      toast({
        title: "FIR Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forensic-800">
            {titles[mode]}
          </h1>
          <p className="text-sm text-forensic-600">{descriptions[mode]}</p>
        </div>
        {mode === "create" && (
          <Badge className="bg-forensic-800 text-white px-3 py-1">
            <FileText className="h-4 w-4 mr-2" />
            New FIR
          </Badge>
        )}
      </div>

      {mode === "create" && (
        <>
          {/* Form Steps Indicator */}
          <div className="flex justify-between mb-6">
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-forensic-800" : "text-forensic-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > 1
                    ? "bg-forensic-success text-white"
                    : step === 1
                    ? "bg-forensic-800 text-white"
                    : "bg-forensic-200 text-forensic-400"
                }`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : 1}
              </div>
              <span className="text-sm mt-2">Incident Details</span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div
                className={`h-1 w-full ${
                  step > 1 ? "bg-forensic-success" : "bg-forensic-200"
                }`}
              ></div>
            </div>

            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-forensic-800" : "text-forensic-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > 2
                    ? "bg-forensic-success text-white"
                    : step === 2
                    ? "bg-forensic-800 text-white"
                    : "bg-forensic-200 text-forensic-400"
                }`}
              >
                {step > 2 ? <Check className="h-5 w-5" /> : 2}
              </div>
              <span className="text-sm mt-2">Parties Involved</span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div
                className={`h-1 w-full ${
                  step > 2 ? "bg-forensic-success" : "bg-forensic-200"
                }`}
              ></div>
            </div>

            <div
              className={`flex flex-col items-center ${
                step >= 3 ? "text-forensic-800" : "text-forensic-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > 3
                    ? "bg-forensic-success text-white"
                    : step === 3
                    ? "bg-forensic-800 text-white"
                    : "bg-forensic-200 text-forensic-400"
                }`}
              >
                {step > 3 ? <Check className="h-5 w-5" /> : 3}
              </div>
              <span className="text-sm mt-2">Review & Submit</span>
            </div>
          </div>

          {/* Step 1: Incident Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
                <CardDescription>
                  Record the basic details about the incident
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Incident Title</label>
                  <Input
                    placeholder="Enter a descriptive title for the incident"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <XCircle className="h-3 w-3 mr-1" /> {errors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-forensic-600" />
                      Date of Incident
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-forensic-600" />
                      Time of Incident
                    </label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    Location of Incident
                  </label>
                  <Input
                    placeholder="Enter the physical location of the incident"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <XCircle className="h-3 w-3 mr-1" /> {errors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Type of Incident
                  </label>
                  <Select
                    value={incidentType}
                    onValueChange={(value) => setIncidentType(value)}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        errors.incidentType ? "border-red-500" : ""
                      }`}
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
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <XCircle className="h-3 w-3 mr-1" /> {errors.incidentType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Incident Description
                  </label>
                  <Textarea
                    placeholder="Provide a detailed description of the incident including how it was discovered"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <XCircle className="h-3 w-3 mr-1" /> {errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-forensic-100 pt-4">
                <Button
                  className="bg-forensic-800 hover:bg-forensic-800/90"
                  onClick={handleNextStep}
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Parties Involved */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Parties Involved</CardTitle>
                <CardDescription>
                  Enter information about complainant, suspects, and witnesses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2 text-forensic-800" />
                    Complainant Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Complainant Name
                      </label>
                      <Input
                        placeholder="Full name of complainant"
                        value={complainantName}
                        onChange={(e) => setComplainantName(e.target.value)}
                        className={
                          errors.complainantName ? "border-red-500" : ""
                        }
                      />
                      {errors.complainantName && (
                        <p className="text-sm text-red-500 flex items-center mt-1">
                          <XCircle className="h-3 w-3 mr-1" />{" "}
                          {errors.complainantName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Organization
                      </label>
                      <Input
                        placeholder="If representing an organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Contact Number
                      </label>
                      <Input
                        placeholder="Phone number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className={errors.contactNumber ? "border-red-500" : ""}
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-red-500 flex items-center mt-1">
                          <XCircle className="h-3 w-3 mr-1" />{" "}
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-semibold flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-forensic-danger" />
                    Suspect Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Suspect Name/Identifier
                      </label>
                      <Input
                        placeholder="Name or identifying information (if known)"
                        value={suspectName}
                        onChange={(e) => setSuspectName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Suspect Type
                      </label>
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
                    <label className="text-sm font-medium">
                      Additional Information
                    </label>
                    <Textarea
                      placeholder="Any other information about the suspect (IP addresses, identifying characteristics, etc.)"
                      rows={3}
                      value={suspectInfo}
                      onChange={(e) => setSuspectInfo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-semibold flex items-center">
                    <FileQuestion className="h-4 w-4 mr-2 text-forensic-accent" />
                    Witness Information (if any)
                  </h3>

                  {witnesses.map((w, idx) => (
                    <div
                      key={idx}
                      className="mb-6 p-4 border border-forensic-100 rounded-md bg-forensic-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Witness Name
                          </label>
                          <Input
                            placeholder="Full name of witness"
                            value={w.name}
                            onChange={(e) => {
                              const updated = [...witnesses];
                              updated[idx].name = e.target.value;
                              setWitnesses(updated);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Contact Information
                          </label>
                          <Input
                            placeholder="Phone or email"
                            value={w.contact}
                            onChange={(e) => {
                              const updated = [...witnesses];
                              updated[idx].contact = e.target.value;
                              setWitnesses(updated);
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">
                          Witness Statement
                        </label>
                        <Textarea
                          placeholder="Brief statement from witness"
                          rows={3}
                          value={w.statement}
                          onChange={(e) => {
                            const updated = [...witnesses];
                            updated[idx].statement = e.target.value;
                            setWitnesses(updated);
                          }}
                        />
                      </div>
                      {witnesses.length > 1 && (
                        <Button
                          variant="ghost"
                          className="mt-2 text-forensic-danger"
                          onClick={() => {
                            setWitnesses(witnesses.filter((_, i) => i !== idx));
                          }}
                        >
                          Remove Witness
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setWitnesses([
                        ...witnesses,
                        { name: "", contact: "", statement: "" },
                      ])
                    }
                  >
                    + Add Another Witness
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-forensic-100 pt-4">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Previous Step
                </Button>
                <Button
                  className="bg-forensic-800 hover:bg-forensic-800/90"
                  onClick={handleNextStep}
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>
                  Review the information before submitting the FIR
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-semibold">Incident Details</h3>
                  <div className="bg-forensic-50 p-4 rounded-md border border-forensic-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-forensic-500">Title</p>
                        <p className="font-medium">{title || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-forensic-500">Date & Time</p>
                        <p className="font-medium">
                          {date
                            ? new Date(date).toLocaleDateString()
                            : "Not specified"}
                          {time ? ` at ${time}` : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-forensic-500">Location</p>
                        <p className="font-medium">
                          {location || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-forensic-500">Type</p>
                        <p className="font-medium">
                          {incidentType === "data_breach"
                            ? "Data Breach"
                            : incidentType === "unauthorized_access"
                            ? "Unauthorized System Access"
                            : incidentType === "information_theft"
                            ? "Information Theft"
                            : incidentType === "malware_attack"
                            ? "Malware Attack"
                            : incidentType === "phishing"
                            ? "Phishing Incident"
                            : incidentType === "identity_theft"
                            ? "Identity Theft"
                            : incidentType === "data_loss"
                            ? "Data Loss"
                            : incidentType === "physical"
                            ? "Physical Device Theft"
                            : incidentType === "other"
                            ? "Other Cyber Crime"
                            : "Not selected"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-forensic-500">Description</p>
                      <p className="text-sm">{description || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-semibold">Complainant</h3>
                  <div className="bg-forensic-50 p-4 rounded-md border border-forensic-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-forensic-500">Name</p>
                        <p className="font-medium">
                          {complainantName || "Not provided"}
                        </p>
                        {organization && (
                          <p className="text-sm text-forensic-600">
                            ({organization})
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-forensic-500">Contact</p>
                        <p className="font-medium">
                          {contactNumber || "Not provided"}
                        </p>
                        {email && (
                          <p className="text-sm text-forensic-600">{email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-semibold">Suspect Information</h3>
                  <div className="bg-forensic-50 p-4 rounded-md border border-forensic-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-forensic-500">Suspect</p>
                        <p className="font-medium">
                          {suspectName || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-forensic-500">Type</p>
                        <p className="font-medium">
                          {suspectType === "internal"
                            ? "Internal Actor"
                            : suspectType === "external"
                            ? "External Actor"
                            : suspectType === "former_employee"
                            ? "Former Employee"
                            : suspectType === "group"
                            ? "Organized Group"
                            : suspectType === "unknown"
                            ? "Unknown"
                            : "Not selected"}
                        </p>
                      </div>
                    </div>

                    {suspectInfo && (
                      <div className="mt-4">
                        <p className="text-sm text-forensic-500">
                          Additional Information
                        </p>
                        <p className="text-sm">{suspectInfo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {witnesses.filter((w) => w.name || w.contact || w.statement)
                  .length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold">
                      Witness Information
                    </h3>
                    {witnesses
                      .filter((w) => w.name || w.contact || w.statement)
                      .map((w, idx) => (
                        <div
                          key={idx}
                          className="bg-forensic-50 p-4 rounded-md border border-forensic-100 mb-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-forensic-500">Name</p>
                              <p className="font-medium">
                                {w.name || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-forensic-500">
                                Contact
                              </p>
                              <p className="font-medium">
                                {w.contact || "Not provided"}
                              </p>
                            </div>
                          </div>
                          {w.statement && (
                            <div className="mt-4">
                              <p className="text-sm text-forensic-500">
                                Statement
                              </p>
                              <p className="text-sm">{w.statement}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}

                <div className="p-4 border border-forensic-200 rounded-md bg-forensic-50">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-forensic-800" />
                    <h4 className="font-medium">Officer Declaration</h4>
                  </div>
                  <p className="text-sm text-forensic-600 mt-1">
                    I declare that the information provided in this First
                    Information Report is true and accurate to the best of my
                    knowledge.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-forensic-100 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                >
                  Previous Step
                </Button>
                <Button
                  className="bg-forensic-800 hover:bg-forensic-800/90"
                  onClick={handleCompleteForm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Filing FIR...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit FIR
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4: Success */}
          {step === 4 && formCompleted && (
            <Card>
              <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-forensic-success/20 flex items-center justify-center mb-4">
                  <Check className="h-10 w-10 text-forensic-success" />
                </div>
                <h3 className="text-xl font-bold text-forensic-800 mb-2">
                  FIR Successfully Filed!
                </h3>
                <p className="text-forensic-600 mb-6 max-w-md">
                  Your First Information Report has been submitted successfully
                  and recorded on the blockchain with ID{" "}
                  <strong>{submittedFirId}</strong>
                </p>
                <div className="space-y-4 w-full max-w-sm">
                  <div className="flex justify-between text-sm py-2 border-b border-forensic-100">
                    <span className="text-forensic-500">FIR Number:</span>
                    <span className="font-medium font-mono text-xs">
                      {submittedFirId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-forensic-100">
                    <span className="text-forensic-500">Title:</span>
                    <span className="font-medium">{title}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-forensic-100">
                    <span className="text-forensic-500">Location:</span>
                    <span className="font-medium">{location}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-forensic-100">
                    <span className="text-forensic-500">Complainant:</span>
                    <span className="font-medium">{complainantName}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-forensic-100">
                    <span className="text-forensic-500">Filed By:</span>
                    <span className="font-medium">
                      {user?.name || "Officer"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-forensic-100">
                    <span className="text-forensic-500">Date Filed:</span>
                    <span className="font-medium">
                      {submittedDate || new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-forensic-500">Status:</span>
                    <Badge className="bg-forensic-success text-white">
                      Filed on Blockchain
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reset form for new FIR
                      setStep(1);
                      setFormCompleted(false);
                      setSubmittedFirId(null);
                      setTitle("");
                      setDate("");
                      setTime("");
                      setLocation("");
                      setIncidentType("");
                      setDescription("");
                      setComplainantName("");
                      setOrganization("");
                      setContactNumber("");
                      setEmail("");
                      setSuspectName("");
                      setSuspectType("");
                      setSuspectInfo("");
                      setWitnesses([{ name: "", contact: "", statement: "" }]);
                    }}
                  >
                    File Another FIR
                  </Button>
                  <Button className="bg-forensic-evidence hover:bg-forensic-evidence/90">
                    Upload Evidence
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* For view and edit modes, we'd implement different UIs here */}
      {mode === "view" && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-forensic-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">FIR Management</h2>
          <p className="text-forensic-600">
            View all your filed FIRs and their status
          </p>
        </div>
      )}

      {mode === "edit" && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-forensic-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Edit FIR Form</h2>
          <p className="text-forensic-600">
            Edit an existing FIR with updated information
          </p>
        </div>
      )}
    </div>
  );
};

export default FIRManagement;
