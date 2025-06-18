import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Shield,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logInfo } from "@/utils/logger";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "court" | "detective" | "officer" | "forensic" | "lawyer";
  organization: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: Date | null;
  createdAt: Date;
  permissions: string[];
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock users data
  const users: SystemUser[] = useMemo(() => [
    {
      id: "1",
      name: "Judge Sarah Wilson",
      email: "sarah.wilson@court.gov",
      role: "court",
      organization: "Metropolitan Court",
      status: "active",
      lastLogin: new Date("2024-01-15T10:30:00"),
      createdAt: new Date("2023-06-15"),
      permissions: [
        "view_all_cases",
        "manage_court_orders",
        "access_confidential",
      ],
    },
    {
      id: "2",
      name: "Detective Mike Johnson",
      email: "mike.johnson@police.gov",
      role: "detective",
      organization: "Metro Police Department",
      status: "active",
      lastLogin: new Date("2024-01-15T09:15:00"),
      createdAt: new Date("2023-08-20"),
      permissions: ["upload_evidence", "view_cases", "manage_chain_custody"],
    },
    {
      id: "3",
      name: "Dr. Emily Chen",
      email: "emily.chen@forensics.gov",
      role: "forensic",
      organization: "State Forensic Laboratory",
      status: "active",
      lastLogin: new Date("2024-01-14T16:45:00"),
      createdAt: new Date("2023-05-10"),
      permissions: ["analyze_evidence", "create_reports", "view_lab_data"],
    },
    {
      id: "4",
      name: "Attorney David Lee",
      email: "david.lee@lawfirm.com",
      role: "lawyer",
      organization: "Lee & Associates",
      status: "active",
      lastLogin: new Date("2024-01-14T14:20:00"),
      createdAt: new Date("2023-07-05"),
      permissions: [
        "view_assigned_cases",
        "access_legal_docs",
        "client_communication",
      ],
    },
    {
      id: "5",
      name: "Admin User",
      email: "admin@system.gov",
      role: "admin",
      organization: "System Administration",
      status: "active",
      lastLogin: new Date("2024-01-15T11:00:00"),
      createdAt: new Date("2023-01-01"),
      permissions: [
        "manage_users",
        "system_config",
        "view_audit_logs",
        "backup_restore",
      ],
    },
    {
      id: "6",
      name: "Officer Jane Smith",
      email: "jane.smith@police.gov",
      role: "officer",
      organization: "Metro Police Department",
      status: "suspended",
      lastLogin: new Date("2024-01-10T08:30:00"),
      createdAt: new Date("2023-09-15"),
      permissions: ["basic_evidence_upload", "view_assigned_cases"],
    },
  ], []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "court":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "detective":
        return "bg-green-100 text-green-800 border-green-200";
      case "officer":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "forensic":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "lawyer":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "suspended":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEditUser = (user: SystemUser) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleStatusToggle = (userId: string, currentStatus: string) => {
    // Mock implementation - would integrate with backend
    logInfo(`Toggling status for user ${userId} from ${currentStatus}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-forensic-800 flex items-center gap-2">
            <Users className="h-8 w-8 text-forensic-court" />
            User Management
          </h1>
          <p className="text-forensic-600 mt-1">
            Manage system users, roles, and permissions across all organizations
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.status === "active").length}
                </p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  {users.filter((u) => u.status === "inactive").length}
                </p>
                <p className="text-sm text-gray-600">Inactive Users</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter((u) => u.status === "suspended").length}
                </p>
                <p className="text-sm text-gray-600">Suspended</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-forensic-800">
                  {users.length}
                </p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <Users className="h-8 w-8 text-forensic-court" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users, emails, or organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="court">Court</SelectItem>
                <SelectItem value="detective">Detective</SelectItem>
                <SelectItem value="officer">Officer</SelectItem>
                <SelectItem value="forensic">Forensic</SelectItem>
                <SelectItem value="lawyer">Lawyer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>System Users</span>
            <Badge variant="outline" className="text-sm">
              {filteredUsers.length} users
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize border ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        {user.organization}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <span className="capitalize">{user.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div className="text-sm">
                          <p>{user.lastLogin.toLocaleDateString()}</p>
                          <p className="text-gray-500">
                            {user.lastLogin.toLocaleTimeString()}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{user.permissions.length} permissions</p>
                        <p
                          className="text-gray-500 truncate max-w-32"
                          title={user.permissions.join(", ")}
                        >
                          {user.permissions.slice(0, 2).join(", ")}
                          {user.permissions.length > 2 && "..."}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusToggle(user.id, user.status)
                          }
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify user details, role assignments, and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={selectedUser.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={selectedUser.email} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="court">Court</SelectItem>
                      <SelectItem value="detective">Detective</SelectItem>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="forensic">Forensic</SelectItem>
                      <SelectItem value="lawyer">Lawyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    defaultValue={selectedUser.organization}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Account Active</Label>
                <Switch
                  id="active"
                  defaultChecked={selectedUser.status === "active"}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
