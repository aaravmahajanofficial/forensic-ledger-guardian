import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  UserPlus,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  UserX,
  User as UserIcon, // Aliased to avoid conflict
  FileText,
  UserCog,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ROLES, ROLE_NAMES, type RoleType } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { type User } from "@/types"; // Use `type` for type-only imports

// --- Mock Data ---
const userData: User[] = [
  {
    id: "0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T",
    name: "Michael Wong",
    email: "michael.wong@courts.gov",
    role: ROLES.COURT,
    status: "active",
    added: "2025-01-15T10:00:00Z",
    caseCount: 38,
    roleTitle: ROLE_NAMES[ROLES.COURT],
  },
  {
    id: "0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
    name: "John Smith",
    email: "john.smith@police.gov",
    role: ROLES.OFFICER,
    status: "active",
    added: "2025-01-20T10:00:00Z",
    caseCount: 15,
    roleTitle: ROLE_NAMES[ROLES.OFFICER],
  },
  {
    id: "0x2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A",
    name: "Emily Chen",
    email: "emily.chen@forensics.gov",
    role: ROLES.FORENSIC,
    status: "active",
    added: "2025-01-25T10:00:00Z",
    caseCount: 22,
    roleTitle: ROLE_NAMES[ROLES.FORENSIC],
  },
  {
    id: "0xB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0A1",
    name: "Sarah Lee",
    email: "sarah.lee@legal.gov",
    role: ROLES.LAWYER,
    status: "active",
    added: "2025-01-30T10:00:00Z",
    caseCount: 12,
    roleTitle: ROLE_NAMES[ROLES.LAWYER],
  },
  {
    id: "0x3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A2B",
    name: "Robert Johnson",
    email: "robert.johnson@police.gov",
    role: ROLES.OFFICER,
    status: "active",
    added: "2025-02-05T10:00:00Z",
    caseCount: 8,
    roleTitle: ROLE_NAMES[ROLES.OFFICER],
  },
  {
    id: "0xC4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A2B3",
    name: "David Williams",
    email: "david.williams@forensics.gov",
    role: ROLES.FORENSIC,
    status: "inactive",
    added: "2025-02-10T10:00:00Z",
    caseCount: 0,
    roleTitle: ROLE_NAMES[ROLES.FORENSIC],
  },
  {
    id: "0x4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A2B3C",
    name: "Jennifer Miller",
    email: "jennifer.miller@legal.gov",
    role: ROLES.LAWYER,
    status: "active",
    added: "2025-02-15T10:00:00Z",
    caseCount: 5,
    roleTitle: "",
  },
];

// --- Helper Functions ---

const getRoleTitle = (roleId: number): string => {
  const roleKey = Object.keys(ROLES).find(
    (key) => ROLES[key as keyof typeof ROLES] === roleId
  );
  switch (roleKey) {
    case "COURT":
      return "Court Judge";
    case "OFFICER":
      return "Police Officer";
    case "FORENSIC":
      return "Forensic Investigator";
    case "LAWYER":
      return "Defense Attorney";
    default:
      return "Unknown Role";
  }
};

const getRoleBadge = (role: number) => {
  switch (role) {
    case ROLES.COURT:
      return <Badge variant="secondary">Court</Badge>;
    case ROLES.OFFICER:
      return <Badge variant="default">Officer</Badge>;
    case ROLES.FORENSIC:
      return <Badge variant="success">Forensic</Badge>;
    case ROLES.LAWYER:
      return <Badge variant="warning">Lawyer</Badge>;
    default:
      return <Badge variant="destructive">Unknown</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  if (status === "active") {
    return <Badge variant="success">Active</Badge>;
  } else {
    return <Badge variant="secondary">Inactive</Badge>;
  }
};

// --- Dialog Components ---

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedUser: User) => void;
}

