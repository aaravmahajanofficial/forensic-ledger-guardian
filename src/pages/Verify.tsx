import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EvidenceVerifier from "@/components/verification/EvidenceVerifier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, History, Fingerprint } from "lucide-react";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "standard";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.set("tab", value);
    navigate(`${location.pathname}?${params}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-forensic-800">
          Evidence Verification
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="text-forensic-court"
            onClick={() => navigate("/verify/custody")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Chain of Custody
          </Button>
          <Button
            variant="outline"
            className="text-forensic-accent"
            onClick={() => navigate("/evidence/verify")}
          >
            <Fingerprint className="h-4 w-4 mr-2" />
            Technical Verification
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Standard Verification</span>
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Verification History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <EvidenceVerifier />
        </TabsContent>

        <TabsContent value="historical">
          <div className="text-center py-12 text-forensic-500">
            <History className="h-12 w-12 mx-auto text-forensic-300 mb-4" />
            <h2 className="text-xl font-medium text-forensic-700 mb-2">
              Verification History
            </h2>
            <p>View the complete history of all evidence verifications.</p>
            <p className="text-sm">
              This feature is coming soon in the next update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Verify;
