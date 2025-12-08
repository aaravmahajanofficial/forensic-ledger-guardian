
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import ipfsService from '@/services/ipfsService';
import web3Service, { EvidenceType } from '@/services/web3Service';
import { supabase } from '@/lib/supabaseClient';

export type EvidenceItem = {
  id: string;
  name: string;
  type: string;
  caseId: string;
  submittedBy: string;
  submittedDate: string;
  verified: boolean;
  hash?: string;
  cidEncrypted?: string;
  size?: number;
};

export const useEvidenceManager = (caseId?: string) => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [recentActivity, setRecentActivity] = useState<{
    action: 'upload' | 'verify' | 'view',
    evidenceId: string,
    timestamp: string
  }[]>([]);

  // Function to refresh evidence
  const refreshEvidence = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Add a function to track activity
  const trackActivity = (action: 'upload' | 'verify' | 'view', evidenceId: string) => {
    const newActivity = {
      action,
      evidenceId,
      timestamp: new Date().toISOString()
    };
    
    setRecentActivity(prev => {
      const updated = [newActivity, ...prev].slice(0, 10); // Keep only 10 most recent activities
      localStorage.setItem('evidenceActivity', JSON.stringify(updated));
      return updated;
    });
  };

  // Load recent activity from localStorage
  useEffect(() => {
    const storedActivity = localStorage.getItem('evidenceActivity');
    if (storedActivity) {
      try {
        setRecentActivity(JSON.parse(storedActivity));
      } catch (e) {
        console.error("Failed to parse activity:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvidence = async () => {
      setLoading(true);
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        // Fetch evidence from Supabase
        const query = supabase.from('evidence1').select('*');
        
        // If caseId is provided, filter by case_id
        const finalQuery = caseId ? query.eq('container_id', caseId) : query;
        
        const { data, error } = await finalQuery;
        
        if (error) {
          throw error;
        }

        interface SupabaseEvidenceRecord {
          evidence_id: string;
          original_filename?: string;
          container_id: string;
          created_at?: string;
          confirmed?: boolean;
          ipfs_hash?: string;
          ipfs_cid?: string;
          file_size?: number;
          [key: string]: unknown;
        }
        
        // Transform Supabase data to EvidenceItem format
        const evidenceList: EvidenceItem[] = (data || []).map((item: SupabaseEvidenceRecord) => ({
          id: item.evidence_id,
          name: item.original_filename || 'Unknown Evidence',
          type: 'application', // Default type - can be updated based on your data
          caseId: item.container_id,
          submittedBy: 'Unknown User', // Can be enriched from user profiles if needed
          submittedDate: item.created_at || new Date().toISOString(),
          // size: 0, // Size not stored in current schema
          verified: false, // Can be updated based on blockchain status
          hash: item.hash_original,
          cidEncrypted: item.cid
        }));

        setEvidence(evidenceList);
      } catch (error) {
        console.error("Failed to fetch evidence:", error);
        toast({
          title: "Error",
          description: "Failed to fetch evidence data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, [caseId, refreshTrigger]);

  const uploadEvidence = async (file: File, caseId: string, type: string) => {
    setLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      // Generate an encryption key (in a real app, this would be more secure)
      const encryptionKey = `key-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Upload to IPFS
      const { cid, hash } = await ipfsService.uploadFile(file, encryptionKey);
      
      // Create evidence ID
      const evidenceId = `EV-${caseId.split('-')[1]}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Generate IV for encryption (simplified)
      const iv = Math.random().toString(36).substring(2, 34);
      
      // Insert into Supabase
      const { error } = await supabase.from('evidence1').insert([
        {
          container_id: caseId,
          evidence_id: evidenceId,
          cid: cid,
          key_encrypted: encryptionKey, // Should be encrypted in production
          iv_encrypted: iv,
          hash_original: hash
        }
      ]);
      
      if (error) {
        throw error;
      }
      
      // Track the upload activity
      trackActivity('upload', evidenceId);
      
      // Refresh the evidence list
      refreshEvidence();
      
      toast({
        title: "Evidence Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
      
      return { evidenceId, cid, hash };
    } catch (error) {
      console.error("Failed to upload evidence:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload evidence file",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyEvidence = async (evidenceId: string) => {
    setLoading(true);
    try {
      // In a real implementation, this would verify on the blockchain
      // For now, we're marking it as verified locally
      
      // Track the verify activity
      trackActivity('verify', evidenceId);
      
      // Refresh evidence to update the UI
      refreshEvidence();
      
      toast({
        title: "Evidence Verified",
        description: `Evidence ${evidenceId} has been verified successfully`,
      });
      
      return true;
    } catch (error) {
      console.error("Failed to verify evidence:", error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify evidence",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to view evidence (for tracking purposes)
  const viewEvidence = (evidenceId: string) => {
    trackActivity('view', evidenceId);
    return evidence.find(item => item.id === evidenceId) || null;
  };

  // Function to download evidence from IPFS via Pinata gateway
  const downloadEvidence = async (evidence: EvidenceItem) => {
    try {
      if (!evidence.cidEncrypted) {
        throw new Error('CID not available for this evidence');
      }

      // Fetch key_encrypted, iv_encrypted, and hash_original from Supabase
      const { data, error } = await supabase
        .from('evidence1')
        .select('key_encrypted, iv_encrypted, hash_original')
        .eq('container_id', evidence.caseId)
        .eq('evidence_id', evidence.id)
        .single();

      if (error || !data) {
        throw new Error('Failed to fetch decryption keys from Supabase');
      }

      // Download encrypted file from IPFS
      const pinataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${evidence.cidEncrypted}`;
      const response = await fetch(pinataGatewayUrl);
      if (!response.ok) {
        throw new Error(`Failed to download evidence: ${response.statusText}`);
      }
      const encryptedBlob = await response.blob();
      const encryptedArrayBuffer = await encryptedBlob.arrayBuffer();

      // Use master password from Vite environment variable only (frontend)
      const masterPassword = import.meta.env.VITE_MASTER_PASSWORD;
      if (!masterPassword) {
        throw new Error('VITE_MASTER_PASSWORD not set in environment');
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
        throw new Error('Failed to decrypt AES key. Check master password and key/iv values.');
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
        throw new Error('Failed to decrypt evidence file. Key/IV may be incorrect.');
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
          description: "Evidence file hash does not match. Download blocked.",
          variant: "destructive"
        });
        return false;
      } else {
        console.log("Evidence integrity verified: hash matches Database record.");
      }

      // Download decrypted file
      const decryptedBlob = new Blob([decryptedFileBuffer], { type: encryptedBlob.type });
      const url = window.URL.createObjectURL(decryptedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = evidence.name || `${evidence.id}.bin`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      trackActivity('view', evidence.id);
      toast({
        title: "Integrity verified and Evidence Downloaded",
        description: `${evidence.name} has been downloaded and decrypted successfully`,
      });
      return true;
    } catch (error) {
      console.error("Failed to download evidence:", error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download evidence file",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    evidence,
    loading,
    uploadEvidence,
    verifyEvidence,
    viewEvidence,
    downloadEvidence,
    refreshEvidence,
    recentActivity
  };
};
