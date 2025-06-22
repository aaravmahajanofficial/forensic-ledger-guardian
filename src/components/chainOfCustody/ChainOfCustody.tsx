import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  FileUp,
  Eye,
  Lock,
  Unlock,
  FileCheck2,
  User,
  ShieldCheck,
  FileCog,
  Download,
  ExternalLink,
  ChevronDown,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CustodyEvent {
  id: string;
  type: "upload" | "access" | "lock" | "unlock" | "verify" | "modify";
  timestamp: string;
  user: {
    name: string;
    role: "Forensic" | "Officer" | "Court" | "Lawyer";
    initials: string;
    avatarUrl?: string;
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
  Forensic: "border-blue-500/40 bg-blue-500/10 text-blue-500",
  Officer: "border-primary/40 bg-primary/10 text-primary",
  Court: "border-purple-500/40 bg-purple-500/10 text-purple-500",
  Lawyer: "border-amber-500/40 bg-amber-500/10 text-amber-500",
};

const eventTypeIcon = (type: CustodyEvent["type"], className?: string) => {
  const props = { className: cn("h-5 w-5", className) };
  switch (type) {
    case "upload":
      return <FileUp {...props} />;
    case "access":
      return <Eye {...props} />;
    case "lock":
      return <Lock {...props} />;
    case "unlock":
      return <Unlock {...props} />;
    case "verify":
      return <FileCheck2 {...props} />; // Using a filled icon for distinction
    case "modify":
      return <FileCog {...props} />;
  }
};

// Sample data - would come from blockchain in real implementation
const sampleEvents: CustodyEvent[] = [
  {
    id: "1",
    type: "upload",
    timestamp: "2025-04-08T10:23:45Z",
    user: {
      name: "John Smith",
      role: "Forensic",
      initials: "JS",
      avatarUrl: "/avatars/01.png",
    },
    details: "Evidence initially uploaded, hashed, and recorded on the blockchain.",
    transactionHash:
      "0x7a8d9e2f3c4b5a6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
  },
  {
    id: "2",
    type: "verify",
    timestamp: "2025-04-08T10:25:12Z",
    user: {
      name: "Sarah Lee",
      role: "Forensic",
      initials: "SL",
      avatarUrl: "/avatars/02.png",
    },
    details: "Evidence integrity verified against blockchain hash by secondary investigator.",
    transactionHash:
      "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
  },
  {
    id: "3",
    type: "access",
    timestamp: "2025-04-09T14:12:33Z",
    user: {
      name: "Emily Johnson",
      role: "Officer",
      initials: "EJ",
      avatarUrl: "/avatars/03.png",
    },
    details: "Accessed evidence log for preliminary case review. Purpose: Fact-finding.",
    transactionHash:
      "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9d0e",
  },
  {
    id: "4",
    type: "access",
    timestamp: "2025-04-09T16:37:21Z",
    user: { name: "Michael Chen", role: "Court", initials: "MC" },
    details: "Evidence manifest accessed by court clerk for preparation of case file.",
    transactionHash:
      "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9e1f",
  },
  {
    id: "5",
    type: "lock",
    timestamp: "2025-04-09T17:05:48Z",
    user: { name: "Michael Chen", role: "Court", initials: "MC" },
    details: "Evidence access locked pending court order. No further access permitted.",
    transactionHash:
      "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9f2a",
  },
];

const ChainOfCustody: React.FC<Partial<ChainOfCustodyProps>> = ({
  evidenceId = "EV-104-001",
  caseId = "FF-2023-104",
  events = sampleEvents,
}) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(
    events[0]?.id || null
  );

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent((prev) => (prev === eventId ? null : eventId));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Chain of Custody
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Evidence ID:{" "}
            <span className="font-mono">{evidenceId}</span> • Case:{" "}
            <span className="font-mono">{caseId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Badge variant="outline">{events.length} Recorded Events</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  All custody events are immutably recorded on the blockchain.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-border pl-8 py-4 space-y-10">
          {events.map((event, index) => {
            const isExpanded = expandedEvent === event.id;

            return (
              <div
                key={event.id}
                className="relative animate-in fade-in slide-in-from-left-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline node */}
                <div className="absolute -left-[42px] top-0 flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-border">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                    {eventTypeIcon(event.type, "h-4 w-4")}
                  </div>
                </div>

                {/* Event content */}
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-border">
                      <AvatarImage
                        src={event.user.avatarUrl}
                        alt={event.user.name}
                      />
                      <AvatarFallback
                        className={cn(
                          "text-xs font-bold",
                          roleColors[event.user.role]
                        )}
                      >
                        {event.user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">
                        {event.user.name}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("mt-1 text-xs", roleColors[event.user.role])}
                      >
                        <User className="h-3 w-3 mr-1" />
                        {event.user.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-2 md:mt-0 text-sm text-muted-foreground text-left md:text-right">
                    <div>
                      {formatDistanceToNow(new Date(event.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                    <div className="text-xs">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground my-3 pl-13 md:pl-0">
                  {event.details}
                </p>

                <div className="pl-13 md:pl-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEventExpansion(event.id)}
                    className="text-muted-foreground hover:text-primary h-8 px-2"
                  >
                    {isExpanded ? "Hide Details" : "Show Details"}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 ml-1 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </Button>
                </div>

                {event.transactionHash && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out pl-13 md:pl-0",
                      isExpanded ? "max-h-96 mt-2" : "max-h-0"
                    )}
                  >
                    <div className="font-mono text-xs bg-muted p-3 rounded-md border border-border overflow-x-auto">
                      <div className="text-muted-foreground">
                        Blockchain Transaction
                      </div>
                      <div className="text-foreground break-all">
                        {event.transactionHash}
                      </div>
                    </div>

                    <div className="flex justify-end mt-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        View on Explorer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1.5" />
                        Export Certificate
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChainOfCustody;
