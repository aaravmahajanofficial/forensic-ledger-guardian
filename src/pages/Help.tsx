import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, HelpCircle, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Help = () => {
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-forensic-800 mb-6 flex items-center">
        <HelpCircle className="mr-2 h-6 w-6 text-forensic-accent" />
        Help & Support
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-forensic-evidence" />
              Documentation
            </CardTitle>
            <CardDescription>Learn how to use the system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-forensic-600 mb-4">
              Access comprehensive guides and tutorials on using ForensicLedger
              for evidence management.
            </p>
            <Button className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90 flex items-center justify-center">
              <span>View Documentation</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-forensic-court" />
              Support
            </CardTitle>
            <CardDescription>Get assistance from our team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-forensic-600 mb-4">
              Contact our support team for any technical issues or questions
              about the platform.
            </p>
            <Button className="w-full bg-forensic-court hover:bg-forensic-court/90 flex items-center justify-center">
              <span>Contact Support</span>
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is ForensicLedger?</AccordionTrigger>
              <AccordionContent>
                ForensicLedger is a blockchain-based digital evidence management
                system that ensures the integrity and chain of custody of
                forensic evidence through cryptographic verification and
                decentralized storage.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I submit evidence?</AccordionTrigger>
              <AccordionContent>
                Navigate to the Upload page from the main navigation. You can
                upload digital evidence files, which will be hashed and stored
                securely. The system will guide you through providing necessary
                metadata and case information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                How can I verify evidence integrity?
              </AccordionTrigger>
              <AccordionContent>
                Use the Verify page to check evidence integrity. You can upload
                a file to compare its hash with the one recorded on the
                blockchain, or you can browse existing evidence and view its
                complete chain of custody history.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                What roles are available in the system?
              </AccordionTrigger>
              <AccordionContent>
                The system supports four main roles: Court (administrator),
                Officer (law enforcement), Forensic (technical specialist), and
                Lawyer (legal representative). Each role has specific
                permissions and workflows tailored to their responsibilities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                How does the blockchain ensure evidence integrity?
              </AccordionTrigger>
              <AccordionContent>
                When evidence is uploaded, a cryptographic hash is generated and
                stored on the blockchain. This hash acts as a digital
                fingerprint that can later be used to verify the file
                hasn&apos;t been altered. Additionally, all access to evidence
                is recorded in an immutable chain of custody log.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
