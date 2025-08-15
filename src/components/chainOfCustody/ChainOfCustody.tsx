import { useState } from "react";
import {
  FileUp,
  Eye,
  Lock,
  Unlock,
  FileCheck,
  User,
  Shield,
  FileCog,
  Download,
  ExternalLink,
  Clock,
  Info,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CustodyEvent {
  id: string;
  type: "upload" | "access" | "lock" | "unlock" | "verify" | "modify";
  timestamp: string;
  user: {
    name: string;
    role: "Forensic" | "Officer" | "Court" | "Lawyer";
    initials: string;
  };
  details: string;
  transactionHash?: string;
}

interface ChainOfCustodyProps {
  evidenceId: string;
  caseId: string;
  events: CustodyEvent[];
}

const roleColors = {
  Forensic:
    "bg-forensic-evidence/20 text-forensic-evidence border-forensic-evidence/30",
  Officer:
    "bg-forensic-accent/20 text-forensic-accent border-forensic-accent/30",
  Court: "bg-forensic-court/20 text-forensic-court border-forensic-court/30",
  Lawyer:
    "bg-forensic-warning/20 text-forensic-warning border-forensic-warning/30",
};

const eventTypeIcon = (type: CustodyEvent["type"]) => {
  switch (type) {
    case "upload":
      return <FileUp className="h-4 w-4" />;
    case "access":
      return <Eye className="h-4 w-4" />;
    case "lock":
      return <Lock className="h-4 w-4" />;
    case "unlock":
      return <Unlock className="h-4 w-4" />;
    case "verify":
      return <FileCheck className="h-4 w-4" />;
    case "modify":
      return <FileCog className="h-4 w-4" />;
  }
};

// Sample data - would come from blockchain in real implementation
const sampleEvents: CustodyEvent[] = [
  {
    id: "1",
    type: "upload",
    timestamp: "2025-04-08T10:23:45Z",
    user: { name: "John Smith", role: "Forensic", initials: "JS" },
    details: "Evidence initially uploaded and hashed",
    transactionHash: "0x7a8d9e2f3c4b5a6d7e8f9a0b1c2d3e4f5a6b7c8d",
  },
  {
    id: "2",
    type: "verify",
    timestamp: "2025-04-08T10:25:12Z",
    user: { name: "Sarah Lee", role: "Forensic", initials: "SL" },
    details: "Evidence integrity verified by secondary investigator",
    transactionHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
  },
  {
    id: "3",
    type: "access",
    timestamp: "2025-04-09T14:12:33Z",
    user: { name: "Emily Johnson", role: "Officer", initials: "EJ" },
    details: "Evidence accessed for case review",
    transactionHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
  },
  {
    id: "4",
    type: "access",
    timestamp: "2025-04-09T16:37:21Z",
    user: { name: "Michael Chen", role: "Court", initials: "MC" },
    details: "Evidence accessed for court preparation",
    transactionHash: "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
  },
  {
    id: "5",
    type: "lock",
    timestamp: "2025-04-09T17:05:48Z",
    user: { name: "Michael Chen", role: "Court", initials: "MC" },
    details: "Evidence locked for court proceedings",
    transactionHash: "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
  },
];

const ChainOfCustody: React.FC<Partial<ChainOfCustodyProps>> = ({
  evidenceId = "EV-104-001",
  caseId = "FF-2023-104",
  events = sampleEvents,
}) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent((prev) => (prev === eventId ? null : eventId));
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (e) {
      return { date: "Invalid date", time: "" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-forensic-800 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-forensic-accent" />
            Chain of Custody
          </h2>
          <p className="text-sm text-forensic-600">
            Evidence ID: {evidenceId} • Case: {caseId}
          </p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-2">
          <Badge variant="outline" className="bg-forensic-50">
            {events.length} recorded events
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4 text-forensic-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  All custody events are immutably recorded on the blockchain
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-forensic-200 pl-6 py-2 space-y-8">
        {events.map((event, index) => {
          const { date, time } = formatDateTime(event.timestamp);
          const isExpanded = expandedEvent === event.id;

          return (
            <div
              key={event.id}
              className="relative animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline node */}
              <div className="absolute -left-[25px] p-1 rounded-full bg-white border-2 border-forensic-200">
                <div className="p-1 rounded-full bg-forensic-accent text-white">
                  {eventTypeIcon(event.type)}
                </div>
              </div>

              {/* Event content */}
              <div
                className={cn(
                  "bg-white rounded-lg shadow-sm border border-forensic-200 p-4 transition-all duration-300",
                  isExpanded ? "shadow-md" : ""
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarImage src="" />
                      <AvatarFallback
                        className={cn(
                          "text-xs border",
                          roleColors[event.user.role]
                        )}
                      >
                        {event.user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-forensic-800">
                        {event.user.name}
                      </div>
                      <div className="text-xs text-forensic-500 flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {event.user.role}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 md:mt-0 text-sm text-forensic-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="mr-1">{date}</span>
                    <span>{time}</span>
                  </div>
                </div>

                <p className="text-forensic-700 my-2">{event.details}</p>

                {event.transactionHash && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isExpanded ? "max-h-96" : "max-h-0"
                    )}
                  >
                    <div className="text-xs font-mono bg-forensic-50 p-2 rounded border border-forensic-200 overflow-x-auto mt-2">
                      <span className="text-forensic-500">TX: </span>
                      <span className="text-forensic-800">
                        {event.transactionHash}
                      </span>
                    </div>

                    <div className="flex justify-end mt-2 gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View on Explorer
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Export Certificate
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEventExpansion(event.id)}
                  className="w-full mt-2 text-forensic-500 hover:text-forensic-700 h-7"
                >
                  {isExpanded ? "Show Less" : "Show Details"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChainOfCustody;
