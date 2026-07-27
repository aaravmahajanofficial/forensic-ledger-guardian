/**
 * Unified Role Management Types
 * Consolidates all role-related types and configurations for export.
 */

import { Role } from "@/services/web3Service";
import type {
  RoleAssignment,
  UserProfile,
} from "@/services/roleManagementService";

// Export types for convenience
export type { RoleAssignment, UserProfile };
export { Role };
