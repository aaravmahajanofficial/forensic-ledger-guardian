// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain public forensicChain;

    address public court;
    address public officer;

    function setUp() public {
        court = address(this);
        officer = address(0x1);

        forensicChain = new ForensicChain();

        // Give officer the Officer role
        forensicChain.setGlobalRole(officer, ForensicChain.Role.Officer);
    }

    function test_GetCase_Success() public {
        string memory firId = "FIR-001";
        string memory caseId = "CASE-001";
        string memory title = "Test Case Title";
        string memory caseDesc = "Test Case Description";
        string[] memory tags = new string[](2);
        tags[0] = "Tag1";
        tags[1] = "Tag2";

        // File FIR as officer
        vm.prank(officer);
        forensicChain.fileFIR(firId, "FIR Description");

        // Create Case as court
        forensicChain.createCaseFromFIR(caseId, firId, title, caseDesc, tags);

        // Act: getCase
        ForensicChain.Case memory c = forensicChain.getCase(caseId);

        // Assert properties to verify getCase returns correct struct
        assertEq(c.caseId, caseId, "Case ID mismatch");
        assertEq(c.title, title, "Title mismatch");
        assertEq(c.description, caseDesc, "Description mismatch");
        assertEq(c.createdBy, court, "CreatedBy mismatch");
        assertFalse(c.seal, "Seal should be false");
        assertTrue(c.open, "Open should be true");
        assertEq(c.evidenceCount, 0, "EvidenceCount should be 0");
        assertEq(c.tags.length, 2, "Tags length mismatch");
        assertEq(c.tags[0], "Tag1", "Tag1 mismatch");
        assertEq(c.tags[1], "Tag2", "Tag2 mismatch");
    }

    function test_GetCase_NonExistent() public {
        vm.expectRevert("Case does not exist");
        forensicChain.getCase("NON_EXISTENT");
    }
}
