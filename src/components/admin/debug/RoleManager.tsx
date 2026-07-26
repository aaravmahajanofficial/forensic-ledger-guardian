import React, { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/hooks/useWeb3";
import web3Service, { Role } from "@/services/web3Service";

interface RoleManagerProps {
  onClose?: () => void;
}

const RoleManager: React.FC<RoleManagerProps> = ({ onClose }) => {
  const { account, userRole } = useWeb3();
  const [currentRole, setCurrentRole] = useState<Role>(Role.None);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const roleNames = {
    [Role.None]: "None",
    [Role.Court]: "Court",
    [Role.Officer]: "Officer",
    [Role.Forensic]: "Forensic",
    [Role.Lawyer]: "Lawyer",
  };

  const loadCurrentInfo = useCallback(async () => {
    if (!web3Service.isContractConnected()) return;

    try {
      const role = await web3Service.getUserRole();
      setCurrentRole(role);
    } catch (error) {
      console.error("Error loading current info:", error);
      setMessage("Error loading current info");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => loadCurrentInfo(), 0);
  }, [loadCurrentInfo]);

  // Update local state when context changes
  useEffect(() => {
    setTimeout(() => setCurrentRole(userRole), 0);
  }, [userRole]);

  const setRole = async (newRole: Role) => {
    if (!account) return;

    setLoading(true);
    setMessage("");

    try {
      // First check if current user is Court (can assign roles)
      const currentUserRole = await web3Service.getUserRole();

      if (currentUserRole === Role.Court) {
        const success = await web3Service.setGlobalRole(account, newRole);
        if (success) {
          setMessage(`Successfully set role to ${roleNames[newRole]}`);
          await loadCurrentInfo();
        } else {
          setMessage("Failed to set role");
        }
      } else {
        setMessage(
          "Only Court role can assign roles. Please set yourself as Court first.",
        );
      }
    } catch (error: unknown) {
      console.error("Error setting role:", error);
      setMessage(
        `Error: ${
          error instanceof Error ? error.message : "Failed to set role"
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const becomeCourt = async () => {
    if (!account) return;

    setLoading(true);
    setMessage("");

    try {
      // Try to set as Court directly (only works if already Court or contract owner)
      const success = await web3Service.setGlobalRole(account, Role.Court);
      if (success) {
        setMessage("Successfully set as Court role");
        await loadCurrentInfo();
      } else {
        setMessage("Failed to set as Court. You might not have permission.");
      }
    } catch (error: unknown) {
      console.error("Error setting as Court:", error);
      setMessage(
        `Error: ${
          error instanceof Error ? error.message : "Failed to set as Court"
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Role Manager</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p>
              <strong>Account:</strong> {account}
            </p>
            <p>
              <strong>Current Role:</strong> {roleNames[currentRole]}
            </p>
          </div>

          {message && (
            <div
              className={`p-2 rounded ${
                message.includes("Error") || message.includes("Failed")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-2">
            <p className="font-semibold">Quick Actions:</p>

            <button
              onClick={becomeCourt}
              disabled={loading || currentRole === Role.Court}
              className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
            >
              {loading ? "Setting..." : "Set as Court (Admin)"}
            </button>

            <button
              onClick={() => setRole(Role.Officer)}
              disabled={loading || currentRole === Role.Officer}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? "Setting..." : "Set as Officer"}
            </button>

            <button
              onClick={() => setRole(Role.Forensic)}
              disabled={loading || currentRole === Role.Forensic}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              {loading ? "Setting..." : "Set as Forensic"}
            </button>

            <button
              onClick={() => setRole(Role.Lawyer)}
              disabled={loading || currentRole === Role.Lawyer}
              className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
            >
              {loading ? "Setting..." : "Set as Lawyer"}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Note:</strong> To create a case from FIR, you need Officer
              role.
            </p>
            <p>Only Court role can assign roles to users.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManager;
