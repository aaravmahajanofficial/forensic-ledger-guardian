
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabaseClient';
import { 
  FileDigit, 
  Search, 
  Filter,
  ArrowUpDown,
  FileCheck,
  FileX,
  Eye,
  Download,
  FileLock2,
  RefreshCcw,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEvidenceManager, EvidenceItem } from '@/hooks/useEvidenceManager';

// Format evidence type for display
const formatType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const Evidence = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCaseId = queryParams.get('caseId') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [caseFilter, setCaseFilter] = useState(initialCaseId);
  const [sortOrder, setSortOrder] = useState('newest');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { evidence, loading, refreshEvidence, downloadEvidence } = useEvidenceManager();

  // Get unique case IDs for the filter dropdown
  const uniqueCaseIds = [...new Set(evidence.map(item => item.caseId))];

  // Filter evidence based on search and filters
  const filteredEvidence = evidence
    .filter(item => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.caseId.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(item => {
      // Type filter
      if (typeFilter === 'all') return true;
      return item.type === typeFilter;
    })
    .filter(item => {
      // Case filter
      if (caseFilter === 'all') return true;
      return item.caseId === caseFilter;
    })
    .sort((a, b) => {
      // Sort order
      const dateA = new Date(a.submittedDate).getTime();
      const dateB = new Date(b.submittedDate).getTime();
      
      switch(sortOrder) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Update URL when case filter changes
  const handleCaseFilterChange = (value: string) => {
    setCaseFilter(value);
    if (value === 'all') {
      navigate('/evidence');
    } else {
      navigate(`/evidence?caseId=${value}`);
    }
  };

  const handleView = (evidence: EvidenceItem) => {
    toast({
      title: "Viewing Evidence",
      description: `Viewing ${evidence.name}`
    });
  };

  const handleVerify = async (evidence: EvidenceItem) => {
    // Show loading toast
    // toast({
    //   title: "Verifying Evidence",
    //   description: `Checking integrity for ${evidence.name}...`,
    //   className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
    // });

    try {
      // Fetch key_encrypted, iv_encrypted, and hash_original from Supabase
      const { data, error } = await supabase
        .from('evidence1')
        .select('key_encrypted, iv_encrypted, hash_original, cid')
        .eq('container_id', evidence.caseId)
        .eq('evidence_id', evidence.id)
        .single();

      if (error || !data) {
        toast({
          title: "Verification Failed",
          description: "Failed to fetch evidence keys from database.",
          variant: "destructive",
          className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
        });
        return;
      }

      // Download encrypted file from IPFS
      const pinataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${data.cid}`;
      const response = await fetch(pinataGatewayUrl);
      if (!response.ok) {
        toast({
          title: "Verification Failed",
          description: `Failed to download evidence: ${response.statusText}`,
          variant: "destructive",
          className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
        });
        return;
      }
      const encryptedBlob = await response.blob();
      const encryptedArrayBuffer = await encryptedBlob.arrayBuffer();

      // Use master password from Vite environment variable only (frontend)
      const masterPassword = import.meta.env.VITE_MASTER_PASSWORD;
      if (!masterPassword) {
        toast({
          title: "Verification Failed",
          description: "VITE_MASTER_PASSWORD not set in environment.",
          variant: "destructive",
          className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
        });
        return;
      }

      // Helper: hex to Uint8Array
      function hexToBytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        return bytes;
      }

      // 1. Hash master password to get key (SHA-256, matches backend)
      async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        return new Uint8Array(hashBuffer);
      }
      const masterKeyBytes = await sha256(masterPassword);
      const iv = hexToBytes(data.iv_encrypted);
      const keyEncrypted = hexToBytes(data.key_encrypted);

      // 2. Decrypt AES key
      const masterKey = await window.crypto.subtle.importKey(
        'raw',
        masterKeyBytes,
        { name: 'AES-CBC', length: 256 },
        false,
        ['decrypt']
      );
      let decryptedKeyBuffer;
      try {
        decryptedKeyBuffer = await window.crypto.subtle.decrypt(
          { name: 'AES-CBC', iv },
          masterKey,
          keyEncrypted
        );
      } catch (err) {
        toast({
          title: "Verification Failed",
          description: "Failed to decrypt AES key. Check master password and key/iv values.",
          variant: "destructive",
          className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
        });
        return;
      }
      const aesKey = await window.crypto.subtle.importKey(
        'raw',
        decryptedKeyBuffer,
        { name: 'AES-CBC', length: 256 },
        false,
        ['decrypt']
      );

      // 3. Decrypt file
      let decryptedFileBuffer;
      try {
        decryptedFileBuffer = await window.crypto.subtle.decrypt(
          { name: 'AES-CBC', iv },
          aesKey,
          encryptedArrayBuffer
        );
      } catch (err) {
        toast({
          title: "Verification Failed",
          description: "Failed to decrypt evidence file. Key/IV may be incorrect.",
          variant: "destructive",
          className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
        });
        return;
      }

      // 4. Integrity verification: compute SHA-256 hash and compare
      async function sha256Hex(buffer) {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
        // Convert ArrayBuffer to hex string
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      const computedHash = await sha256Hex(decryptedFileBuffer);
      if (computedHash !== data.hash_original) {
        toast({
          title: "Integrity Check Failed",
          description: "Evidence file hash does not match. Integrity verification failed.",
          variant: "destructive",
          className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
        });
        return;
      } else {
        console.log("Evidence integrity verified: hash matches Database record.");
        toast({
          title: "Integrity Verified",
          description: `Evidence ${evidence.name} integrity is verified!`,
          className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : "Unknown error during verification.",
        variant: "destructive",
        className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[350px] max-w-full"
      });
    }
  };

  const handleDownload = (evidence: EvidenceItem) => {
    downloadEvidence(evidence);
  };

  const viewChainOfCustody = (evidence: EvidenceItem) => {
    toast({
      title: "Chain of Custody",
      description: `Viewing chain of custody for ${evidence.id}`
    });
    navigate(`/verify/custody?evidenceId=${evidence.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">Evidence Manager</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={refreshEvidence}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            className="bg-forensic-evidence hover:bg-forensic-evidence/90"
            onClick={() => navigate('/upload')}
          >
            Upload Evidence
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-500" />
          <Input
            placeholder="Search evidence..."
            className="pl-8 border-forensic-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Case filter - new */}
        <div className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4 text-forensic-500" />
          <Select value={caseFilter} onValueChange={handleCaseFilterChange}>
            <SelectTrigger className="border-forensic-200">
              <SelectValue placeholder="Filter by case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cases</SelectItem>
              {uniqueCaseIds.map(caseId => (
                <SelectItem key={caseId} value={caseId}>
                  Case #{caseId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-forensic-500" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="border-forensic-200">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="application">Documents</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 justify-end">
          <ArrowUpDown className="h-4 w-4 text-forensic-500" />
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="border-forensic-200 w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="size">Size (Largest)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Evidence List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-forensic-500">Loading evidence data...</p>
          </div>
        ) : filteredEvidence.length > 0 ? (
          filteredEvidence.map((evidence) => (
            <Card key={evidence.id} className="hover:shadow-md transition-all duration-200 border border-forensic-200">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileDigit className="h-5 w-5 text-forensic-evidence" />
                      <h3 className="font-bold text-forensic-800">{evidence.name}</h3>
                      {/* {evidence.verified ? (
                        <Badge className="bg-forensic-success/20 text-forensic-success">
                          <FileCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-forensic-warning/20 text-forensic-warning">
                          <FileX className="h-3 w-3 mr-1" />
                          Unverified
                        </Badge>
                      )} */}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-forensic-600">
                      <span>ID: {evidence.id}</span>
                      <button 
                        className="hover:underline text-forensic-court"
                        onClick={() => navigate(`/cases/${evidence.caseId}`)}
                      >
                        Case: {evidence.caseId}
                      </button>
                      <Badge variant="outline" className="bg-forensic-50">
                        {formatType(evidence.type)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-3 md:mt-0 flex items-center space-x-3">
                    {/* <div className="text-sm text-forensic-500">
                      {formatBytes(evidence.size)}
                    </div> */}
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={() => viewChainOfCustody(evidence)}
                    >
                      <FileLock2 className="h-4 w-4 mr-1" />
                      Chain
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={() => handleDownload(evidence)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    
                    {/* <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={() => handleView(evidence)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button> */}
                    
                    {!evidence.verified && (
                      <Button 
                        size="sm" 
                        className="bg-forensic-evidence hover:bg-forensic-evidence/90 h-8"
                        onClick={() => handleVerify(evidence)}
                      >
                        <FileCheck className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-forensic-500">
                  <span>Submitted by {evidence.submittedBy} on {new Date(evidence.submittedDate).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-forensic-500">No evidence found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setCaseFilter('all');
                navigate('/evidence');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evidence;
