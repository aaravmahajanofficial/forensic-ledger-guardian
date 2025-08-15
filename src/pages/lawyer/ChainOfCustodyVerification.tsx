
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileLock2, 
  Search, 
  FileDigit, 
  ArrowRight, 
  Check,
  Clock,
  Calendar,
  User,
  FileCheck,
  Download,
  Printer,
  Share2,
  FileText,
  Shield,
  Lock,
  History
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useEvidenceManager, EvidenceItem } from '@/hooks/useEvidenceManager';
import ChainOfCustody from '@/components/chainOfCustody/ChainOfCustody';

type CustodyEvent = {
  actor: string;
  action: string;
  timestamp: string;
  notes?: string;
  verified: boolean;
};

const ChainOfCustodyVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const evidenceIdParam = searchParams.get('evidenceId');
  
  const [evidenceId, setEvidenceId] = useState(evidenceIdParam || '');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [custodyChain, setCustodyChain] = useState<CustodyEvent[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  
  const { evidence, verifyEvidence } = useEvidenceManager();
  
  useEffect(() => {
    if (evidenceIdParam && evidenceIdParam !== evidenceId) {
      setEvidenceId(evidenceIdParam);
    }
  }, [evidenceId, evidenceIdParam]);
  
  useEffect(() => {
    if (evidenceId) {
      const found = evidence.find(item => item.id === evidenceId);
      if (found) {
        setSelectedEvidence(found);
        
        // Generate chain of custody events
        const mockChain: CustodyEvent[] = [
          {
            actor: "Officer Johnson",
            action: "Collection",
            timestamp: new Date(found.submittedDate).toISOString(),
            notes: "Initial collection of evidence",
            verified: true
          },
          {
            actor: "Evidence Technician Smith",
            action: "Processing",
            timestamp: new Date(new Date(found.submittedDate).getTime() + 3600000).toISOString(),
            notes: "Evidence documented and prepared for analysis",
            verified: true
          },
          {
            actor: "Forensic Analyst Chen",
            action: "Analysis",
            timestamp: new Date(new Date(found.submittedDate).getTime() + 86400000).toISOString(),
            verified: true
          }
        ];
        
        // Add verification event if the evidence is verified
        if (found.verified) {
          mockChain.push({
            actor: "Verification System",
            action: "Digital Verification",
            timestamp: new Date().toISOString(),
            notes: "Blockchain verification completed",
            verified: true
          });
        }
        
        setCustodyChain(mockChain);
      } else {
        setSelectedEvidence(null);
        setCustodyChain([]);
      }
    }
  }, [evidenceId, evidence]);
  
  const handleSearch = () => {
    if (!evidenceId.trim()) {
      toast({
        title: "Please enter an evidence ID",
        variant: "destructive"
      });
      return;
    }
    
    const found = evidence.find(item => item.id === evidenceId);
    if (!found) {
      toast({
        title: "Evidence not found",
        description: "No evidence found with that ID",
        variant: "destructive"
      });
      setSelectedEvidence(null);
      setCustodyChain([]);
    }
    // The useEffect will handle setting the evidence and chain
  };
  
  const handleVerifyEvidence = async () => {
    if (!selectedEvidence) return;
    
    setIsVerifying(true);
    setVerificationProgress(0);
    
    // Simulate verification progress
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeVerification();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    const completeVerification = async () => {
      // Perform actual verification
      const success = await verifyEvidence(selectedEvidence.id);
      
      if (success) {
        toast({
          title: "Verification Successful",
          description: "Evidence has been verified on the blockchain",
        });
        
        // Update the custody chain with a new verification event
        setCustodyChain(prev => [...prev, {
          actor: "Lawyer Verification",
          action: "Legal Verification",
          timestamp: new Date().toISOString(),
          notes: "Evidence verified by legal counsel",
          verified: true
        }]);
        
        // Update selected evidence to show verified status
        const updatedEvidence = evidence.find(item => item.id === selectedEvidence.id);
        if (updatedEvidence) {
          setSelectedEvidence(updatedEvidence);
        }
      } else {
        toast({
          title: "Verification Failed",
          description: "Could not verify the evidence",
          variant: "destructive"
        });
      }
      
      setIsVerifying(false);
    };
  };
  
  const handlePrint = () => {
    toast({
      title: "Printing Chain of Custody",
      description: "Preparing chain of custody report for printing"
    });
    window.print();
  };
  
  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "Downloading chain of custody report as PDF"
    });
    
    // In a real implementation, this would generate a PDF
    setTimeout(() => {
      const filename = `custody-chain-${selectedEvidence?.id}-${new Date().toISOString().split('T')[0]}.pdf`;
      toast({
        title: "Download Complete",
        description: `Report saved as ${filename}`
      });
    }, 1500);
  };
  
  const handleExport = () => {
    toast({
      title: "Exporting Chain of Custody",
      description: "Preparing chain of custody for export"
    });
    
    // In a real implementation, this would export the data
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Chain of custody data has been exported"
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">Chain of Custody Verification</h1>
        <Button 
          variant="outline"
          onClick={() => navigate('/evidence')}
        >
          Back to Evidence
        </Button>
      </div>
      
      <Card className="border border-forensic-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileLock2 className="mr-2 h-5 w-5 text-forensic-court" />
            Chain of Custody Search
          </CardTitle>
          <CardDescription>
            Search for an evidence item to view its complete chain of custody
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="space-y-2 flex-1">
              <label htmlFor="evidenceId" className="text-sm font-medium text-forensic-700">
                Evidence ID
              </label>
              <Input
                id="evidenceId"
                value={evidenceId}
                onChange={(e) => setEvidenceId(e.target.value)}
                placeholder="Enter evidence ID (e.g., EV-104-002)"
                className="border-forensic-200"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-forensic-court hover:bg-forensic-court/90 w-full md:w-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-forensic-600">
            <p className="flex items-center">
              <History className="h-4 w-4 mr-1 text-forensic-court" />
              Recently searched: 
              {evidence.slice(0, 2).map((item, index) => (
                <span 
                  key={item.id} 
                  className="mx-1 cursor-pointer hover:text-forensic-court hover:underline"
                  onClick={() => setEvidenceId(item.id)}
                >
                  {item.id}{index < 1 ? "," : ""}
                </span>
              ))}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {selectedEvidence && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileDigit className="mr-2 h-5 w-5 text-forensic-evidence" />
                  Evidence Details
                </CardTitle>
                {selectedEvidence.verified ? (
                  <Badge className="bg-forensic-success/20 text-forensic-success">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-forensic-warning/20 text-forensic-warning">
                    Unverified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-forensic-500">Evidence ID</div>
                    <div className="font-medium">{selectedEvidence.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-forensic-500">Name</div>
                    <div className="font-medium">{selectedEvidence.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-forensic-500">Case ID</div>
                    <div className="font-medium text-forensic-court hover:underline cursor-pointer" onClick={() => navigate(`/cases/${selectedEvidence.caseId}`)}>
                      {selectedEvidence.caseId}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-forensic-500">Submitted By</div>
                    <div className="font-medium">{selectedEvidence.submittedBy}</div>
                  </div>
                  <div>
                    <div className="text-sm text-forensic-500">Submission Date</div>
                    <div className="font-medium">
                      {new Date(selectedEvidence.submittedDate).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-forensic-500">File Hash</div>
                    <div className="font-mono text-xs bg-forensic-50 p-1 rounded border border-forensic-100 truncate">
                      {selectedEvidence.hash || "Hash not available"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-forensic-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileLock2 className="mr-2 h-5 w-5 text-forensic-court" />
                Chain of Custody Timeline
              </CardTitle>
              <CardDescription>
                Complete chronological record of evidence handling and transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isVerifying ? (
                <div className="py-8 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Verification in progress</span>
                    <span>{verificationProgress}%</span>
                  </div>
                  <div className="h-2 bg-forensic-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-forensic-court rounded-full transition-all duration-300 ease-in-out" 
                      style={{ width: `${verificationProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-forensic-600 text-center">
                    Verifying evidence integrity on blockchain...
                  </p>
                </div>
              ) : (
                <ChainOfCustody 
                  evidenceId={selectedEvidence.id}
                  caseId={selectedEvidence.caseId}
                  events={custodyChain.map((event, index) => ({
                    id: `${index + 1}`,
                    type: event.action === 'Collection' 
                      ? 'upload' 
                      : event.action === 'Processing' 
                        ? 'modify' 
                        : event.action === 'Analysis' 
                          ? 'access' 
                          : 'verify',
                    timestamp: event.timestamp,
                    user: {
                      name: event.actor,
                      role: event.actor.includes('Officer') 
                        ? 'Officer' 
                        : event.actor.includes('Technician') 
                          ? 'Forensic' 
                          : event.actor.includes('Verification') 
                            ? 'Court' 
                            : 'Forensic',
                      initials: event.actor.split(' ').map(n => n[0]).join('')
                    },
                    details: event.notes || `${event.action} of evidence`,
                    transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
                  }))}
                />
              )}
            </CardContent>
            <CardFooter className="border-t border-forensic-100 bg-forensic-50 flex justify-between flex-wrap gap-2">
              {!selectedEvidence.verified && !isVerifying && (
                <Button
                  onClick={handleVerifyEvidence}
                  className="bg-forensic-court hover:bg-forensic-court/90"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Verify Evidence
                </Button>
              )}
              
              {selectedEvidence.verified && (
                <Button
                  variant="outline"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              )}
              
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isVerifying}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  className="bg-forensic-court hover:bg-forensic-court/90"
                  onClick={handleExport}
                  disabled={isVerifying}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blockchain Verification</CardTitle>
              <CardDescription>
                Cryptographic proof of evidence integrity and chain of custody
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-forensic-50 rounded-md border border-forensic-100">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileCheck className="h-4 w-4 mr-2 text-forensic-success" />
                    Blockchain Record
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-forensic-500">Transaction Hash</div>
                      <div className="font-mono text-xs truncate">
                        {selectedEvidence.hash || "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-forensic-500">Block Number</div>
                      <div className="font-mono text-xs">{Math.floor(Math.random() * 9000000) + 1000000}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-forensic-500">
                    This evidence has been cryptographically secured on the blockchain, ensuring its authenticity and immutability.
                  </div>
                </div>
                
                {selectedEvidence.verified ? (
                  <div className="p-4 bg-forensic-success/10 border border-forensic-success/30 rounded-md">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-forensic-success mr-2" />
                      <h3 className="font-medium text-forensic-success">Verification Successful</h3>
                    </div>
                    <p className="mt-1 text-sm">
                      This evidence has been cryptographically verified on the blockchain. The chain of custody is complete and intact.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-forensic-warning/10 border border-forensic-warning/30 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-forensic-warning mr-2" />
                      <h3 className="font-medium text-forensic-warning">Verification Pending</h3>
                    </div>
                    <p className="mt-1 text-sm">
                      This evidence has not been fully verified on the blockchain. Complete the verification process to ensure chain of custody integrity.
                    </p>
                    <Button 
                      className="mt-2 bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900"
                      onClick={handleVerifyEvidence}
                      disabled={isVerifying}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Verify Evidence Now
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ChainOfCustodyVerification;
