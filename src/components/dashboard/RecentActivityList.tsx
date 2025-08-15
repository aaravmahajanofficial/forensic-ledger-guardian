import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUp, Eye, Lock, Unlock, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock activity data
const activities = [
  {
    id: 1,
    type: "upload",
    user: "John Smith",
    userInitials: "JS",
    userRole: "Forensic",
    caseId: "FF-2023-104",
    evidenceId: "EV-104-001",
    timestamp: "2025-04-09T10:23:45Z",
    description: "Uploaded hard drive disk image",
  },
  {
    id: 2,
    type: "view",
    user: "Emily Johnson",
    userInitials: "EJ",
    userRole: "Officer",
    caseId: "FF-2023-104",
    evidenceId: "EV-104-001",
    timestamp: "2025-04-09T11:45:12Z",
    description: "Viewed hard drive disk image",
  },
  {
    id: 3,
    type: "lock",
    user: "Michael Chen",
    userInitials: "MC",
    userRole: "Court",
    caseId: "FF-2023-092",
    evidenceId: null,
    timestamp: "2025-04-09T13:12:33Z",
    description: "Sealed case for court proceedings",
  },
  {
    id: 4,
    type: "verify",
    user: "Sarah Lee",
    userInitials: "SL",
    userRole: "Forensic",
    caseId: "FF-2023-089",
    evidenceId: "EV-089-005",
    timestamp: "2025-04-08T16:37:21Z",
    description: "Verified email archive integrity",
  },
  {
    id: 5,
    type: "unlock",
    user: "Michael Chen",
    userInitials: "MC",
    userRole: "Court",
    caseId: "FF-2023-078",
    evidenceId: null,
    timestamp: "2025-04-08T09:05:48Z",
    description: "Unsealed case after hearing",
  },
];

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "upload":
      return <FileUp className="h-4 w-4 text-forensic-evidence" />;
    case "view":
      return <Eye className="h-4 w-4 text-forensic-accent" />;
    case "lock":
      return <Lock className="h-4 w-4 text-forensic-danger" />;
    case "unlock":
      return <Unlock className="h-4 w-4 text-forensic-success" />;
    case "verify":
      return <FileCheck className="h-4 w-4 text-forensic-court" />;
    default:
      return null;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "upload":
      return "bg-forensic-evidence/10 border-forensic-evidence/20";
    case "view":
      return "bg-forensic-accent/10 border-forensic-accent/20";
    case "lock":
      return "bg-forensic-danger/10 border-forensic-danger/20";
    case "unlock":
      return "bg-forensic-success/10 border-forensic-success/20";
    case "verify":
      return "bg-forensic-court/10 border-forensic-court/20";
    default:
      return "bg-forensic-200 border-forensic-300";
  }
};

const RecentActivityList = () => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-4 p-3 rounded-lg border border-forensic-100 hover:bg-forensic-50 transition-colors"
        >
          <div
            className={cn(
              "p-2 rounded-full border",
              getActivityColor(activity.type)
            )}
          >
            <ActivityIcon type={activity.type} />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-forensic-800">
                {activity.description}
              </span>
              <span className="text-xs text-forensic-500">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1 text-sm text-forensic-600">
                <span>Case: {activity.caseId}</span>
                {activity.evidenceId && (
                  <>
                    <span>•</span>
                    <span>Evidence: {activity.evidenceId}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-forensic-accent/20 text-forensic-accent text-xs">
              {activity.userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList;
