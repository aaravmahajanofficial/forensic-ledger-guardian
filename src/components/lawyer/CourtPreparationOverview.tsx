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
import { Gavel, Calendar, Users, Clock, CheckCircle2 } from "lucide-react";

interface CourtPreparationOverviewProps {
  caseData: {
    title: string;
    status: string;
    hearingDate: string;
    judge: string;
    courtroom: string;
    prepProgress: number;
  };
}

const CourtPreparationOverview: React.FC<CourtPreparationOverviewProps> = ({
  caseData,
}) => {
  return (
    <div className="space-y-6">
      {/* Case Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-forensic-accent/10 rounded-lg">
                <Gavel className="h-6 w-6 text-forensic-accent" />
              </div>
              <div>
                <CardTitle className="text-xl text-forensic-800">
                  {caseData.title}
                </CardTitle>
                <CardDescription>Case preparation status</CardDescription>
              </div>
            </div>
            <Badge
              className={
                caseData.status === "Ready"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {caseData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-forensic-accent" />
              <div>
                <p className="text-sm font-medium">Hearing Date</p>
                <p className="text-sm text-gray-600">{caseData.hearingDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-forensic-accent" />
              <div>
                <p className="text-sm font-medium">Judge</p>
                <p className="text-sm text-gray-600">{caseData.judge}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-forensic-accent" />
              <div>
                <p className="text-sm font-medium">Courtroom</p>
                <p className="text-sm text-gray-600">{caseData.courtroom}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Preparation Progress</span>
              <span className="text-sm text-gray-600">
                {caseData.prepProgress}%
              </span>
            </div>
            <Progress value={caseData.prepProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium">Ready Items</h3>
            <p className="text-2xl font-bold text-green-600">12</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium">Witnesses</h3>
            <p className="text-2xl font-bold text-blue-600">5</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Gavel className="h-8 w-8 text-forensic-accent mx-auto mb-2" />
            <h3 className="font-medium">Documents</h3>
            <p className="text-2xl font-bold text-forensic-accent">18</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourtPreparationOverview;
