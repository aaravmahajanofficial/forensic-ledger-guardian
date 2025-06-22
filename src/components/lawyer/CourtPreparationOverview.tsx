import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gavel,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface CourtPreparationOverviewProps {
  caseData: {
    title: string;
    caseNumber: string;
    status: "Ready" | "In Progress" | "Pending";
    hearingDate: string;
    judge: string;
    courtroom: string;
    prepProgress: number;
    stats: {
      readyItems: number;
      pendingItems: number;
      witnesses: number;
      documents: number;
    };
  };
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted">
    <div className="flex-shrink-0 text-primary">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  variant: "success" | "warning" | "info" | "default";
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, variant }) => {
  const variantClasses = {
    success: "bg-success/10 text-success-foreground border-success/20",
    warning: "bg-warning/10 text-warning-foreground border-warning/20",
    info: "bg-info/10 text-info-foreground border-info/20",
    default: "bg-secondary/80 text-secondary-foreground border-secondary/20",
  };

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${variantClasses[variant]}`}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-background/50`}>{icon}</div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const CourtPreparationOverview: React.FC<CourtPreparationOverviewProps> = ({
  caseData,
}) => {
  const getStatusBadgeVariant = (
    status: "Ready" | "In Progress" | "Pending"
  ): "success" | "default" | "warning" => {
    switch (status) {
      case "Ready":
        return "success";
      case "In Progress":
        return "default";
      case "Pending":
        return "warning";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Gavel className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-primary">
                  {caseData.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Case #{caseData.caseNumber} - Preparation Status
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={getStatusBadgeVariant(caseData.status)}
              className="text-base self-start md:self-center whitespace-nowrap py-1.5 px-4 rounded-full"
            >
              {caseData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem
              icon={<Calendar className="h-6 w-6" />}
              label="Hearing Date"
              value={new Date(caseData.hearingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            />
            <InfoItem
              icon={<Users className="h-6 w-6" />}
              label="Presiding Judge"
              value={caseData.judge}
            />
            <InfoItem
              icon={<Clock className="h-6 w-6" />}
              label="Courtroom"
              value={caseData.courtroom}
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between font-medium">
              <span className="text-foreground">Overall Preparation Progress</span>
              <span className="text-primary font-semibold">{caseData.prepProgress}%</span>
            </div>
            <Progress value={caseData.prepProgress} className="h-2.5" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="h-7 w-7 text-success" />}
          label="Ready Items"
          value={caseData.stats.readyItems}
          variant="success"
        />
        <StatCard
          icon={<AlertTriangle className="h-7 w-7 text-warning" />}
          label="Pending Items"
          value={caseData.stats.pendingItems}
          variant="warning"
        />
        <StatCard
          icon={<Users className="h-7 w-7 text-info" />}
          label="Witnesses"
          value={caseData.stats.witnesses}
          variant="info"
        />
        <StatCard
          icon={<FileText className="h-7 w-7 text-secondary-foreground" />}
          label="Documents"
          value={caseData.stats.documents}
          variant="default"
        />
      </div>
    </div>
  );
};

export default CourtPreparationOverview;
