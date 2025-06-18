import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Shield, Scale, FileDigit } from "lucide-react";
import { Link } from "react-router-dom";
import { CaseData, EvidenceItem } from "@/types/case";

interface CaseOverviewProps {
  caseData: CaseData;
}

const CaseOverview: React.FC<CaseOverviewProps> = ({ caseData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Case Details</CardTitle>
          <CardDescription>Overview and key information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-forensic-500">Date Filed</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-forensic-600 mr-2" />
                <p>{caseData.dateCreated}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-forensic-500">Court Date</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-forensic-600 mr-2" />
                <p>{caseData.courtDate}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-forensic-500">Filing Officer</p>
              <div className="flex items-center mt-1">
                <Shield className="h-4 w-4 text-forensic-600 mr-2" />
                <p>{caseData.filingOfficer}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-forensic-500">Assigned Judge</p>
              <div className="flex items-center mt-1">
                <Scale className="h-4 w-4 text-forensic-600 mr-2" />
                <p>{caseData.assignedJudge}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-forensic-500">Description</p>
            <p className="mt-1 p-2 bg-forensic-50 rounded-md">
              {caseData.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Involved Parties</CardTitle>
            <CardDescription>People associated with this case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseData.parties.map((party, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-forensic-600 mr-2" />
                    <span>{party.name}</span>
                  </div>
                  <Badge variant="outline">{party.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Evidence</CardTitle>
            <CardDescription>Recent evidence submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseData.evidenceItems
                .slice(0, 3)
                .map((item: EvidenceItem, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <FileDigit className="h-4 w-4 text-forensic-accent mr-2" />
                      <span>{item.name}</span>
                    </div>
                    <Badge
                      className={
                        item.status === "verified"
                          ? "bg-green-500"
                          : "bg-amber-500"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to={`/evidence?case=${caseData.id}`}>
                View All Evidence
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CaseOverview;
