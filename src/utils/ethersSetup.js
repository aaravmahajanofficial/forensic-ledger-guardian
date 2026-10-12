// ethersSetup.js
import { ethers } from "ethers";
import EvidenceRegistryArtifact from "../contracts/EvidenceRegistry.json";

const contractAddress = process.env.VITE_CONTRACT_ADDRESS || "0x195304e4c900e52543ace755dd02cfa6272cb79d"; // Replace with your deployed address

// Create provider - detects MetaMask or falls back to localhost Anvil
export function getProvider() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    return new ethers.BrowserProvider(window.ethereum);
  }
  // Fallback to localhost (Anvil)
  return new ethers.JsonRpcProvider("http://127.0.0.1:8545");
}

// Get contract instance connected with provider or signer
export async function getContract(withSigner = false) {
  const provider = getProvider();
  if (withSigner) {
    // Request wallet access if needed
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return new ethers.Contract(
      contractAddress,
      EvidenceRegistryArtifact.abi,
      signer,
    );
  } else {
    return new ethers.Contract(
      contractAddress,
      EvidenceRegistryArtifact.abi,
      provider,
    );
  }
}
