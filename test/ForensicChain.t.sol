// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain public chain;

    address public court = address(1);
    address public officer = address(2);
    address public lawyer = address(3);
    address public unauthorizedUser = address(4);

    string public caseId = "CASE-123";
    string public firId = "FIR-123";
    string public evidenceId = "EVD-123";
    string public cid = "QmTestCid";
    string public hashOriginal = "hash123";

    function setUp() public {
        // Deploy as the Court (which becomes msg.sender = Court)
        vm.prank(court);
        chain = new ForensicChain();

        // Court assigns global roles
        vm.startPrank(court);
        chain.setGlobalRole(officer, ForensicChain.Role.Officer);
        chain.setGlobalRole(lawyer, ForensicChain.Role.Lawyer);
        vm.stopPrank();

        // Officer files an FIR
        vm.prank(officer);
        chain.fileFIR(firId, "Test FIR Description");

        // Court promotes FIR to Case
        string[] memory tags = new string[](1);
        tags[0] = "theft";
        vm.prank(court);
        chain.createCaseFromFIR(caseId, firId, "Test Case", "Test Description", tags);

        // Court assigns lawyer and officer to the case
        vm.startPrank(court);
        chain.assignCaseRole(caseId, lawyer, ForensicChain.Role.Lawyer);
        chain.assignCaseRole(caseId, officer, ForensicChain.Role.Officer);
        vm.stopPrank();

        // Officer submits evidence to the case
        vm.prank(officer);
        chain.submitCaseEvidence(
            caseId,
            evidenceId,
            cid,
            hashOriginal,
            ForensicChain.EvidenceType.Document
        );
    }

    function test_VerifyEvidence_ValidHash() public {
        vm.prank(lawyer);
        bool isValid = chain.verifyEvidence(caseId, 0, hashOriginal);
        assertTrue(isValid, "Evidence hash should be valid");
    }

    function test_VerifyEvidence_InvalidHash() public {
        vm.prank(lawyer);
        bool isValid = chain.verifyEvidence(caseId, 0, "wrongHash");
        assertFalse(isValid, "Evidence hash should be invalid");
    }

    function test_VerifyEvidence_InvalidIndexReverts() public {
        vm.prank(lawyer);
        vm.expectRevert("Invalid evidence index");
        chain.verifyEvidence(caseId, 999, hashOriginal);
    }

    function test_VerifyEvidence_NotAssignedReverts() public {
        vm.prank(unauthorizedUser);
        vm.expectRevert("Not assigned to case");
        chain.verifyEvidence(caseId, 0, hashOriginal);
    }
}
