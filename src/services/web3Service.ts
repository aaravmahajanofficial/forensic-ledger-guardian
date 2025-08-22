import { ethers, toUtf8Bytes } from "ethers";
import { toast } from "@/hooks/use-toast";

const CONTRACT_ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "accessEvidence",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "index", type: "uint256", internalType: "uint256" },
      { name: "keyHash", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "assignCaseRole",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "user", type: "address", internalType: "address" },
      { name: "role", type: "uint8", internalType: "enum ForensicChain.Role" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "caseAuditTrail",
    inputs: [
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "caseEvidenceMapping",
    inputs: [
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "evidenceId", type: "string", internalType: "string" },
      { name: "cidEncrypted", type: "string", internalType: "string" },
      { name: "hashEncrypted", type: "string", internalType: "string" },
      { name: "hashOriginal", type: "string", internalType: "string" },
      { name: "encryptionKeyHash", type: "bytes", internalType: "bytes" },
      {
        name: "evidenceType",
        type: "uint8",
        internalType: "enum ForensicChain.EvidenceType",
      },
      { name: "submittedBy", type: "address", internalType: "address" },
      { name: "confirmed", type: "bool", internalType: "bool" },
      { name: "submittedAt", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "caseRoles",
    inputs: [
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint8", internalType: "enum ForensicChain.Role" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "cases",
    inputs: [{ name: "", type: "string", internalType: "string" }],
    outputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "title", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "createdBy", type: "address", internalType: "address" },
      { name: "seal", type: "bool", internalType: "bool" },
      { name: "open", type: "bool", internalType: "bool" },
      { name: "evidenceCount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "closeCase",
    inputs: [{ name: "caseId", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "confirmCaseEvidence",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "index", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createCaseFromFIR",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "firId", type: "string", internalType: "string" },
      { name: "title", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "tags", type: "string[]", internalType: "string[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "evidenceAccessed",
    inputs: [
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "evidenceConfirmed",
    inputs: [
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fileFIR",
    inputs: [
      { name: "firId", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "firs",
    inputs: [{ name: "", type: "string", internalType: "string" }],
    outputs: [
      { name: "firId", type: "string", internalType: "string" },
      { name: "filedBy", type: "address", internalType: "address" },
      { name: "description", type: "string", internalType: "string" },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
      { name: "promotedToCase", type: "bool", internalType: "bool" },
      { name: "associatedCaseId", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCase",
    inputs: [{ name: "caseId", type: "string", internalType: "string" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ForensicChain.Case",
        components: [
          { name: "caseId", type: "string", internalType: "string" },
          { name: "title", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
          { name: "createdBy", type: "address", internalType: "address" },
          { name: "seal", type: "bool", internalType: "bool" },
          { name: "open", type: "bool", internalType: "bool" },
          { name: "tags", type: "string[]", internalType: "string[]" },
          { name: "evidenceCount", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEvidence",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "index", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ForensicChain.Evidence",
        components: [
          { name: "evidenceId", type: "string", internalType: "string" },
          { name: "cidEncrypted", type: "string", internalType: "string" },
          { name: "hashEncrypted", type: "string", internalType: "string" },
          { name: "hashOriginal", type: "string", internalType: "string" },
          { name: "encryptionKeyHash", type: "bytes", internalType: "bytes" },
          {
            name: "evidenceType",
            type: "uint8",
            internalType: "enum ForensicChain.EvidenceType",
          },
          { name: "submittedBy", type: "address", internalType: "address" },
          { name: "confirmed", type: "bool", internalType: "bool" },
          { name: "submittedAt", type: "uint256", internalType: "uint256" },
          {
            name: "chainOfCustody",
            type: "address[]",
            internalType: "address[]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFIR",
    inputs: [{ name: "firId", type: "string", internalType: "string" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ForensicChain.FIR",
        components: [
          { name: "firId", type: "string", internalType: "string" },
          { name: "filedBy", type: "address", internalType: "address" },
          { name: "description", type: "string", internalType: "string" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
          { name: "promotedToCase", type: "bool", internalType: "bool" },
          { name: "associatedCaseId", type: "string", internalType: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGlobalRole",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [
      { name: "", type: "uint8", internalType: "enum ForensicChain.Role" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMyRoleInCase",
    inputs: [{ name: "caseId", type: "string", internalType: "string" }],
    outputs: [
      { name: "", type: "uint8", internalType: "enum ForensicChain.Role" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "globalRoles",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "", type: "uint8", internalType: "enum ForensicChain.Role" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isSystemLocked",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reopenCase",
    inputs: [{ name: "caseId", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sealCase",
    inputs: [{ name: "caseId", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setGlobalRole",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "role", type: "uint8", internalType: "enum ForensicChain.Role" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitCaseEvidence",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "evidenceId", type: "string", internalType: "string" },
      { name: "cidEncrypted", type: "string", internalType: "string" },
      { name: "hashEncrypted", type: "string", internalType: "string" },
      { name: "hashOriginal", type: "string", internalType: "string" },
      { name: "encryptionKeyHash", type: "bytes", internalType: "bytes" },
      {
        name: "evidenceType",
        type: "uint8",
        internalType: "enum ForensicChain.EvidenceType",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitFIREvidence",
    inputs: [
      { name: "firId", type: "string", internalType: "string" },
      { name: "evidenceId", type: "string", internalType: "string" },
      { name: "cidEncrypted", type: "string", internalType: "string" },
      { name: "hashEncrypted", type: "string", internalType: "string" },
      { name: "hashOriginal", type: "string", internalType: "string" },
      { name: "encryptionKeyHash", type: "bytes", internalType: "bytes" },
      {
        name: "evidenceType",
        type: "uint8",
        internalType: "enum ForensicChain.EvidenceType",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "toggleSystemLock",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateEncryptionKey",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "index", type: "uint256", internalType: "uint256" },
      { name: "newKeyHash", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "usedCIDHash",
    inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifyEvidence",
    inputs: [
      { name: "caseId", type: "string", internalType: "string" },
      { name: "index", type: "uint256", internalType: "uint256" },
      { name: "providedHash", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CaseCreated",
    inputs: [
      { name: "caseId", type: "string", indexed: true, internalType: "string" },
      { name: "firId", type: "string", indexed: true, internalType: "string" },
      {
        name: "creator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CaseStatusChanged",
    inputs: [
      { name: "caseId", type: "string", indexed: true, internalType: "string" },
      {
        name: "statusSealed",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      { name: "open", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EncryptionKeyUpdated",
    inputs: [
      { name: "caseId", type: "string", indexed: true, internalType: "string" },
      {
        name: "index",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      { name: "keyHash", type: "bytes", indexed: false, internalType: "bytes" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EvidenceAccessed",
    inputs: [
      { name: "caseId", type: "string", indexed: true, internalType: "string" },
      {
        name: "index",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "accessor",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EvidenceConfirmed",
    inputs: [
      { name: "caseId", type: "string", indexed: true, internalType: "string" },
      {
        name: "index",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "confirmer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EvidenceSubmitted",
    inputs: [
      { name: "caseId", type: "string", indexed: true, internalType: "string" },
      {
        name: "evidenceId",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "cidEncrypted",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "submitter",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FIRFiled",
    inputs: [
      { name: "firId", type: "string", indexed: true, internalType: "string" },
      {
        name: "filedBy",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleAssigned",
    inputs: [
      { name: "caseId", type: "string", indexed: true, internalType: "string" },
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "role",
        type: "uint8",
        indexed: false,
        internalType: "enum ForensicChain.Role",
      },
    ],
    anonymous: false,
  },
];

// Network-specific contract addresses
const CONTRACT_ADDRESSES: Record<string, string> = {
  "0xaa36a7": "0x0f98bcb53ff15fdc52168573c36436cf21a1466a", // Sepolia testnet
  "0x7a69": "0x0f98bcb53ff15fdc52168573c36436cf21a1466a", // Anvil local
  "0x1": "0x0000000000000000000000000000000000000000", // Mainnet (placeholder)
};

// Default contract address (Sepolia)
const CONTRACT_ADDRESS = "0x0f98bcb53ff15fdc52168573c36436cf21a1466a";

export enum Role {
  None = 0,
  Court = 1,
  Officer = 2,
  Forensic = 3,
  Lawyer = 4,
}

export enum EvidenceType {
  Image = 0,
  Video = 1,
  Document = 2,
  Other = 3,
}

export interface Evidence {
  evidenceId: string;
  cidEncrypted: string;
  hashEncrypted: string;
  hashOriginal: string;
  encryptionKeyHash: string;
  evidenceType: EvidenceType;
  submittedBy: string;
  confirmed: boolean;
  submittedAt: number;
  chainOfCustody: string[];
}

export interface Case {
  caseId: string;
  title: string;
  description: string;
  createdBy: string;
  seal: boolean;
  open: boolean;
  tags: string[];
  evidenceCount: number;
}

export interface FIR {
  firId: string;
  filedBy: string;
  description: string;
  timestamp: number;
  promotedToCase: boolean;
  associatedCaseId: string;
}

// Provide a minimal `window.ethereum` declaration so TypeScript doesn't error in the browser code.
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeAllListeners?: (event?: string) => void;
}

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private account: string | null = null;

  // Helper to safely coerce values that may be BigNumber-like or primitive into numbers
  private toNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "bigint") return Number(value);
    if (typeof value === "string" && value !== "") {
      const n = Number(value);
      return Number.isNaN(n) ? 0 : n;
    }
    if (typeof value === "object" && value !== null) {
      const obj = value as { toNumber?: unknown };
      if (typeof obj.toNumber === "function") {
        return (obj.toNumber as unknown as () => number)();
      }
    }
    return 0;
  }

  constructor() {
    // Don't auto-initialize, wait for explicit wallet connection
    this.setupProvider();
  }

  // Get contract address for current network
  private getCurrentContractAddress(): string {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { ethereum?: EthereumProvider }).ethereum
    ) {
      // We'll get chainId through the provider instead
      return CONTRACT_ADDRESS; // Default for now, can be enhanced later
    }
    return CONTRACT_ADDRESS;
  }

  private async setupProvider() {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { ethereum?: EthereumProvider }).ethereum
    ) {
      try {
        const eth = (window as unknown as { ethereum?: EthereumProvider })
          .ethereum as EthereumProvider;
        this.provider = new ethers.BrowserProvider(eth);

        // Listen for account changes
        eth.on("accountsChanged", (accounts: unknown) => {
          const arr = Array.isArray(accounts) ? (accounts as string[]) : [];
          if (arr.length === 0) {
            this.account = null;
            this.contract = null;
            toast({
              title: "Disconnected",
              description: "Wallet disconnected.",
              variant: "destructive",
            });
          } else {
            this.account = arr[0];
            this.initContract();
            toast({
              title: "Connected",
              description: `Connected to account ${this.shortenAddress(
                arr[0]
              )}`,
            });
          }
        });
      } catch (error) {
        console.error("Error setting up provider:", error);
      }
    } else {
      console.error("No ethereum browser extension detected");
    }
  }

  private async initWeb3() {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { ethereum?: EthereumProvider }).ethereum
    ) {
      try {
        // Request account access
        const eth = (window as unknown as { ethereum?: EthereumProvider })
          .ethereum as EthereumProvider;
        const accountsRaw = await eth.request({
          method: "eth_requestAccounts",
        });
        const accounts = Array.isArray(accountsRaw)
          ? (accountsRaw as string[])
          : [];

        if (accounts.length > 0) {
          if (!this.provider) {
            this.provider = new ethers.BrowserProvider(eth);
          }
          const signer = await this.provider.getSigner();
          this.account = await signer.getAddress();
          const contractAddress = this.getCurrentContractAddress();
          this.contract = new ethers.Contract(
            contractAddress,
            CONTRACT_ABI,
            signer as unknown as ethers.ContractRunner
          );
          console.log(
            "Web3 initialized successfully with account:",
            this.account
          );
          console.log("Contract initialized at address:", contractAddress);
          return true;
        }
      } catch (error) {
        console.error(
          "User denied account access or another error occurred:",
          error
        );
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Ethereum wallet.",
          variant: "destructive",
        });
      }
    } else {
      console.error("No ethereum browser extension detected");
      toast({
        title: "Web3 Not Available",
        description:
          "Please install MetaMask or another Ethereum wallet extension.",
        variant: "destructive",
      });
    }
    return false;
  }

  private initContract() {
    // initialize contract runner (signer) from existing provider
    if (this.provider && this.account) {
      // BrowserProvider.getSigner() returns a Promise-like signer
      // but here we can call getSigner() and set the contract once the signer resolves
      this.provider
        .getSigner()
        .then((signer) => {
          const contractAddress = this.getCurrentContractAddress();
          this.contract = new ethers.Contract(
            contractAddress,
            CONTRACT_ABI,
            signer as unknown as ethers.ContractRunner
          );
        })
        .catch(() => {
          // ignore signer resolution errors during initContract
        });
    }
  }

  private shortenAddress(address: string): string {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  }

  public async connectWallet(): Promise<string | null> {
    console.log("Attempting to connect wallet...");

    // Initialize Web3 connection
    const success = await this.initWeb3();
    if (success && this.account) {
      console.log("Wallet connected successfully:", this.account);
      console.log("Contract initialized:", this.contract ? "Yes" : "No");
      return this.account;
    }

    console.error("Failed to connect wallet");
    return null;
  }

  public async getCurrentAccount(): Promise<string | null> {
    return this.account;
  }

  public async getUserRole(): Promise<Role> {
    if (!this.contract || !this.account) return Role.None;

    try {
      const roleRaw = await this.contract.getGlobalRole(this.account);
      return this.toNumber(roleRaw) as Role;
    } catch (error) {
      console.error("Error getting user role:", error);
      return Role.None;
    }
  }

  public async getUserCaseRole(caseId: string): Promise<Role> {
    if (!this.contract || !this.account) return Role.None;

    try {
      const roleRaw = await this.contract.getMyRoleInCase(caseId);
      return this.toNumber(roleRaw) as Role;
    } catch (error) {
      console.error(`Error getting user role for case ${caseId}:`, error);
      return Role.None;
    }
  }

  // Check if contract is connected
  public isContractConnected(): boolean {
    return this.contract !== null;
  }

  // Get contract owner address
  public async getContractOwner(): Promise<string | null> {
    if (!this.contract) return null;

    try {
      const owner = await this.contract.owner();
      return owner;
    } catch (error) {
      console.error("Error getting contract owner:", error);
      return null;
    }
  }

  // FIR Management
  public async fileFIR(firId: string, description: string): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.fileFIR(firId, description);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error filing FIR:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to file FIR. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Create a default FIR if needed
  public async ensureDefaultFIR(firId: string): Promise<boolean> {
    if (!this.contract) {
      console.error("Contract not initialized");
      return false;
    }

    try {
      // Check if FIR already exists
      const existingFIR = await this.contract.firs(firId);
      if (existingFIR.filedBy !== "0x0000000000000000000000000000000000000000") {
        console.log("FIR already exists:", firId);
        return true;
      }

      // Create default FIR
      console.log("Creating default FIR:", firId);
      const defaultDescription = `Default FIR created for case processing - ${new Date().toISOString()}`;
      return await this.fileFIR(firId, defaultDescription);
    } catch (error) {
      console.error("Error ensuring default FIR:", error);
      return false;
    }
  }

  public async getFIR(firId: string): Promise<FIR | null> {
    if (!this.contract) return null;

    try {
      const fir = await this.contract.getFIR(firId);
      return {
        firId: fir.firId,
        filedBy: fir.filedBy,
        description: fir.description,
        timestamp: this.toNumber(fir.timestamp),
        promotedToCase: fir.promotedToCase,
        associatedCaseId: fir.associatedCaseId,
      };
    } catch (error) {
      console.error(`Error getting FIR ${firId}:`, error);
      return null;
    }
  }

  public async getAllCases(): Promise<Case[]> {
    if (!this.contract) return [];

    try {
      const allCases = await this.contract.getAllCases();
      return allCases.map((caseData: Case) => ({
        caseId: caseData.caseId,
        title: caseData.title,
        description: caseData.description,
        createdBy: caseData.createdBy,
        seal: caseData.seal,
        open: caseData.open,
        tags: caseData.tags,
        evidenceCount: this.toNumber(caseData.evidenceCount),
      }));
    } catch (error) {
      console.error("Error getting all cases:", error);
      return [];
    }
  }

  // Case Management
  public async createCaseFromFIR(
    caseId: string,
    firId: string,
    title: string,
    description: string,
    tags: string[]
  ): Promise<boolean> {
    if (!this.contract) {
      console.error("Contract not initialized");
      return false;
    }

    try {
      // First ensure the FIR exists, create a default one if needed
      const firExists = await this.ensureDefaultFIR(firId);
      if (!firExists) {
        throw new Error("Could not create or find required FIR");
      }

      console.log("Calling createCaseFromFIR with params:", {
        caseId,
        firId,
        title,
        description,
        tags,
      });
      const tx = await this.contract.createCaseFromFIR(
        caseId,
        firId,
        title,
        description,
        tags
      );
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      return true;
    } catch (error: unknown) {
      console.error("Error creating case from FIR:", error);

      // More detailed error logging
      const err = error as EthersError;
      if (err.reason) {
        console.error("Revert reason:", err.reason);
      }
      if (err.data) {
        console.error("Error data:", err.data);
      }
      if (err.code) {
        console.error("Error code:", err.code);
      }

      let errorMessage = "Failed to create case. Please try again.";

      // Handle specific error cases
      if (err.reason) {
        if (err.reason.includes("Case already exists")) {
          errorMessage = "A case with this ID already exists.";
        } else if (err.reason.includes("FIR not found")) {
          errorMessage = "The specified FIR was not found.";
        } else if (err.reason.includes("FIR already promoted")) {
          errorMessage = "This FIR has already been promoted to a case.";
        } else if (err.reason.includes("Unauthorized role")) {
          errorMessage =
            "You don't have permission to create cases. Only Officers can create cases.";
        } else if (err.reason.includes("System is in emergency lock")) {
          errorMessage = "The system is currently locked for maintenance.";
        } else {
          errorMessage = `Transaction failed: ${err.reason}`;
        }
      }

      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }

  public async assignCaseRole(
    caseId: string,
    user: string,
    role: Role
  ): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.assignCaseRole(caseId, user, role);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error assigning case role:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async getCase(caseId: string): Promise<Case | null> {
    if (!this.contract) return null;

    try {
      const caseData = await this.contract.getCase(caseId);
      return {
        caseId: caseData.caseId,
        title: caseData.title,
        description: caseData.description,
        createdBy: caseData.createdBy,
        seal: caseData.seal,
        open: caseData.open,
        tags: caseData.tags,
        evidenceCount: this.toNumber(caseData.evidenceCount),
      };
    } catch (error) {
      console.error(`Error getting case ${caseId}:`, error);
      return null;
    }
  }

  public async sealCase(caseId: string): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.sealCase(caseId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error(`Error sealing case ${caseId}:`, error);
      toast({
        title: "Transaction Failed",
        description: "Failed to seal case. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async reopenCase(caseId: string): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.reopenCase(caseId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error(`Error reopening case ${caseId}:`, error);
      toast({
        title: "Transaction Failed",
        description: "Failed to reopen case. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async closeCase(caseId: string): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.closeCase(caseId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error(`Error closing case ${caseId}:`, error);
      toast({
        title: "Transaction Failed",
        description: "Failed to close case. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Evidence Management
  public async submitCaseEvidence(
    caseId: string,
    evidenceId: string,
    cidEncrypted: string,
    hashEncrypted: string,
    hashOriginal: string,
    encryptionKeyHash: string,
    evidenceType: EvidenceType
  ): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.submitCaseEvidence(
        caseId,
        evidenceId,
        cidEncrypted,
        hashEncrypted,
        hashOriginal,
        toUtf8Bytes(encryptionKeyHash),
        evidenceType
      );
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error submitting evidence:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to submit evidence. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async submitFIREvidence(
    firId: string,
    evidenceId: string,
    cidEncrypted: string,
    hashEncrypted: string,
    hashOriginal: string,
    encryptionKeyHash: string,
    evidenceType: EvidenceType
  ): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.submitFIREvidence(
        firId,
        evidenceId,
        cidEncrypted,
        hashEncrypted,
        hashOriginal,
        toUtf8Bytes(encryptionKeyHash),
        evidenceType
      );
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error submitting FIR evidence:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to submit FIR evidence. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async confirmCaseEvidence(
    caseId: string,
    index: number
  ): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.confirmCaseEvidence(caseId, index);
      await tx.wait();
      return true;
    } catch (error) {
      console.error(`Error confirming evidence index ${index}:`, error);
      toast({
        title: "Transaction Failed",
        description: "Failed to confirm evidence. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async accessEvidence(
    caseId: string,
    index: number,
    keyHash: string
  ): Promise<string | null> {
    if (!this.contract) return null;

    try {
      const cidEncrypted = await this.contract.accessEvidence(
        caseId,
        index,
        toUtf8Bytes(keyHash)
      );
      return cidEncrypted;
    } catch (error) {
      console.error(`Error accessing evidence index ${index}:`, error);
      toast({
        title: "Transaction Failed",
        description: "Failed to access evidence. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }

  public async verifyEvidence(
    caseId: string,
    index: number,
    providedHash: string
  ): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const isValid = await this.contract.verifyEvidence(
        caseId,
        index,
        providedHash
      );
      return isValid;
    } catch (error) {
      console.error(`Error verifying evidence index ${index}:`, error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify evidence. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async getEvidence(
    caseId: string,
    index: number
  ): Promise<Evidence | null> {
    if (!this.contract) return null;

    try {
      const evidence = await this.contract.getEvidence(caseId, index);
      return {
        evidenceId: evidence.evidenceId,
        cidEncrypted: evidence.cidEncrypted,
        hashEncrypted: evidence.hashEncrypted,
        hashOriginal: evidence.hashOriginal,
        encryptionKeyHash: evidence.encryptionKeyHash,
        evidenceType: Number(evidence.evidenceType) as EvidenceType,
        submittedBy: evidence.submittedBy,
        confirmed: evidence.confirmed,
        submittedAt: evidence.submittedAt ? Number(evidence.submittedAt) : 0,
        chainOfCustody: Array.isArray(evidence.chainOfCustody)
          ? evidence.chainOfCustody.map((c: unknown) => String(c))
          : [],
      };
    } catch (error) {
      console.error(`Error getting evidence index ${index}:`, error);
      return null;
    }
  }

  // System Management
  public async toggleSystemLock(): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.toggleSystemLock();
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error toggling system lock:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to toggle system lock. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  public async setGlobalRole(user: string, role: Role): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const tx = await this.contract.setGlobalRole(user, role);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error setting global role:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to set global role. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Helper Functions
  public async testContractConnection(): Promise<boolean> {
    console.log("Testing contract connection...");
    console.log("Contract exists:", this.contract ? "Yes" : "No");
    console.log("Account connected:", this.account || "No");
    console.log("Provider available:", this.provider ? "Yes" : "No");

    if (!this.contract) {
      console.error("Contract not initialized");

      // Try to connect wallet if not connected
      if (!this.account) {
        console.log("Attempting to connect wallet...");
        const connected = await this.connectWallet();
        if (!connected) {
          console.error("Failed to connect wallet");
          return false;
        }
      }

      // If still no contract after connection attempt
      if (!this.contract) {
        console.error("Contract still not initialized after wallet connection");
        return false;
      }
    }

    try {
      // Try a simple read operation to test contract connection
      console.log("Calling contract method isSystemLocked...");
      const isLocked = await this.contract.isSystemLocked();
      console.log(
        "Contract connection test successful. System locked:",
        isLocked
      );
      return true;
    } catch (error) {
      console.error("Contract connection test failed:", error);

      // Check if it's a network issue
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          console.error(
            "Network error - check if you're connected to the correct network"
          );
        } else if (error.message.includes("revert")) {
          console.error("Contract reverted - contract may not be deployed");
        }
      }

      return false;
    }
  }

  public async setupTestEnvironment(): Promise<boolean> {
    if (!this.contract || !this.account) return false;

    try {
      console.log("Setting up test environment...");

      // Set current user as Officer role for testing
      const currentRole = await this.getUserRole();
      if (currentRole === Role.None) {
        console.log("Setting current user as Officer role");
        await this.setGlobalRole(this.account, Role.Officer);
      }

      return true;
    } catch (error) {
      console.error("Error setting up test environment:", error);
      return false;
    }
  }

  public async getNetworkInfo(): Promise<{
    chainId: number;
    name: string;
  } | null> {
    if (!this.provider) {
      console.error("Provider not initialized");
      return null;
    }

    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: Number(network.chainId),
        name: network.name,
      };
    } catch (error) {
      console.error("Error getting network info:", error);
      return null;
    }
  }

  public getContractAddress(): string {
    return this.getCurrentContractAddress();
  }

  public getRoleString(role: Role): string {
    switch (role) {
      case Role.Court:
        return "Court";
      case Role.Officer:
        return "Officer";
      case Role.Forensic:
        return "Forensic";
      case Role.Lawyer:
        return "Lawyer";
      default:
        return "None";
    }
  }

  public getEvidenceTypeString(type: EvidenceType): string {
    switch (type) {
      case EvidenceType.Image:
        return "Image";
      case EvidenceType.Video:
        return "Video";
      case EvidenceType.Document:
        return "Document";
      default:
        return "Other";
    }
  }
}

interface EthersError {
  reason?: string;
  data?: string;
  code?: string | number;
  message?: string;
}

// Create singleton instance
const web3Service = new Web3Service();
export default web3Service;
