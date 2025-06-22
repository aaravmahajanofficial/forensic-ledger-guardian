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
  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
    {icon}
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
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass }) => (
  <Card
    className={`text-white ${colorClass} hover:shadow-lg transition-shadow duration-200`}
  >
    <CardContent className="p-4 flex items-center gap-4">
      <div className="p-3 bg-white/20 rounded-lg">{icon}</div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </CardContent>
  </Card>
);

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
    <div className="space-y-8">
      {/* Case Overview */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Gavel className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {caseData.title}
                </CardTitle>
                <CardDescription>
                  Case #{caseData.caseNumber} - Preparation Status
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={getStatusBadgeVariant(caseData.status)}
              className="text-base self-start md:self-center"
            >
              {caseData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem
              icon={<Calendar className="h-6 w-6 text-primary" />}
              label="Hearing Date"
              value={caseData.hearingDate}
            />
            <InfoItem
              icon={<Users className="h-6 w-6 text-primary" />}
              label="Presiding Judge"
              value={caseData.judge}
            />
            <InfoItem
              icon={<Clock className="h-6 w-6 text-primary" />}
              label="Courtroom"
              value={caseData.courtroom}
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between font-medium">
              <span className="text-foreground">Overall Preparation Progress</span>
              <span className="text-primary">{caseData.prepProgress}%</span>
            </div>
            <Progress value={caseData.prepProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="h-7 w-7" />}
          label="Ready Items"
          value={caseData.stats.readyItems}
          colorClass="bg-green-600"
        />
        <StatCard
          icon={<AlertTriangle className="h-7 w-7" />}
          label="Pending Items"
          value={caseData.stats.pendingItems}
          colorClass="bg-yellow-500"
        />
        <StatCard
          icon={<Users className="h-7 w-7" />}
          label="Witnesses"
          value={caseData.stats.witnesses}
          colorClass="bg-blue-600"
        />
        <StatCard
          icon={<FileText className="h-7 w-7" />}
          label="Documents"
          value={caseData.stats.documents}
          colorClass="bg-gray-700"
        />
      </div>
    </div>
  );
};

export default CourtPreparationOverview;
