// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain chain;

    function setUp() public {
        chain = new ForensicChain();
        chain.setGlobalRole(address(0x1337), ForensicChain.Role.Officer);
    }

    function testPerformanceGetMultipleEvidence() public {
        string memory firId = "FIR1";

        vm.prank(address(0x1337));
        chain.fileFIR(firId, "FIR Desc");

        string memory caseId = "CASE1";
        string[] memory tags = new string[](0);

        chain.createCaseFromFIR(caseId, firId, "Title", "Desc", tags);

        // Assign officer to case
        chain.assignCaseRole(caseId, address(0x1337), ForensicChain.Role.Officer);

        // Add 50 pieces of evidence
        vm.startPrank(address(0x1337));
        for (uint i = 0; i < 50; i++) {
            chain.submitCaseEvidence(
                caseId,
                string(abi.encodePacked("EVID", vm.toString(i))),
                string(abi.encodePacked("cid", vm.toString(i))),
                "hash",
                ForensicChain.EvidenceType.Document
            );
        }
        vm.stopPrank();

        // Sequential queries baseline
        uint256 gasStart = gasleft();
        for (uint i = 0; i < 50; i++) {
            chain.getEvidence(caseId, i);
        }
        uint256 gasEnd = gasleft();
        console.log("Gas used for 50 sequential getEvidence:", gasStart - gasEnd);
    }

    function testPerformanceGetBatchEvidence() public {
        string memory firId = "FIR2";
        vm.prank(address(0x1337));
        chain.fileFIR(firId, "FIR Desc");
        string memory caseId = "CASE2";
        string[] memory tags = new string[](0);
        chain.createCaseFromFIR(caseId, firId, "Title", "Desc", tags);
        chain.assignCaseRole(caseId, address(0x1337), ForensicChain.Role.Officer);

        vm.startPrank(address(0x1337));
        for (uint i = 0; i < 50; i++) {
            chain.submitCaseEvidence(
                caseId,
                string(abi.encodePacked("EVID", vm.toString(i))),
                string(abi.encodePacked("cid", vm.toString(i))),
                "hash",
                ForensicChain.EvidenceType.Document
            );
        }
        vm.stopPrank();

        uint256 gasStart = gasleft();
        chain.getEvidenceBatch(caseId, 0, 50);
        uint256 gasEnd = gasleft();
        console.log("Gas used for batch getEvidenceBatch:", gasStart - gasEnd);
    }
}
