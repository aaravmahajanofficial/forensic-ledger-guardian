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
  FileCheck,
  Clock,
  CheckCircle2,
  Download,
  Presentation,
  Play,
  UploadCloud,
} from "lucide-react";
import { EvidenceItem, useCourtPreparationActions } from "./CourtPreparationActions";
import { getStatusBadge } from "./courtPreparationData";

interface CourtPreparationEvidenceTabProps {
  evidenceItems: EvidenceItem[];
  setEvidenceItems: React.Dispatch<React.SetStateAction<EvidenceItem[]>>;
  actions: ReturnType<typeof useCourtPreparationActions>;
}

export const CourtPreparationEvidenceTab: React.FC<
  CourtPreparationEvidenceTabProps
> = ({ evidenceItems, setEvidenceItems, actions }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evidence Preparation</CardTitle>
          <CardDescription>
            Prepare and organize verified evidence for court presentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidence ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead>Court Ready</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidenceItems.map((evidence) => (
                <TableRow key={evidence.id}>
                  <TableCell className="font-medium">{evidence.id}</TableCell>
                  <TableCell>{evidence.name}</TableCell>
                  <TableCell>
                    {evidence.type === "log" && (
                      <Badge className="bg-forensic-accent/20 text-forensic-accent">
                        Log
                      </Badge>
                    )}
                    {evidence.type === "email" && (
                      <Badge className="bg-forensic-evidence/20 text-forensic-evidence">
                        Email
                      </Badge>
                    )}
                    {evidence.type === "video" && (
                      <Badge className="bg-forensic-warning/20 text-forensic-warning">
                        Video
                      </Badge>
                    )}
                    {evidence.type === "report" && (
                      <Badge className="bg-forensic-court/20 text-forensic-court">
                        Report
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(evidence.status)}</TableCell>
                  <TableCell className="text-sm text-forensic-600">
                    {new Date(evidence.added).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {evidence.prepared ? (
                      <Badge className="bg-forensic-success/20 text-forensic-success">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Ready
                      </Badge>
                    ) : (
                      <Badge className="bg-forensic-400/20 text-forensic-600">
                        Not Ready
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => actions.previewEvidence(evidence)}
                      >
                        <Play className="h-3 w-3" />
                        <span>Preview</span>
                      </Button>
                      {evidence.prepared ? (
                        <Button
                          size="sm"
                          className="bg-forensic-accent hover:bg-forensic-accent/90"
                          onClick={() => actions.downloadEvidence(evidence)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900"
                          onClick={() =>
                            actions.prepareEvidence(
                              evidenceItems,
                              setEvidenceItems,
                              evidence.id,
                            )
                          }
                        >
                          Prepare
                        </Button>
                      )}
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
            onClick={() => actions.navigateTo("/evidence")}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Add Evidence</span>
          </Button>
          <Button
            className="bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-2"
            onClick={() => actions.preparePresentation()}
          >
            <Presentation className="h-4 w-4" />
            <span>Prepare Presentation</span>
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-forensic-accent" />
              Chain of Custody
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {evidenceItems.map((evidence) => (
                <AccordionItem key={evidence.id} value={evidence.id}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <span className="font-medium">
                        {evidence.id}: {evidence.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(evidence.status)}
                        {evidence.prepared && (
                          <Badge className="bg-forensic-success/20 text-forensic-success">
                            Court Ready
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 py-2">
                      <p className="text-sm text-forensic-600">
                        This evidence has a complete and verified chain of
                        custody with
                        {evidence.id === "EV-2023-380" ? " 5" : " 3"}{" "}
                        recorded transfers.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full text-forensic-accent"
                        onClick={() =>
                          actions.navigateTo(
                            `/verify/custody?evidenceId=${evidence.id}`,
                          )
                        }
                      >
                        View Complete Chain
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter className="border-t border-forensic-100">
            <Button
              className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90"
              onClick={() => actions.generateChainOfCustodyReport()}
            >
              Generate Chain of Custody Report
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Presentation className="h-5 w-5 mr-2 text-forensic-court" />
              Evidence Presentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-forensic-600">
              Create courtroom presentation materials for effective evidence
              display
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-forensic-success" />
                <span className="text-sm">Evidence chronology timeline</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-forensic-success" />
                <span className="text-sm">Technical evidence summary</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-forensic-success" />
                <span className="text-sm">Chain of custody verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-forensic-warning" />
                <span className="text-sm">Video evidence highlight reel</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-forensic-warning" />
                <span className="text-sm">Key evidence visual aids</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-forensic-100">
            <Button
              className="w-full bg-forensic-court hover:bg-forensic-court/90"
              onClick={() => actions.preparePresentation()}
            >
              Create Presentation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
