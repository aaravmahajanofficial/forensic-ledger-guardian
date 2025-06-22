import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, Mail, LifeBuoy, BookOpen } from "lucide-react";

const faqData = [
  {
    value: "item-1",
    question: "What is Forensic Ledger Guardian and how does it work?",
    answer: [
      "Forensic Ledger Guardian is a blockchain-based platform designed for secure management, verification, and tracking of digital forensic evidence. It ensures the integrity and chain of custody of evidence through cryptographic verification and immutable record-keeping.",
      "The platform works by creating cryptographic hashes of evidence files and recording these hashes on a blockchain ledger, allowing for tamper-evident storage and verification. Each access or transfer of evidence is recorded, creating a complete and verifiable chain of custody.",
    ],
  },
  {
    value: "item-2",
    question: "How does blockchain ensure the integrity of evidence?",
    answer: [
      "Blockchain technology ensures evidence integrity through several mechanisms:",
      {
        type: "list",
        items: [
          "**Immutability:** Once data is recorded on the blockchain, it cannot be altered or deleted without detection.",
          "**Cryptographic Verification:** Evidence files are hashed using secure algorithms, and these hashes are stored on the blockchain. Any change to the original file would result in a different hash, immediately flagging tampering.",
          "**Distributed Consensus:** Multiple nodes verify and agree on the state of the ledger, making it extremely difficult to manipulate records.",
          "**Timestamping:** All actions are timestamped and recorded in chronological order, providing a verifiable timeline of evidence handling.",
        ],
      },
      "These features combine to create a system where evidence integrity can be mathematically verified, significantly strengthening the admissibility and reliability of digital evidence in court.",
    ],
  },
  {
    value: "item-3",
    question: "What user roles are available in the system?",
    answer: [
      "Forensic Ledger Guardian supports the following user roles, each with specific permissions and capabilities:",
      {
        type: "list",
        items: [
          "**Court:** Administrative oversight of all cases and evidence. Can create cases, assign users to cases, and has final verification authority.",
          "**Officer:** Can file First Information Reports (FIRs), collect and submit evidence, and manage case information within their jurisdiction.",
          "**Forensic Investigator:** Specialized in analyzing and verifying digital evidence. Can perform technical analysis and certification of evidence integrity.",
          "**Lawyer:** Can access case evidence, prepare legal documentation, and verify chain of custody for court proceedings.",
        ],
      },
    ],
  },
  {
    value: "item-4",
    question: "How do I upload and verify evidence?",
    answer: [
      "To upload evidence to the Forensic Ledger Guardian system:",
      {
        type: "ordered-list",
        items: [
          "Navigate to the Upload page from your dashboard.",
          "Select the case to which the evidence belongs.",
          "Choose the evidence files from your device.",
          "Add required metadata such as description, collection details, etc.",
          "Submit the evidence for processing.",
        ],
      },
      "The system will then:",
      {
        type: "list",
        items: [
          "Generate cryptographic hashes of the files.",
          "Record these hashes to the blockchain.",
          "Store the evidence securely.",
          "Create an initial chain of custody record.",
        ],
      },
    ],
  },
  {
    value: "item-5",
    question: "How is the chain of custody maintained?",
    answer: [
      "Forensic Ledger Guardian maintains a comprehensive chain of custody through:",
      {
        type: "list",
        items: [
          "**Access Logging:** Every access to evidence is logged with user information, timestamp, and action taken.",
          "**Transfer Records:** When evidence custody changes hands, both the transferring and receiving parties must digitally sign the transaction.",
          "**Blockchain Verification:** Each custody event is recorded on the blockchain with a unique transaction ID for verification.",
        ],
      },
    ],
  },
];

const FaqContent = ({ content }: { content: (string | { type: string; items: string[] })[] }) => (
  <div className="prose prose-sm max-w-none text-muted-foreground">
    {content.map((item, index) => {
      if (typeof item === "string") {
        return <p key={index}>{item}</p>;
      }
      if (item.type === "list") {
        return (
          <ul key={index} className="list-disc pl-5 space-y-1">
            {item.items.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
          </ul>
        );
      }
      if (item.type === "ordered-list") {
        return (
          <ol key={index} className="list-decimal pl-5 space-y-1">
            {item.items.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
          </ol>
        );
      }
      return null;
    })}
  </div>
);

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqData.filter(({ question, answer }) => {
    const query = searchTerm.toLowerCase();
    if (!query) return true;
    const answerText = answer.map(item => typeof item === 'string' ? item : item.items.join(' ')).join(' ');
    return question.toLowerCase().includes(query) || answerText.toLowerCase().includes(query);
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      <header className="text-center mb-12">
        <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">Help & Support Center</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find answers, guides, and support. We&apos;re here to help you.
        </p>
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-base h-12 rounded-full bg-input border-border/60 focus:ring-primary"
          />
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold tracking-tight text-primary mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value} className="border-border/40 bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <FaqContent content={faq.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <aside className="space-y-8">
          <Card className="border-border/40 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <LifeBuoy className="h-6 w-6 mr-3 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>Can&apos;t find the answer? Our team is here to help.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              <p className="text-xs text-center text-muted-foreground">24/7 availability, avg. response time: 2 hours</p>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BookOpen className="h-6 w-6 mr-3 text-primary" />
                Documentation
              </CardTitle>
              <CardDescription>Explore in-depth guides and tutorials.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Go to Docs</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default FAQ;
