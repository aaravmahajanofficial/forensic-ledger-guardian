import React from "react";
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
import { HelpCircle, Search, Mail } from "lucide-react";

const FAQ = () => {
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-forensic-800 mb-6 flex items-center">
        <HelpCircle className="mr-2 h-6 w-6 text-forensic-accent" />
        Frequently Asked Questions
      </h1>

      {/* Search */}
      <div className="relative max-w-lg mx-auto mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-forensic-500" />
        <Input
          placeholder="Search for answers..."
          className="pl-10 pr-4 py-6 border-forensic-200"
        />
      </div>

      {/* FAQ Accordions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-forensic-accent" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find answers to common questions about the Forensic Ledger platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                What is ForensicLedger and how does it work?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  ForensicLedger is a blockchain-based platform designed for
                  secure management, verification, and tracking of digital
                  forensic evidence. It ensures the integrity and chain of
                  custody of evidence through cryptographic verification and
                  immutable record-keeping.
                </p>
                <p>
                  The platform works by creating cryptographic hashes of
                  evidence files and recording these hashes on a blockchain
                  ledger, allowing for tamper-evident storage and verification.
                  Each access or transfer of evidence is recorded, creating a
                  complete and verifiable chain of custody.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How does blockchain ensure the integrity of evidence?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Blockchain technology ensures evidence integrity through
                  several mechanisms:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-2">
                  <li>
                    <strong>Immutability:</strong> Once data is recorded on the
                    blockchain, it cannot be altered or deleted without
                    detection.
                  </li>
                  <li>
                    <strong>Cryptographic Verification:</strong> Evidence files
                    are hashed using secure algorithms, and these hashes are
                    stored on the blockchain. Any change to the original file
                    would result in a different hash, immediately flagging
                    tampering.
                  </li>
                  <li>
                    <strong>Distributed Consensus:</strong> Multiple nodes
                    verify and agree on the state of the ledger, making it
                    extremely difficult to manipulate records.
                  </li>
                  <li>
                    <strong>Timestamping:</strong> All actions are timestamped
                    and recorded in chronological order, providing a verifiable
                    timeline of evidence handling.
                  </li>
                </ul>
                <p>
                  These features combine to create a system where evidence
                  integrity can be mathematically verified, significantly
                  strengthening the admissibility and reliability of digital
                  evidence in court.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                What user roles are available in the system?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  ForensicLedger supports the following user roles, each with
                  specific permissions and capabilities:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Court:</strong> Administrative oversight of all
                    cases and evidence. Can create cases, assign users to cases,
                    and has final verification authority.
                  </li>
                  <li>
                    <strong>Officer:</strong> Can file First Information Reports
                    (FIRs), collect and submit evidence, and manage case
                    information within their jurisdiction.
                  </li>
                  <li>
                    <strong>Forensic Investigator:</strong> Specialized in
                    analyzing and verifying digital evidence. Can perform
                    technical analysis and certification of evidence integrity.
                  </li>
                  <li>
                    <strong>Lawyer:</strong> Can access case evidence, prepare
                    legal documentation, and verify chain of custody for court
                    proceedings.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                How do I upload and verify evidence?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  To upload evidence to the ForensicLedger system:
                </p>
                <ol className="list-decimal pl-5 space-y-2 mb-2">
                  <li>Navigate to the Upload page from your dashboard</li>
                  <li>Select the case to which the evidence belongs</li>
                  <li>Choose the evidence files from your device</li>
                  <li>
                    Add required metadata such as description, collection
                    details, etc.
                  </li>
                  <li>Submit the evidence for processing</li>
                </ol>
                <p className="mb-2">The system will then:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Generate cryptographic hashes of the files</li>
                  <li>Record these hashes to the blockchain</li>
                  <li>Store the evidence securely</li>
                  <li>Create an initial chain of custody record</li>
                </ul>
                <p className="mb-2">To verify evidence integrity:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to the Verify page</li>
                  <li>
                    Either upload the file to verify or select from existing
                    evidence
                  </li>
                  <li>
                    The system will re-hash the file and compare it against the
                    blockchain record
                  </li>
                  <li>
                    Results will show if the evidence matches the original
                    record
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                How is the chain of custody maintained?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  ForensicLedger maintains a comprehensive chain of custody
                  through:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Access Logging:</strong> Every access to evidence is
                    logged with user information, timestamp, and action taken.
                  </li>
                  <li>
                    <strong>Transfer Records:</strong> When evidence custody
                    changes hands, both the transferring and receiving parties
                    must digitally sign the transaction.
                  </li>
                  <li>
                    <strong>Blockchain Verification:</strong> Each custody event
                    is recorded on the blockchain with a unique transaction ID
                    for verification.
                  </li>
                  <li>
                    <strong>Automated Timeline:</strong> The system creates a
                    chronological timeline of all evidence interactions that can
                    be exported for court proceedings.
                  </li>
                  <li>
                    <strong>Role-Based Actions:</strong> Different user roles
                    have specific actions they can perform with evidence, all of
                    which are tracked.
                  </li>
                  <li>
                    <strong>Digital Signatures:</strong> Cryptographic
                    signatures verify the identity of users performing each
                    action in the chain.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                Is my data secure on ForensicLedger?
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Yes, ForensicLedger implements multiple layers of security to
                  protect evidence and case data:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Encryption:</strong> All evidence files are
                    encrypted both in transit and at rest.
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Strict role-based access
                    controls ensure users can only access information relevant
                    to their role and assigned cases.
                  </li>
                  <li>
                    <strong>Blockchain Security:</strong> The immutable nature
                    of blockchain prevents tampering with evidence records.
                  </li>
                  <li>
                    <strong>Multi-factor Authentication:</strong> User accounts
                    are protected with multi-factor authentication.
                  </li>
                  <li>
                    <strong>Audit Logging:</strong> Comprehensive audit logs
                    track all system activities.
                  </li>
                  <li>
                    <strong>Secure Infrastructure:</strong> The platform is
                    hosted in high-security data centers with multiple
                    redundancies and security protocols.
                  </li>
                  <li>
                    <strong>Regular Security Audits:</strong> The system
                    undergoes regular security audits and penetration testing.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-forensic-court" />
            Didn't Find Your Answer?
          </CardTitle>
          <CardDescription>
            Our support team is ready to assist you with any questions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input placeholder="Enter your email address" className="mb-2" />
            <button className="w-full bg-forensic-court text-white py-2 rounded hover:bg-forensic-court/90">
              Contact Support
            </button>
          </div>
          <div className="text-center md:text-right md:w-1/2">
            <p className="text-forensic-600 text-sm">
              Average response time:{" "}
              <span className="font-medium">2 hours</span>
            </p>
            <p className="text-forensic-500 text-sm">Support hours: 24/7</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
