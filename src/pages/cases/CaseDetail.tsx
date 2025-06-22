import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { caseData as mockCaseData } from "@/data/mockCaseData";
import CaseDetailHeader from "@/components/cases/caseDetail/CaseDetailHeader";
import CaseTabs from "@/components/cases/caseDetail/CaseTabs";
import { CaseData } from "@/types/case";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const CaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data based on caseId
    setLoading(true);
    setTimeout(() => {
      // In a real app, you would fetch data from an API
      const fetchedData = {
        ...mockCaseData,
        id: caseId || mockCaseData.id,
      };
      setCaseData(fetchedData);
      setLoading(false);
    }, 500); // Simulate network delay
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Case Not Found</h2>
        <p className="text-muted-foreground">
          The case you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CaseDetailHeader
        title={caseData.title}
        status={caseData.status}
        id={caseData.id}
      />
      <CaseTabs caseData={caseData} />
    </div>
  );
};

export default CaseDetail;
