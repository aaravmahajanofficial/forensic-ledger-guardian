import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TimelineEvent } from "@/types/case";
import {
  FilePlus,
  FileText,
  UserCheck,
  Gavel,
  ShieldCheck,
  Activity,
} from "lucide-react";

interface CaseActivityProps {
  timeline: TimelineEvent[];
}

const eventIcons: { [key: string]: React.ElementType } = {
  "case created": ShieldCheck,
  "evidence added": FilePlus,
  "evidence verified": FileText,
  "access granted": UserCheck,
  "hearing scheduled": Gavel,
  default: Activity,
};

const CaseActivity: React.FC<CaseActivityProps> = ({ timeline }) => {
  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Case Timeline
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              A chronological log of all case activities
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative pl-8 border-l-2 border-border">
          {timeline.map((event, index) => {
            const Icon = eventIcons[event.event.toLowerCase()] || eventIcons.default;
            return (
              <div key={index} className="mb-8 last:mb-0">
                <div className="absolute -left-[1.30rem] flex items-center justify-center bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-8 ring-card">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-foreground">{event.event}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {event.actor} on{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseActivity;
