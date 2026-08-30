// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/ForensicChain.sol";

contract ForensicChainTest is Test {
    ForensicChain chain;

    address courtUser = address(this);
    address unauthorizedUser = address(0x123);

    function setUp() public {
        chain = new ForensicChain(); // The deployer gets the Role.Court role in the constructor

        // Sanity check
        assertEq(uint(chain.getGlobalRole(courtUser)), uint(ForensicChain.Role.Court));
    }

    function test_toggleSystemLock_success() public {
        // Initially should be false
        assertEq(chain.isSystemLocked(), false);

        // Call it as Court (the deployer)
        chain.toggleSystemLock();

        // Should be locked
        assertEq(chain.isSystemLocked(), true);

        // Call it again
        chain.toggleSystemLock();

        // Should be unlocked
        assertEq(chain.isSystemLocked(), false);
    }

    function test_toggleSystemLock_revert_unauthorized() public {
        // Change sender to unauthorized user
        vm.prank(unauthorizedUser);

        // Expect revert
        vm.expectRevert("Only Court can perform this action");
        chain.toggleSystemLock();
    }
}
