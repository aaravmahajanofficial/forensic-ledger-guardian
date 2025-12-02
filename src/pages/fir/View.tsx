import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  FilePlus,
  Pencil,
  Scale,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

/** Helper: safely extract a display name from various shapes */
const extractName = (val: any): string => {
  if (!val && val !== 0) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val) && val.length > 0) {
    return val[0]?.name ?? String(val[0]);
  }
  if (typeof val === "object") {
    return val.name ?? JSON.stringify(val);
  }
  return String(val);
};

const extractContact = (val: any): string => {
  if (!val && val !== 0) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val) && val.length > 0) {
    return val[0]?.contact_number ?? String(val[0]);
  }
  if (typeof val === "object") {
    return val.contact_number ?? JSON.stringify(val);
  }
  return String(val);
};

const getFIRStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-forensic-warning/20 text-forensic-warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending Promotion
        </Badge>
      );
    case "promoted":
      return (
        <Badge className="bg-forensic-success/20 text-forensic-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Promoted
        </Badge>
      );
    default:
      return <Badge className="bg-gray-200 text-gray-600">Unknown</Badge>;
  }
};

const View = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fir, setFir] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFIR = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("fir")
        .select(
          `
          *,
          suspect ( name ),
          complainant ( name,contact_number )
        `
        )
        .eq("fir_id", id)
        .single();

      if (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load FIR details" });
        setFir(null);
      } else {
        setFir(data);
      }
      setLoading(false);
    };

    loadFIR();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-forensic-500" />
      </div>
    );
  }

  if (!fir) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/fir")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to FIRs
        </Button>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-forensic-400 mb-2" />
            <h3 className="text-lg font-medium text-forensic-800">
              FIR Not Found
            </h3>
            <p className="text-forensic-500 mb-4">
              The requested FIR could not be found
            </p>
            <Button onClick={() => navigate("/fir")}>Return to FIR List</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/fir/edit/${id}`);
  };

  const handleAddEvidence = () => {
    navigate("/upload", { state: { firId: id } });
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/fir")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to FIRs
        </Button>

        <div className="flex items-center gap-2">
          <Button
            className="bg-forensic-evidence hover:bg-forensic-evidence/90"
            onClick={handleAddEvidence}
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Add Evidence
          </Button>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-forensic-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-forensic-50 p-3 rounded-full">
                <FileText className="h-6 w-6 text-forensic-800" />
              </div>
              <div>
                <CardTitle className="text-2xl text-forensic-800">
                  {fir.fir_id}
                </CardTitle>
                <CardDescription>{fir.title}</CardDescription>
              </div>
            </div>
            {getFIRStatusBadge(fir.status)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-forensic-600">{fir.description}</p>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filing Information */}
        <Card className="border-forensic-200">
          <CardHeader>
            <CardTitle className="text-lg text-forensic-800">
              Filing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-forensic-500" />
              <div>
                <p className="text-sm text-forensic-500">Filed By</p>
                <p className="font-medium text-forensic-800">
                  {extractName(fir.filed_by)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-forensic-500" />
              <div>
                <p className="text-sm text-forensic-500">Filed Date</p>
                <p className="font-medium text-forensic-800">
                  {fir.filed_on
                    ? new Date(fir.filed_on).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-forensic-500" />
              <div>
                <p className="text-sm text-forensic-500">Category</p>
                <p className="font-medium text-forensic-800">
                  {fir.incident_type || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card className="border-forensic-200">
          <CardHeader>
            <CardTitle className="text-lg text-forensic-800">
              Incident Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-forensic-500" />
              <div>
                <p className="text-sm text-forensic-500">Incident Date</p>
                <p className="font-medium text-forensic-800">
                  {fir.incident_date
                    ? new Date(fir.incident_date).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-forensic-500" />
              <div>
                <p className="text-sm text-forensic-500">Location</p>
                <p className="font-medium text-forensic-800">
                  {fir.location || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-forensic-500" />
              <div>
                <p className="text-sm text-forensic-500">Suspect</p>
                <p className="font-medium text-forensic-800">
                  {extractName(fir.suspect) || "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complainant Information */}
        <Card className="border-forensic-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-forensic-800">
              Complainant Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-forensic-500" />
                <div>
                  <p className="text-sm text-forensic-500">Name</p>
                  <p className="font-medium text-forensic-800">
                    {extractName(fir.complainant) || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-forensic-500" />
                <div>
                  <p className="text-sm text-forensic-500">Contact</p>
                  <p className="font-medium text-forensic-800">
                    {extractContact(fir.complainant) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default View;