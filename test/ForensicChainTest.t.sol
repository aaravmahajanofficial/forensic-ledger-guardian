pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain public forensicChain;

    address public courtUser = address(1);
    address public testUser = address(2);

    function setUp() public {
        vm.startPrank(courtUser);
        forensicChain = new ForensicChain();

        // Constructor sets msg.sender to Court role

        vm.stopPrank();
    }

    function test_getMyRoleInCase() public {
        string memory testCaseId = "case123";
        string memory firId = "fir123";
        string[] memory tags = new string[](0);

        // Use court user to create case and assign role
        vm.startPrank(courtUser);

        // First assign an officer role to someone to file FIR
        address officerUser = address(3);
        forensicChain.setGlobalRole(officerUser, ForensicChain.Role.Officer);
        vm.stopPrank();

        // Officer files FIR
        vm.startPrank(officerUser);
        forensicChain.fileFIR(firId, "Test Description");
        vm.stopPrank();

        // Court promotes FIR to case and assigns role
        vm.startPrank(courtUser);
        forensicChain.createCaseFromFIR(testCaseId, firId, "Test Case", "Description", tags);
        forensicChain.assignCaseRole(testCaseId, testUser, ForensicChain.Role.Officer);
        vm.stopPrank();

        // Check role for test user
        vm.prank(testUser);
        ForensicChain.Role roleAfter = forensicChain.getMyRoleInCase(testCaseId);
        assertEq(uint(roleAfter), uint(ForensicChain.Role.Officer));

        // Check role for unassigned user
        vm.prank(address(4));
        ForensicChain.Role unassignedRole = forensicChain.getMyRoleInCase(testCaseId);
        assertEq(uint(unassignedRole), uint(ForensicChain.Role.None));
    }
}
