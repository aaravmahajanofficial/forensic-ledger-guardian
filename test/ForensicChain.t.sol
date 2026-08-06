// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain fc;
    address court = address(0x1);
    address user = address(0x2);

    event RoleAssigned(string indexed caseId, address indexed user, ForensicChain.Role role);

    function setUp() public {
        fc = new ForensicChain();
        // msg.sender (address(this)) is the owner and has Role.Court by default due to constructor
    }

    function test_AssignCaseRole_Success() public {
        string memory caseId = "case1";

        vm.expectEmit(true, true, false, true);
        emit RoleAssigned(caseId, user, ForensicChain.Role.Officer);

        fc.assignCaseRole(caseId, user, ForensicChain.Role.Officer);

        assertEq(uint(fc.caseRoles(caseId, user)), uint(ForensicChain.Role.Officer));
    }

    function test_AssignCaseRole_RevertNotCourt() public {
        string memory caseId = "case1";

        vm.prank(user); // User is not Court
        vm.expectRevert("Only Court can perform this action");
        fc.assignCaseRole(caseId, user, ForensicChain.Role.Officer);
    }

    function test_AssignCaseRole_RevertLocked() public {
        string memory caseId = "case1";

        fc.toggleSystemLock(); // Only court (address(this)) can lock

        vm.expectRevert("System is in emergency lock");
        fc.assignCaseRole(caseId, user, ForensicChain.Role.Officer);
    }

    function test_AssignCaseRole_RevertRoleNone() public {
        string memory caseId = "case1";

        vm.expectRevert("Cannot assign None role");
        fc.assignCaseRole(caseId, user, ForensicChain.Role.None);
    }
}
