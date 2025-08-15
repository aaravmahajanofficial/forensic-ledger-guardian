import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  UserX,
  User,
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
import { Role } from "@/services/web3Service";
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

// User type
interface UserType {
  id: string;
  name: string;
  email: string;
  role: number;
  status: string;
  added: string;
  caseCount: number;
}

// Mock user data
const userData = [
  {
    id: "0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T",
    name: "Michael Wong",
    email: "michael.wong@courts.gov",
    role: Role.Court,
    status: "active",
    added: "2025-01-15T10:00:00Z",
    caseCount: 38,
  },
  {
    id: "0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
    name: "John Smith",
    email: "john.smith@police.gov",
    role: Role.Officer,
    status: "active",
    added: "2025-01-20T10:00:00Z",
    caseCount: 15,
  },
  {
    id: "0x2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A",
    name: "Emily Chen",
    email: "emily.chen@forensics.gov",
    role: Role.Forensic,
    status: "active",
    added: "2025-01-25T10:00:00Z",
    caseCount: 22,
  },
  {
    id: "0xB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0A1",
    name: "Sarah Lee",
    email: "sarah.lee@legal.gov",
    role: Role.Lawyer,
    status: "active",
    added: "2025-01-30T10:00:00Z",
    caseCount: 12,
  },
  {
    id: "0x3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A2B",
    name: "Robert Johnson",
    email: "robert.johnson@police.gov",
    role: Role.Officer,
    status: "active",
    added: "2025-02-05T10:00:00Z",
    caseCount: 8,
  },
  {
    id: "0xC4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A2B3",
    name: "David Williams",
    email: "david.williams@forensics.gov",
    role: Role.Forensic,
    status: "inactive",
    added: "2025-02-10T10:00:00Z",
    caseCount: 0,
  },
  {
    id: "0x4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1A2B3C",
    name: "Jennifer Miller",
    email: "jennifer.miller@legal.gov",
    role: Role.Lawyer,
    status: "active",
    added: "2025-02-15T10:00:00Z",
    caseCount: 5,
  },
];

interface EditUserDialogProps {
  user: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedUser: UserType) => void;
}

const EditUserDialog = ({
  user,
  open,
  onOpenChange,
  onSave,
}: EditUserDialogProps) => {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [selectedRole, setSelectedRole] = useState<string>(
    user.role.toString()
  );

  const handleSave = () => {
    onSave({
      ...user,
      name,
      email,
      role: parseInt(selectedRole),
    });
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.Court.toString()}>
                  Court Judge
                </SelectItem>
                <SelectItem value={Role.Officer.toString()}>
                  Police Officer
                </SelectItem>
                <SelectItem value={Role.Forensic.toString()}>
                  Forensic Investigator
                </SelectItem>
                <SelectItem value={Role.Lawyer.toString()}>
                  Defense Attorney
                </SelectItem>
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
  user: UserType;
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
  const [selectedRole, setSelectedRole] = useState<string>(
    user.role.toString()
  );

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
                <SelectItem value={Role.Court.toString()}>
                  Court Judge
                </SelectItem>
                <SelectItem value={Role.Officer.toString()}>
                  Police Officer
                </SelectItem>
                <SelectItem value={Role.Forensic.toString()}>
                  Forensic Investigator
                </SelectItem>
                <SelectItem value={Role.Lawyer.toString()}>
                  Defense Attorney
                </SelectItem>
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
}

