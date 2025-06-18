import React from "react";
import { useParams } from "react-router-dom";
import { caseData as mockCaseData } from "@/data/mockCaseData";
import CaseDetailHeader from "@/components/cases/caseDetail/CaseDetailHeader";
import CaseTabs from "@/components/cases/caseDetail/CaseTabs";

const CaseDetail = () => {
  const { caseId } = useParams();
  const caseData = { ...mockCaseData, id: caseId || mockCaseData.id };

  return (
    <div className="space-y-6">
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
