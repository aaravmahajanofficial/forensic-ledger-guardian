# Forensic Ledger Guardian

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.29-orange.svg)](https://soliditylang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-green.svg)](https://vitejs.dev/)

> A blockchain-powered forensic evidence management system that ensures tamper-proof digital evidence handling with role-based access control and encrypted storage.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Smart Contract](#smart-contract)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Overview

Forensic Ledger Guardian is a comprehensive digital evidence management platform designed for law enforcement agencies, forensic experts, legal professionals, and court officials. The system leverages blockchain technology to create an immutable chain of custody for digital evidence while providing secure, encrypted storage through IPFS.

### Problem Statement

Traditional evidence management systems often lack:

- **Immutable audit trails** - Evidence can be tampered with or modified
- **Transparent chain of custody** - Difficult to track who accessed evidence and when
- **Secure storage** - Centralized storage is vulnerable to attacks
- **Role-based access control** - Limited granular permissions
- **Interoperability** - Different systems don't communicate effectively

### Solution

Our platform addresses these challenges by:

- Using blockchain for immutable evidence records
- Implementing IPFS for decentralized, encrypted storage
- Providing role-based access control with smart contracts
- Creating transparent audit trails for all evidence interactions
- Ensuring cryptographic integrity of all stored evidence

## Key Features

### Security & Integrity

- **Blockchain-based immutability** - All evidence records stored on Ethereum
- **End-to-end encryption** - AES-256 encryption for all stored files
- **Cryptographic hashing** - SHA-256 verification for evidence integrity
- **Tamper detection** - Automatic verification of evidence authenticity

### Role-Based Access Control

- **Court Officials** - Case creation, role assignment, evidence sealing
- **Police Officers** - FIR filing, evidence submission
- **Forensic Experts** - Evidence analysis and confirmation
- **Legal Counsel** - Evidence access and review

### Evidence Management

- **Multi-format support** - Images, videos, documents, audio files
- **Chain of custody tracking** - Complete audit trail of evidence access
- **Evidence confirmation system** - Multi-party verification process
- **Case lifecycle management** - From FIR to case closure

### Modern Interface

- **Responsive design** - Works seamlessly across devices
- **Real-time updates** - Live notifications and status updates
- **Intuitive navigation** - Role-specific dashboards and workflows
- **Dark/light theme support** - User preference customization

## Technology Stack

### Frontend

- **React 19.1.1** - Modern UI framework
- **TypeScript 5.9.2** - Type-safe development
- **Vite 7.1.2** - Fast build tool and dev server (port 8080)
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Re-usable component library
- **React Router 7.8.0** - Client-side routing
- **TanStack Query 5.85.3** - Server state management
- **React Hook Form 7.62.0** - Form validation
- **Ethers.js 6.15.0** - Blockchain interaction library

### Backend & Storage

- **Node.js/Express 5.1.0** - IPFS backend server
- **IPFS/Pinata** - Decentralized file storage
- **Supabase 2.55.0** - Database and authentication
- **PostgreSQL** - Relational database via Supabase
- **Axios 1.12.0** - HTTP client
- **Multer 2.0.2** - File upload handling

### Blockchain

- **Solidity 0.8.29** - Smart contract language
- **Foundry** - Development framework and testing
- **Ethers.js 6.15.0** - Blockchain interaction
- **Ethereum Sepolia** - Testnet deployment

### Development Tools

- **ESLint 9.33.0** - Code linting
- **TypeScript 5.9.2** - Static type checking
- **Vite 7.1.2** - Development server
- **Foundry** - Smart contract testing
- **Git** - Version control

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │   IPFS Backend   │    │   Blockchain    │
│                 │    │                  │    │                 │
│ • UI Components │    │ • File Upload    │    │ • Smart Contract│
│ • State Mgmt    │◄──►│ • Encryption     │◄──►│ • Evidence Hash │
│ • Web3 Integration   │ • IPFS Storage   │    │ • Access Control│
│ • Auth System   │    │ • File Retrieval │    │ • Audit Trail   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                          ┌──────────────┐
                          │   Supabase   │
                          │              │
                          │ • User Auth  │
                          │ • Profiles   │
                          │ • Role Mgmt  │
                          │ • Metadata   │
                          └──────────────┘
```

### Data Flow

1. **Evidence Submission**: Files encrypted (AES-256) and stored on IPFS via Pinata, metadata recorded on blockchain
2. **Access Control**: Smart contract validates user permissions before evidence access
3. **Chain of Custody**: All interactions logged immutably on blockchain
4. **Verification**: Cryptographic hashes (SHA-256) ensure evidence integrity

### Project Structure

```
forensic-ledger-guardian/
├── src/                        # React frontend source
│   ├── components/            # Reusable UI components (shadcn/ui)
│   ├── pages/                 # Application pages
│   │   ├── court/            # Court official pages
│   │   ├── fir/              # FIR management pages
│   │   ├── forensic/         # Forensic expert pages
│   │   └── cases/            # Case management pages
│   ├── services/              # API and blockchain services
│   │   ├── web3Service.ts    # Blockchain interactions (~1100 lines)
│   │   ├── ipfsService.ts    # IPFS operations
│   │   └── authService.ts    # Authentication logic
│   ├── contexts/              # React context providers
│   ├── config/                # Configuration files
│   │   └── roles.ts          # Role definitions and permissions
│   ├── routes/                # Route definitions by role
│   └── ForensicChain.sol      # Smart contract source
├── ipfs-backend/              # Node.js IPFS backend
│   ├── backendfinal.js       # Main backend server (~940 lines)
│   ├── ForensicChainABI.json # Contract ABI
│   └── package.json          # Backend dependencies
├── script/                    # Foundry deployment scripts
│   └── ForensicChain.s.sol   # Contract deployment script
├── lib/                       # Foundry libraries (forge-std)
├── .devcontainer/             # VS Code dev container config
└── foundry.toml               # Foundry configuration
```

## Installation & Setup

### Option 1: Using Dev Containers (Recommended)

The fastest way to get started! Everything is pre-configured in a containerized environment.

**Prerequisites:**

- Docker Desktop
- Visual Studio Code
- Dev Containers extension (`ms-vscode-remote.remote-containers`)

**Steps:**

1. Clone and open the repository in VS Code
2. Press `F1` → `Dev Containers: Reopen in Container`
3. Wait for the container to build and dependencies to install
4. Configure `.env` files and start coding!

See [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json) for detailed configuration.

### Option 2: Local Development Setup

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Git**
- **Foundry** (for smart contract development)
- **MetaMask** or compatible Web3 wallet

### 1. Clone the Repository

```bash
git clone https://github.com/aaravmahajanofficial/forensic-ledger-guardian.git
cd forensic-ledger-guardian
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Configure environment variables
# Create .env file with the following variables:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_MASTER_PASSWORD=your_encryption_key
# VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 3. IPFS Backend Setup

```bash
# Navigate to backend directory
cd ipfs-backend

# Install backend dependencies
npm install

# Configure backend environment
# Create .env file with your IPFS and Supabase credentials
```

### 4. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the required database tables in your Supabase SQL Editor:
   - `evidence1` table for evidence metadata
   - User profiles and role management tables
   - Configure authentication settings

### 5. Smart Contract Deployment

```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile contracts
forge build

# Deploy to testnet (ensure you have testnet ETH)
forge script script/ForensicChain.s.sol:ForensicChainScript --rpc-url $SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY

# After deployment, update CONTRACT_ADDRESS in both frontend and backend .env files
```

### 6. Environment Configuration

**Frontend Environment Variables** (create `.env` in root directory):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MASTER_PASSWORD=your_encryption_key
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

**Backend Environment Variables** (create `ipfs-backend/.env`):

```env
MASTER_PASSWORD=your_encryption_key  # Must match frontend
PINATA_JWT=your_pinata_jwt_token
CONTRACT_ADDRESS=your_deployed_contract_address
SEPOLIA_RPC_URL=your_sepolia_rpc_url
SEPOLIA_PRIVATE_KEY=your_wallet_private_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
PORT=4000  # Optional, defaults to 4000
```

**Important:** The `MASTER_PASSWORD` must be identical in both frontend and backend for proper encryption/decryption.

### 7. Start the Application

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start IPFS backend
cd ipfs-backend
npm start

# Application will be available at http://localhost:8080
# IPFS Backend API at http://localhost:4000
```

## 📖 Usage

### Initial Setup

1. **Connect Wallet**: Connect your MetaMask wallet to the application
2. **Bootstrap System**: First user becomes the system owner/court admin
3. **User Registration**: Create user profiles and assign roles
4. **Case Management**: Create cases from FIRs and assign team members

### Role-Specific Workflows

#### Court Officials

- Create cases from filed FIRs
- Assign roles to officers, forensic experts, and lawyers
- Seal/unseal cases as needed
- Manage system-wide settings

#### Police Officers

- File First Information Reports (FIRs)
- Submit evidence to cases
- Track investigation progress
- Collaborate with forensic teams

#### Forensic Experts

- Access and analyze submitted evidence
- Confirm evidence authenticity
- Submit forensic reports and findings
- Maintain chain of custody

#### Legal Counsel

- Review case evidence
- Access court-approved materials
- Prepare legal documentation
- Track case progression

### Evidence Management

1. **Upload Evidence**
   - Select evidence files (images, videos, documents)
   - System automatically encrypts and uploads to IPFS
   - Blockchain records evidence hash and metadata

2. **Access Evidence**
   - Request evidence access through the interface
   - System verifies permissions via smart contract
   - Evidence decrypted and made available

3. **Verify Integrity**
   - Compare evidence hashes
   - Check chain of custody
   - Validate cryptographic signatures

## API Documentation

### REST Endpoints

The IPFS backend server (running on port 4000) provides the following endpoints:

#### FIR Management

```
POST   /fir                      # Create a new FIR
POST   /fir/:firId/upload        # Upload evidence to FIR
POST   /fir/:firId/promote       # Promote FIR to case
```

#### Case & Evidence Management

```
POST   /case/:caseId/upload      # Upload evidence to case
POST   /case/:containerId/confirm # Confirm evidence
GET    /retrieve/:containerId/:evidenceId # Retrieve and decrypt evidence
GET    /sync                      # Sync and verify all evidence integrity
```

#### Health Check

```
GET    /                          # Server health check
```

All endpoints support CORS for local development origins (localhost:8080, localhost:5173, localhost:4000).

### Smart Contract Functions

#### Evidence Operations

```solidity
submitCaseEvidence(caseId, evidenceId, cidEncrypted, hashEncrypted, hashOriginal, encryptionKeyHash, evidenceType)
confirmCaseEvidence(caseId, index)
accessEvidence(caseId, index, keyHash)
verifyEvidence(caseId, index, providedHash)
```

#### Case Management

```solidity
createCaseFromFIR(caseId, firId, title, description, tags)
assignCaseRole(caseId, user, role)
sealCase(caseId)
closeCase(caseId)
```

#### Role Management

```solidity
setGlobalRole(user, role)
getMyRoleInCase(caseId)
getGlobalRole(user)
```

## Smart Contract

The `ForensicChain.sol` smart contract is the core of our evidence management system, deployed on Ethereum Sepolia testnet.

**Contract Location:** `src/ForensicChain.sol`

### Key Features

- **Role-based access control** with enum-based permissions
- **Evidence integrity** through cryptographic hashing (SHA-256)
- **Chain of custody** tracking with automatic audit trails
- **Case lifecycle management** from FIR to case closure
- **Emergency controls** with system-wide locking capabilities

### Contract Structure

The contract is built using Solidity 0.8.29 with Foundry framework and includes:

- **Enums:** `Role` (None, Court, Officer, Forensic, Lawyer), `EvidenceType` (Image, Video, Document, Other)
- **Structs:** `Evidence`, `FIR`, `Case`
- **Role Management:** Global roles and case-specific role assignments
- **Evidence Management:** Submit, confirm, and track evidence with chain of custody

### Deployment

Deployed using Foundry's scripting system (`script/ForensicChain.s.sol`):

```bash
forge script script/ForensicChain.s.sol:ForensicChainScript --rpc-url $SEPOLIA_RPC_URL --broadcast
```

### Contract Address

```
Sepolia Testnet: Update VITE_CONTRACT_ADDRESS after deployment
```

### Roles & Permissions

- **Role.None (0)**: No assigned role
- **Role.Court (1)**: Full administrative control, case creation, role assignment
- **Role.Officer (2)**: FIR filing, evidence submission
- **Role.Forensic (3)**: Evidence analysis, confirmation
- **Role.Lawyer (4)**: Evidence access, review

**Note:** Role values are defined in both the smart contract and frontend (`src/config/roles.ts`).

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow TypeScript/ESLint configurations
- Write comprehensive tests for new features
- Document all public APIs and functions
- Ensure responsive design for UI components
- Use modern React 19.1 patterns and hooks

### Development Tools & Extensions

The project uses:
- **ESLint** for code linting
- **Vite** for fast development and building
- **Foundry** for smart contract development and testing

VS Code extensions recommended (see `.devcontainer/devcontainer.json`):
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- Solidity (`NomicFoundation.hardhat-solidity`)
- GitHub Copilot (optional)

### Bug Reports

Use GitHub Issues to report bugs. Include:

- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (Node.js version, browser, OS)

### Testing

**Smart Contract Testing:**
```bash
# Compile contracts
forge build

# Run tests (when available)
forge test

# Run tests with gas reporting
forge test --gas-report
```

**Frontend Linting:**
```bash
# Run ESLint
npm run lint

# Build check
npm run build
```

**Note:** Frontend test framework is not currently configured. Contributions to add testing infrastructure are welcome!

## Security

Security is paramount in forensic evidence management. Our implementation includes:

### Security Measures

- **Multi-layer encryption** for all stored evidence
- **Smart contract audits** and formal verification
- **Role-based access control** with principle of least privilege
- **Regular security assessments** and penetration testing

### Reporting Security Issues

Please report security vulnerabilities privately through [GitHub Security Advisories](https://github.com/aaravmahajanofficial/forensic-ledger-guardian/security/advisories/new). Do not create public issues for security vulnerabilities.

### Security Best Practices

- Keep your private keys secure and never share them
- Use hardware wallets for production deployments
- Regularly update dependencies and monitor for vulnerabilities
- Follow the principle of least privilege for role assignments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Foundry Team** for excellent smart contract development tools
- **IPFS Protocol** for decentralized storage infrastructure
- **Supabase** for backend-as-a-service platform
- **React Team** for the amazing frontend framework
- **Ethereum Foundation** for blockchain infrastructure

---

**Built with ❤️ for the justice system by [Forensic Ledger Guardian Team](https://github.com/aaravmahajanofficial)**

For questions, support, or feature requests, please [open an issue](https://github.com/aaravmahajanofficial/forensic-ledger-guardian/issues) or contact the maintainers.
