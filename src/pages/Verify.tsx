import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import EvidenceVerifier from "@/components/verification/EvidenceVerifier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  History,
  Fingerprint,
  GitBranch,
} from "lucide-react";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "standard";

  const handleTabChange = (value: string) => {
    navigate(`${location.pathname}?tab=${value}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in bg-background text-foreground">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <ShieldCheck className="h-8 w-8" />
            Evidence Verification
          </h1>
          <p className="text-muted-foreground mt-1">
            Verify evidence integrity using file hashes, IDs, or chain of
            custody records.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            asChild
            variant="outline"
            onClick={() => navigate("/lawyer/chain-of-custody-verification")} // Corrected path
          >
            <Link to="/lawyer/chain-of-custody-verification">
              <GitBranch className="h-4 w-4 mr-2" />
              Chain of Custody
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2 mb-6 bg-muted p-1 rounded-lg">
            <TabsTrigger
              value="standard"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Fingerprint className="h-5 w-5" />
              <span>Standard Verification</span>
            </TabsTrigger>
            <TabsTrigger
              value="historical"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <History className="h-5 w-5" />
              <span>Verification History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standard">
            <EvidenceVerifier />
          </TabsContent>

          <TabsContent value="historical">
            <Card className="text-center border-border/50">
              <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                  <History className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4 text-xl">
                  Verification History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View the complete, immutable history of all evidence
                  verifications.
                </p>
                <p className="text-sm text-muted-foreground/80 mt-2">
                  This feature is under development and will be available soon.
                </p>
                <Button disabled variant="secondary" className="mt-6">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Verify;
