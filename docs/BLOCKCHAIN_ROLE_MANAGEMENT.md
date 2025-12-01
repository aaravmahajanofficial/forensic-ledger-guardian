# Blockchain Role Management Guide

This document explains how to manage roles using the ForensicChain smart contract, both from the frontend and via command line using Foundry's `cast` commands.

## Overview

The role management system now integrates both:

1. **Blockchain (Source of Truth)**: Roles are stored on-chain in the ForensicChain smart contract
2. **Database (Supabase)**: Used for quick lookups and UI tracking

## Role Enum Values

| Role     | Value | Description            |
| -------- | ----- | ---------------------- |
| None     | 0     | No role assigned       |
| Court    | 1     | Court Official (Admin) |
| Officer  | 2     | Police Officer         |
| Forensic | 3     | Forensic Expert        |
| Lawyer   | 4     | Legal Counsel          |

## Contract Address

**Sepolia Testnet**: `0xf95af9ef3f9cdbd39cc3847707285dc90022104a`

## Using Cast Commands

### Prerequisites

1. Set environment variables:

```bash
export SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
export PRIVATE_KEY="your_private_key_here"
export CONTRACT_ADDRESS="0xf95af9ef3f9cdbd39cc3847707285dc90022104a"
```

### Read Operations (Free, No Gas)

#### Check Contract Owner

```bash
cast call $CONTRACT_ADDRESS "owner()(address)" --rpc-url $SEPOLIA_RPC_URL
```

#### Check User's Global Role

```bash
# Replace USER_ADDRESS with the wallet address to check
cast call $CONTRACT_ADDRESS "getGlobalRole(address)(uint8)" USER_ADDRESS --rpc-url $SEPOLIA_RPC_URL
```

#### Check System Lock Status

```bash
cast call $CONTRACT_ADDRESS "isSystemLocked()(bool)" --rpc-url $SEPOLIA_RPC_URL
```

### Write Operations (Requires Gas)

#### Assign a Global Role (Court Only)

```bash
# Assign Officer role (2) to a user
cast send $CONTRACT_ADDRESS "setGlobalRole(address,uint8)" USER_ADDRESS 2 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY

# Assign Court role (1)
cast send $CONTRACT_ADDRESS "setGlobalRole(address,uint8)" USER_ADDRESS 1 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY

# Assign Forensic role (3)
cast send $CONTRACT_ADDRESS "setGlobalRole(address,uint8)" USER_ADDRESS 3 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY

# Assign Lawyer role (4)
cast send $CONTRACT_ADDRESS "setGlobalRole(address,uint8)" USER_ADDRESS 4 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

#### Revoke a Global Role (Court Only)

```bash
cast send $CONTRACT_ADDRESS "revokeGlobalRole(address)" USER_ADDRESS \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

#### Toggle System Lock (Court Only)

```bash
cast send $CONTRACT_ADDRESS "toggleSystemLock()" \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

### Example: Complete Role Assignment Flow

```bash
# 1. Check the current owner
cast call $CONTRACT_ADDRESS "owner()(address)" --rpc-url $SEPOLIA_RPC_URL

# 2. Check if address has any role
cast call $CONTRACT_ADDRESS "getGlobalRole(address)(uint8)" 0x1234567890123456789012345678901234567890 --rpc-url $SEPOLIA_RPC_URL

# 3. Assign Officer role
cast send $CONTRACT_ADDRESS "setGlobalRole(address,uint8)" 0x1234567890123456789012345678901234567890 2 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY

# 4. Verify the role was assigned
cast call $CONTRACT_ADDRESS "getGlobalRole(address)(uint8)" 0x1234567890123456789012345678901234567890 --rpc-url $SEPOLIA_RPC_URL

# 5. Revoke the role
cast send $CONTRACT_ADDRESS "revokeGlobalRole(address)" 0x1234567890123456789012345678901234567890 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY

# 6. Verify role was revoked (should return 0)
cast call $CONTRACT_ADDRESS "getGlobalRole(address)(uint8)" 0x1234567890123456789012345678901234567890 --rpc-url $SEPOLIA_RPC_URL
```

### Deploying a New Contract

If you need to deploy a fresh contract:

```bash
# Using the deployment script
forge script script/ForensicChain.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY

# Or deploy directly
forge create src/ForensicChain.sol:ForensicChain \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

After deployment, update the contract address in:

- `src/services/web3Service.ts` (line ~533)
- `ipfs-backend/.env` (`CONTRACT_ADDRESS`)

## Frontend Integration

The `OwnerBootstrap` component now:

1. **Assigns roles on blockchain first** (source of truth)
2. **Records in database** for UI/tracking purposes
3. **Shows blockchain sync status** in the assignments table
4. **Handles revocation** on both blockchain and database

### Blockchain Sync Status Indicators

| Status        | Description                                  |
| ------------- | -------------------------------------------- |
| 🔗 Synced     | Role matches between blockchain and database |
| ⚠️ Mismatch   | Different roles on blockchain vs database    |
| ⚠️ Not synced | Role only in database, not on blockchain     |

## Troubleshooting

### Transaction Fails with "Unauthorized role"

- Only accounts with `Court` role can assign/revoke roles
- Check your wallet has Court role: `cast call $CONTRACT_ADDRESS "getGlobalRole(address)(uint8)" YOUR_ADDRESS --rpc-url $SEPOLIA_RPC_URL`

### Transaction Fails with "Cannot assign None role"

- Use `revokeGlobalRole()` instead of `setGlobalRole()` with role 0

### Transaction Fails with "User has no role to revoke"

- The user already has no role assigned

### Transaction Fails with "Cannot revoke owner's role"

- The contract owner's Court role cannot be revoked for security

### Frontend shows "Blockchain not connected"

- Ensure MetaMask is connected and on Sepolia network
- Check browser console for connection errors
