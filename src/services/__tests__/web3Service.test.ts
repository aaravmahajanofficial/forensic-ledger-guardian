import { describe, it, expect } from "vitest";
import web3Service, { Role, EvidenceType } from "../web3Service";

describe("web3Service helper methods", () => {
  it("should format Role enum values to string correctly", () => {
    expect(web3Service.getRoleString(Role.Court)).toBe("Court");
    expect(web3Service.getRoleString(Role.Officer)).toBe("Officer");
    expect(web3Service.getRoleString(Role.Forensic)).toBe("Forensic");
    expect(web3Service.getRoleString(Role.Lawyer)).toBe("Lawyer");
    expect(web3Service.getRoleString(Role.None)).toBe("None");
  });

  it("should format EvidenceType enum values to string correctly", () => {
    expect(web3Service.getEvidenceTypeString(EvidenceType.Image)).toBe("Image");
    expect(web3Service.getEvidenceTypeString(EvidenceType.Video)).toBe("Video");
    expect(web3Service.getEvidenceTypeString(EvidenceType.Document)).toBe("Document");
    expect(web3Service.getEvidenceTypeString(EvidenceType.Other)).toBe("Other");
  });

  it("should return false for contract connected initially without setup", () => {
    expect(web3Service.isContractConnected()).toBe(false);
  });
});
