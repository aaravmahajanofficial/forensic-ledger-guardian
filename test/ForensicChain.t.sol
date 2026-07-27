// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain public forensicChain;

    address public courtUser = address(1);
    address public nonCourtUser = address(2);
    address public targetUser = address(3);

    function setUp() public {
        vm.prank(courtUser);
        forensicChain = new ForensicChain();
    }

    function test_setGlobalRole_RevertsIfNonCourt() public {
        vm.prank(nonCourtUser);
        vm.expectRevert("Only Court can perform this action");
        forensicChain.setGlobalRole(targetUser, ForensicChain.Role.Officer);
    }

    function test_setGlobalRole_Success() public {
        vm.prank(courtUser);
        forensicChain.setGlobalRole(targetUser, ForensicChain.Role.Officer);
        assertEq(uint(forensicChain.globalRoles(targetUser)), uint(ForensicChain.Role.Officer));
    }
}