const ConfirmDialog = ({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
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
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<UserType[]>(userData as UserType[]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter users based on search and filters
  const filteredUsers = users
    .filter((user) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((user) => {
      // Role filter
      if (roleFilter === "all") return true;
      return user.role === parseInt(roleFilter);
    })
    .filter((user) => {
      // Status filter
      if (statusFilter === "all") return true;
      return user.status === statusFilter;
    });

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.Court:
        return <Badge className="bg-forensic-court text-white">Court</Badge>;
      case Role.Officer:
        return <Badge className="bg-forensic-800 text-white">Officer</Badge>;
      case Role.Forensic:
        return (
          <Badge className="bg-forensic-accent text-white">Forensic</Badge>
        );
      case Role.Lawyer:
        return (
          <Badge className="bg-forensic-warning text-forensic-900">
            Lawyer
          </Badge>
        );
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <Badge className="bg-forensic-success/20 text-forensic-success">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-forensic-400/20 text-forensic-500">Inactive</Badge>
      );
    }
  };

  const handleEditUser = (updatedUser: UserType) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    toast({
      title: "User Updated",
      description: `${updatedUser.name}'s information has been updated.`,
    });
  };

  const handleChangeRole = (userId: string, newRoleId: number) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, role: newRoleId };
      }
      return user;
    });

    setUsers(updatedUsers);
    toast({
      title: "Role Changed",
      description: `User's role has been updated.`,
    });
  };

  const handleToggleStatus = () => {
    if (!selectedUser) return;

    const newStatus = selectedUser.status === "active" ? "inactive" : "active";
    const actionText = newStatus === "active" ? "activated" : "deactivated";

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return { ...user, status: newStatus };
      }
      return user;
    });

    setUsers(updatedUsers);
    setToggleStatusDialogOpen(false);

    toast({
      title: `User ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      description: `${selectedUser.name}'s account has been ${actionText}.`,
    });
  };

  const handleRemoveUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setRemoveDialogOpen(false);

    toast({
      title: "User Removed",
      description: `${selectedUser.name}'s access has been revoked.`,
      variant: "destructive",
    });
  };

  const handleViewCases = (user: UserType) => {
    toast({
      title: "View Cases",
      description: `Viewing cases assigned to ${user.name}.`,
    });
    navigate("/cases");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">
          User Management
        </h1>
        <Button
          className="bg-forensic-court hover:bg-forensic-court/90 flex items-center gap-2"
          onClick={() => navigate("/users/add")}
        >
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-500" />
          <Input
            placeholder="Search users..."
            className="pl-8 border-forensic-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-forensic-500" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="border-forensic-200">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={Role.Court.toString()}>Court</SelectItem>
              <SelectItem value={Role.Officer.toString()}>Officer</SelectItem>
              <SelectItem value={Role.Forensic.toString()}>Forensic</SelectItem>
              <SelectItem value={Role.Lawyer.toString()}>Lawyer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-forensic-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-forensic-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Manage all users in the forensic evidence system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-forensic-200">
                  <th className="px-4 py-3 text-sm font-medium text-forensic-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-forensic-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-forensic-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-forensic-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-forensic-500">
                    Cases
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-forensic-500">
                    Added
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-forensic-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-forensic-100 hover:bg-forensic-50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-forensic-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-forensic-500 font-mono truncate w-24 md:w-auto">
                          {user.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3 text-forensic-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                    <td className="px-4 py-3 text-forensic-600">
                      {user.caseCount}
                    </td>
                    <td className="px-4 py-3 text-forensic-600">
                      {new Date(user.added).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
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
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="flex items-center w-full justify-start px-0"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Edit User
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleViewCases(user)}
                          >
                            <Button
                              variant="ghost"
                              className="flex items-center w-full justify-start px-0"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Cases
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setChangeRoleDialogOpen(true);
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="flex items-center w-full justify-start px-0 text-forensic-court"
                            >
                              <UserCog className="h-4 w-4 mr-2" />
                              Change Role
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setToggleStatusDialogOpen(true);
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="flex items-center w-full justify-start px-0 text-forensic-warning"
                            >
                              {user.status === "active" ? (
                                <>
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setRemoveDialogOpen(true);
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="flex items-center w-full justify-start px-0 text-forensic-danger"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Remove Access
                            </Button>
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

      {/* Dialogs */}
      {selectedUser && (
        <>
          <EditUserDialog
            user={selectedUser}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSave={handleEditUser}
          />

          <ChangeRoleDialog
            user={selectedUser}
            open={changeRoleDialogOpen}
            onOpenChange={setChangeRoleDialogOpen}
            onSave={handleChangeRole}
          />

          <ConfirmDialog
            title="Remove User Access"
            description={`Are you sure you want to revoke ${selectedUser.name}'s access to the system? This action cannot be undone.`}
            open={removeDialogOpen}
            onOpenChange={setRemoveDialogOpen}
            onConfirm={handleRemoveUser}
          />

          <ConfirmDialog
            title={
              selectedUser.status === "active"
                ? "Deactivate User"
                : "Activate User"
            }
            description={`Are you sure you want to ${
              selectedUser.status === "active" ? "deactivate" : "activate"
            } ${selectedUser.name}'s account?`}
            open={toggleStatusDialogOpen}
            onOpenChange={setToggleStatusDialogOpen}
            onConfirm={handleToggleStatus}
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;
