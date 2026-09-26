import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gavel,
  Calendar,
  Users,
  Clock,
  FileText,
  Download,
  Copy,
} from "lucide-react";
import { DocumentItem, useCourtPreparationActions } from "./CourtPreparationActions";
import { getStatusBadge } from "./courtPreparationData";

interface CourtPreparationDocumentsTabProps {
  documents: DocumentItem[];
  actions: ReturnType<typeof useCourtPreparationActions>;
}

export const CourtPreparationDocumentsTab: React.FC<
  CourtPreparationDocumentsTabProps
> = ({ documents, actions }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legal Documents</CardTitle>
          <CardDescription>
            Court filings and case documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="font-medium">{document.title}</div>
                    <div className="text-xs text-forensic-500">
                      {document.id}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(document.type)}</TableCell>
                  <TableCell className="text-sm text-forensic-600">
                    {new Date(document.created).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actions.editDocument(document)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-forensic-court hover:bg-forensic-court/90"
                        onClick={() => actions.downloadDocument(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-forensic-50 border-t border-forensic-100 flex justify-between">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => actions.navigateTo("/legal/documentation")}
          >
            <FileText className="h-4 w-4" />
            <span>Add Document</span>
          </Button>
          <Button
            className="bg-forensic-court hover:bg-forensic-court/90 flex items-center gap-2"
            onClick={() => actions.createDocument("Template")}
          >
            <Copy className="h-4 w-4" />
            <span>Create from Template</span>
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-forensic-court" />
              Witness Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Client Testimony Preparation
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Testimony preparation session</span>
                      <Badge className="bg-forensic-warning text-forensic-900">
                        Scheduled
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm gap-2">
                      <Calendar className="h-4 w-4 text-forensic-500" />
                      <span>April 25, 2025 - 2:00 PM</span>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => actions.viewPreparationNotes()}
                    >
                      View Preparation Notes
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Expert Witness Documentation
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Technical Expert Testimony</span>
                      <Badge className="bg-forensic-success text-white">
                        Confirmed
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm gap-2">
                      <Users className="h-4 w-4 text-forensic-500" />
                      <span>
                        Dr. Michael Reynolds - Cybersecurity Expert
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => actions.viewExpertReport()}
                    >
                      View Expert Report
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Character Witness Statements
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Character Witness Collection</span>
                      <Badge className="bg-forensic-400/20 text-forensic-600">
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm gap-2">
                      <Clock className="h-4 w-4 text-forensic-500" />
                      <span>2 of 4 statements collected</span>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => actions.viewWitnessStatements()}
                    >
                      View Collected Statements
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="border-t border-forensic-100">
            <Button
              className="w-full bg-forensic-court hover:bg-forensic-court/90"
              onClick={() => actions.scheduleWitnessMeeting()}
            >
              Schedule Witness Preparation
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Gavel className="h-5 w-5 mr-2 text-forensic-court" />
              Court Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-forensic-200 rounded-md bg-forensic-50">
              <h4 className="font-medium mb-2">Key Defense Points</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                  <span>
                    Lack of proper procedure in evidence collection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                  <span>Inconsistent timestamps in digital evidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                  <span>
                    Missing chain of custody for critical evidence
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                  <span>
                    Physical access limitations disprove allegations
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Case Strategy Documents</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() =>
                    actions.viewStrategyDocument("Opening Statement Draft")
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Opening Statement Draft</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() =>
                    actions.viewStrategyDocument(
                      "Cross-Examination Strategy",
                    )
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Cross-Examination Strategy</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() =>
                    actions.viewStrategyDocument(
                      "Closing Arguments Outline",
                    )
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Closing Arguments Outline</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-forensic-100">
            <Button
              className="w-full bg-forensic-court hover:bg-forensic-court/90"
              onClick={() => actions.updateStrategyBrief()}
            >
              Update Strategy Brief
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
