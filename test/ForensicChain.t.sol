// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain fc;

    address owner = address(1);
    address officer = address(2);
    address forensic = address(3);
    address court = address(4);
    address otherUser = address(5);

    function setUp() public {
        vm.startPrank(court);
        fc = new ForensicChain(); // court is msg.sender so gets Role.Court

        fc.setGlobalRole(officer, ForensicChain.Role.Officer);
        fc.setGlobalRole(forensic, ForensicChain.Role.Forensic);
        vm.stopPrank();
    }

    function test_RevertSubmitFIREvidence_SystemLocked() public {
        // Setup an FIR
        vm.prank(officer);
        fc.fileFIR("FIR001", "Robbery");

        // Lock the system
        vm.prank(court);
        fc.toggleSystemLock();

        // Try submitting evidence
        vm.startPrank(officer);
        vm.expectRevert("System is in emergency lock");
        fc.submitFIREvidence("FIR001", "EV001", "CID123", "HASH", ForensicChain.EvidenceType.Image);
        vm.stopPrank();
    }

    function test_RevertSubmitFIREvidence_UnauthorizedRole() public {
        // Setup an FIR
        vm.prank(officer);
        fc.fileFIR("FIR002", "Cyber crime");

        // Use otherUser who is not Officer or Forensic
        vm.prank(otherUser);
        vm.expectRevert("Unauthorized");
        fc.submitFIREvidence("FIR002", "EV002", "CID124", "HASH", ForensicChain.EvidenceType.Document);
    }

    function test_RevertSubmitFIREvidence_FIRNotFound() public {
        // FIR does not exist
        vm.prank(officer);
        vm.expectRevert("FIR not found");
        fc.submitFIREvidence("NON_EXISTENT_FIR", "EV003", "CID125", "HASH", ForensicChain.EvidenceType.Other);
    }

    function test_RevertSubmitFIREvidence_FIRAlreadyPromoted() public {
        // Setup an FIR
        vm.prank(officer);
        fc.fileFIR("FIR004", "Theft");

        // Promote to Case
        vm.prank(court);
        string[] memory tags = new string[](0);
        fc.createCaseFromFIR("CASE004", "FIR004", "Theft Case", "Description", tags);

        // Try to submit evidence to FIR
        vm.prank(officer);
        vm.expectRevert("FIR already promoted to case");
        fc.submitFIREvidence("FIR004", "EV004", "CID126", "HASH", ForensicChain.EvidenceType.Video);
    }

    function test_RevertSubmitFIREvidence_DuplicateEvidence() public {
        // Setup an FIR
        vm.prank(officer);
        fc.fileFIR("FIR005", "Fraud");

        // Submit evidence
        vm.prank(officer);
        fc.submitFIREvidence("FIR005", "EV005", "CID_DUPLICATE", "HASH", ForensicChain.EvidenceType.Document);

        // Submit the same CID again
        vm.prank(officer);
        vm.expectRevert("Duplicate evidence detected");
        fc.submitFIREvidence("FIR005", "EV006", "CID_DUPLICATE", "HASH2", ForensicChain.EvidenceType.Image);
    }
}
