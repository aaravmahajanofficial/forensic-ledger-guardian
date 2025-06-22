import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  Shield,
  Scale,
  FileText,
  Briefcase,
  Users,
} from "lucide-react";
import { CaseData } from "@/types/case";
import { cn } from "@/lib/utils";

interface CaseOverviewProps {
  caseData: CaseData;
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start">
    <Icon className="h-5 w-5 text-muted-foreground mt-1" />
    <div className="ml-4">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);

const CaseOverview: React.FC<CaseOverviewProps> = ({ caseData }) => {
  return (
    <div className="space-y-8">
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Case Details
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Key information and summary
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <InfoItem
              icon={Calendar}
              label="Date Filed"
              value={new Date(caseData.dateCreated).toLocaleDateString()}
            />
            <InfoItem
              icon={Calendar}
              label="Court Date"
              value={
                caseData.courtDate
                  ? new Date(caseData.courtDate).toLocaleDateString()
                  : "Not Scheduled"
              }
            />
            <InfoItem
              icon={Shield}
              label="Filing Officer"
              value={caseData.filingOfficer}
            />
            <InfoItem
              icon={Scale}
              label="Assigned Judge"
              value={caseData.assignedJudge || "Not Assigned"}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Case Description
            </h3>
            <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border">
              {caseData.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Involved Parties
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Individuals associated with this case
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseData.parties.map((party, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-muted-foreground mr-3" />
                    <span className="font-medium text-foreground">
                      {party.name}
                    </span>
                  </div>
                  <Badge
                    variant={
                      party.role.toLowerCase() === "defendant"
                        ? "destructive"
                        : party.role.toLowerCase() === "plaintiff"
                        ? "success"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {party.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Key Evidence
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  A snapshot of crucial evidence items
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {caseData.evidenceItems.length > 0 ? (
              <ul className="space-y-3">
                {caseData.evidenceItems
                  .slice(0, 3)
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                        <span className="font-medium text-foreground">
                          {item.name}
                        </span>
                      </div>
                      <Badge
                        variant={
                          item.status === "verified" ? "success" : "warning"
                        }
                        className={cn("text-xs font-semibold")}
                      >
                        {item.status}
                      </Badge>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  No evidence has been submitted for this case yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseOverview;
