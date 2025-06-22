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
import { BookOpen, HelpCircle, MessageSquare, Mail, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "What is Forensic Ledger Guardian?",
    answer:
      "Forensic Ledger Guardian is a blockchain-based digital evidence management system that ensures the integrity and chain of custody of forensic evidence through cryptographic verification and decentralized storage.",
  },
  {
    question: "How do I submit new evidence?",
    answer:
      "Navigate to the 'Upload' page from the main navigation. You can upload digital evidence files, which will be hashed and stored securely. The system will guide you through providing necessary metadata and case information.",
  },
  {
    question: "How can I verify the integrity of an evidence file?",
    answer:
      "Use the 'Verify' page to check evidence integrity. You can upload a file to compare its hash with the one recorded on the blockchain, or you can browse existing evidence and view its verification history.",
  },
  {
    question: "Who can access the evidence I upload?",
    answer:
      "Access control is managed on a per-case basis. Only users who have been granted specific permissions for a case (e.g., investigating officers, lawyers, forensic analysts) can view or interact with its associated evidence.",
  },
  {
    question: "What happens if I forget my password?",
    answer:
      "You can use the 'Forgot Password' link on the login page to initiate a password reset process. A secure link will be sent to your registered email address.",
  },
];

const Help = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in bg-background text-foreground">
      <header className="flex items-center gap-4">
        <HelpCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Help & Support Center
          </h1>
          <p className="text-muted-foreground">
            Find answers, guides, and contact information.
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions about the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-8">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
              <CardDescription>
                Learn how to use the system effectively.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access comprehensive guides and tutorials on using Forensic
                Ledger Guardian for evidence management.
              </p>
              <Button className="w-full">View Documentation</Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Get assistance from our expert team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our support team for any technical issues or questions
                about the platform.
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default Help;
