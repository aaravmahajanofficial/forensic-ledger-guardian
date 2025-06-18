import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileDigit, Clock } from "lucide-react";
import CaseOverview from "./CaseOverview";
import CaseEvidence from "./CaseEvidence";
import CaseActivity from "./CaseActivity";
import { CaseData } from "@/types/case";

interface CaseTabsProps {
  caseData: CaseData;
}

const CaseTabs: React.FC<CaseTabsProps> = ({ caseData }) => {
  return (
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

      <TabsContent value="overview" className="space-y-6">
        <CaseOverview caseData={caseData} />
      </TabsContent>

      <TabsContent value="evidence">
        <CaseEvidence
          evidenceItems={caseData.evidenceItems}
          caseId={caseData.id}
        />
      </TabsContent>

      <TabsContent value="activity">
        <CaseActivity timeline={caseData.timeline} />
      </TabsContent>
    </Tabs>
  );
};

export default CaseTabs;
