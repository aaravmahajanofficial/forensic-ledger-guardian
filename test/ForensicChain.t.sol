// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain chain;

    address court = address(this); // Foundry test contract runs as address(this)
    address officer = address(0x2);

    function setUp() public {
        // By default, the creator gets the Court role in constructor
        chain = new ForensicChain();

        chain.setGlobalRole(officer, ForensicChain.Role.Officer);
    }

    function testGetEvidenceById_FIR() public {
        // Create an FIR
        vm.startPrank(officer);
        chain.fileFIR("fir1", "Test FIR");

        // Submit Evidence
        chain.submitFIREvidence(
            "fir1",
            "ev1",
            "cid1",
            "hash1",
            ForensicChain.EvidenceType.Document
        );
        vm.stopPrank();

        // Retrieve evidence by ID
        ForensicChain.Evidence memory ev = chain.getEvidenceById("fir1", "ev1");

        assertEq(ev.evidenceId, "ev1");
        assertEq(ev.cid, "cid1");
        assertEq(ev.hashOriginal, "hash1");
        assertEq(uint(ev.evidenceType), uint(ForensicChain.EvidenceType.Document));
        assertEq(ev.submittedBy, officer);
    }

    function testGetEvidenceById_Case() public {
        // Create an FIR
        vm.startPrank(officer);
        chain.fileFIR("fir1", "Test FIR");
        vm.stopPrank();

        // Court promotes to Case
        string[] memory tags = new string[](1);
        tags[0] = "tag1";
        chain.createCaseFromFIR("case1", "fir1", "Case 1", "Desc", tags);
        chain.assignCaseRole("case1", officer, ForensicChain.Role.Officer);

        vm.startPrank(officer);
        // Submit Case Evidence
        chain.submitCaseEvidence(
            "case1",
            "ev2",
            "cid2",
            "hash2",
            ForensicChain.EvidenceType.Other
        );
        vm.stopPrank();

        ForensicChain.Evidence memory ev = chain.getEvidenceById("case1", "ev2");

        assertEq(ev.evidenceId, "ev2");
        assertEq(ev.cid, "cid2");
        assertEq(ev.hashOriginal, "hash2");
        assertEq(uint(ev.evidenceType), uint(ForensicChain.EvidenceType.Other));
        assertEq(ev.submittedBy, officer);
    }

    function testGetEvidenceByIdNotFound() public {
        // Create an FIR
        vm.startPrank(officer);
        chain.fileFIR("fir1", "Test FIR");

        // Submit Evidence
        chain.submitFIREvidence(
            "fir1",
            "ev1",
            "cid1",
            "hash1",
            ForensicChain.EvidenceType.Document
        );
        vm.stopPrank();

        // Retrieve evidence by wrong ID should revert
        vm.expectRevert("Evidence not found");
        chain.getEvidenceById("fir1", "ev2");
    }
}