const EditUserDialog = ({
  user,
  open,
  onOpenChange,
  onSave,
}: EditUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role.toString(),
  });

  React.useEffect(() => {
    if (open) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role.toString(),
      });
    }
  }, [open, user]);

  const handleSave = () => {
    onSave({ ...user, ...formData, role: parseInt(formData.role) as RoleType });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and save changes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter user name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter user email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ROLES).map((roleId) => (
                  <SelectItem key={roleId} value={roleId.toString()}>
                    {getRoleTitle(roleId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ChangeRoleDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, roleId: number) => void;
}

const ChangeRoleDialog = ({
  user,
  open,
  onOpenChange,
  onSave,
}: ChangeRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(user.role.toString());

  React.useEffect(() => {
    if (open) {
      setSelectedRole(user.role.toString());
    }
  }, [open, user]);

  const handleSave = () => {
    onSave(user.id, parseInt(selectedRole));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {user.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Select New Role
            </label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ROLES).map((roleId) => (
                  <SelectItem key={roleId} value={roleId.toString()}>
                    {getRoleTitle(roleId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Change Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ConfirmDialogProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmText?: string;
  variant?: "default" | "destructive";
}

const ConfirmDialog = ({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmText = "Confirm",
  variant = "destructive",
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component ---

const ManageUsersPage = () => {
  const [filters, setFilters] = useState({
    query: "",
    role: "all",
    status: "all",
  });
  const [users, setUsers] = useState(userData);

  type DialogType = "edit" | "changeRole" | "remove" | "toggleStatus";
  const [activeDialog, setActiveDialog] = useState<{
    type: DialogType | null;
    user: User | null;
  }>({ type: null, user: null });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFilterChange = (
    type: "query" | "role" | "status",
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        if (!filters.query) return true;
        const query = filters.query.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
        );
      })
      .filter(
        (user) => filters.role === "all" || user.role === parseInt(filters.role)
      )
      .filter(
        (user) => filters.status === "all" || user.status === filters.status
      );
  }, [users, filters]);

  const openDialog = (type: DialogType, user: User) => {
    setActiveDialog({ type, user });
  };

  const closeDialog = () => {
    setActiveDialog({ type: null, user: null });
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    toast({
      title: "User Updated",
      description: `${updatedUser.name}'s information has been updated.`,
    });
    closeDialog();
  };

  const handleChangeRole = (userId: string, newRoleId: number) => {
    const roleType = newRoleId as RoleType;
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: roleType,
              roleTitle: ROLE_NAMES[roleType],
            }
          : user
      )
    );
    toast({
      title: "Role Changed",
      description: `User's role has been updated.`,
    });
    closeDialog();
  };

  const handleToggleStatus = () => {
    if (!activeDialog.user) return;
    const { user } = activeDialog;
    const newStatus = user.status === "active" ? "inactive" : "active";
    const actionText = newStatus === "active" ? "activated" : "deactivated";

    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    toast({
      title: `User ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      description: `${user.name}'s account has been ${actionText}.`,
    });
    closeDialog();
  };

  const handleRemoveUser = () => {
    if (!activeDialog.user) return;
    const { user } = activeDialog;
    setUsers(users.filter((u) => u.id !== user.id));
    toast({
      title: "User Removed",
      description: `${user.name}'s access has been revoked.`,
      variant: "destructive",
    });
    closeDialog();
  };

  const handleViewCases = (user: User) => {
    toast({
      title: "View Cases",
      description: `Viewing cases assigned to ${user.name}.`,
    });
    navigate("/cases");
  };

  return (
    <div className="space-y-8">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                User Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage system users and their permissions
              </p>
            </div>
            <Button
              onClick={() => navigate("/users/add")}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  className="pl-10"
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                />
              </div>
              <Select
                value={filters.role}
                onValueChange={(value) => handleFilterChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.values(ROLES).map((roleId) => (
                    <SelectItem key={roleId} value={roleId.toString()}>
                      {getRoleTitle(roleId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-left border-b">
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">
                      User
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">
                      Cases
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground">
                      Added On
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {user.name}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono truncate max-w-[200px]">
                          {user.id}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4 text-foreground font-medium">
                        {user.caseCount}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.added).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => openDialog("edit", user)}
                            >
                              <UserIcon className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewCases(user)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Cases
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDialog("changeRole", user)}
                            >
                              <UserCog className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDialog("toggleStatus", user)}
                            >
                              {user.status === "active" ? (
                                <ShieldOff className="mr-2 h-4 w-4" />
                              ) : (
                                <ShieldCheck className="mr-2 h-4 w-4" />
                              )}
                              {user.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDialog("remove", user)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      {activeDialog.type && activeDialog.user && (
        <>
          <EditUserDialog
            user={activeDialog.user}
            open={activeDialog.type === "edit"}
            onOpenChange={closeDialog}
            onSave={handleEditUser}
          />
          <ChangeRoleDialog
            user={activeDialog.user}
            open={activeDialog.type === "changeRole"}
            onOpenChange={closeDialog}
            onSave={handleChangeRole}
          />
          <ConfirmDialog
            title="Remove User Access"
            description={`Are you sure you want to revoke ${activeDialog.user.name}'s access? This action cannot be undone.`}
            open={activeDialog.type === "remove"}
            onOpenChange={closeDialog}
            onConfirm={handleRemoveUser}
            confirmText="Confirm Removal"
          />
          <ConfirmDialog
            title={`${
              activeDialog.user.status === "active" ? "Deactivate" : "Activate"
            } User`}
            description={`Are you sure you want to ${
              activeDialog.user.status === "active" ? "deactivate" : "activate"
            } ${activeDialog.user.name}'s account?`}
            open={activeDialog.type === "toggleStatus"}
            onOpenChange={closeDialog}
            onConfirm={handleToggleStatus}
            confirmText={
              activeDialog.user.status === "active" ? "Deactivate" : "Activate"
            }
            variant={
              activeDialog.user.status === "active" ? "destructive" : "default"
            }
          />
        </>
      )}
    </div>
  );
};

export default ManageUsersPage;
