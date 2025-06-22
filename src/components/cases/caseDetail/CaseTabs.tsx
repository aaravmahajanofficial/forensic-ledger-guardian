import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  Clock4,
  Users,
  FolderKanban,
} from "lucide-react";
import CaseOverview from "./CaseOverview";
import CaseEvidence from "./CaseEvidence";
import CaseActivity from "./CaseActivity";
import { CaseData } from "@/types/case";

interface CaseTabsProps {
  caseData: CaseData;
}

const CaseTabs: React.FC<CaseTabsProps> = ({ caseData }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-6 bg-muted p-1 rounded-lg">
        <TabsTrigger
          value="overview"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          <LayoutGrid className="h-5 w-5" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="evidence"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          <FolderKanban className="h-5 w-5" />
          <span>Evidence ({caseData.evidenceItems.length})</span>
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          <Clock4 className="h-5 w-5" />
          <span>Timeline</span>
        </TabsTrigger>
        <TabsTrigger
          value="participants"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          <Users className="h-5 w-5" />
          <span>Participants</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
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

      <TabsContent value="participants">
        {/* Placeholder for future participants component */}
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Participants Panel</h3>
          <p className="text-sm">
            Management of involved parties is coming soon.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CaseTabs;
