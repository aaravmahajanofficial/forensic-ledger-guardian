import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TimelineEvent } from "@/types/case";

interface CaseActivityProps {
  timeline: TimelineEvent[];
}

const CaseActivity: React.FC<CaseActivityProps> = ({ timeline }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Case Timeline</CardTitle>
        <CardDescription>Chronological activity log</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l border-forensic-200">
          {timeline.map((event, index) => (
            <div key={index} className="mb-6 relative">
              <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full border-2 border-forensic-accent bg-white"></div>
              <div>
                <p className="text-sm text-forensic-500">{event.date}</p>
                <p className="font-medium mt-0.5">{event.event}</p>
                <p className="text-sm text-forensic-600 mt-0.5">
                  By: {event.actor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseActivity;
