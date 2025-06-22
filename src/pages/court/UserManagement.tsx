import { useState, useMemo } from "react";
import {
  Users,
  Search,
  MoreVertical,
  UserPlus,
  Trash2,
  UserX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logInfo } from "@/utils/logger";

type UserRole = "admin" | "court" | "detective" | "officer" | "forensic" | "lawyer";
type UserStatus = "active" | "inactive" | "suspended";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
  avatarUrl?: string;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

  // Mock users data
  const users: SystemUser[] = useMemo(
    () => [
      {
        id: "1",
        name: "Judge Sarah Wilson",
        email: "sarah.wilson@court.gov",
        role: "court",
        organization: "Metropolitan Court",
        status: "active",
        lastLogin: new Date("2024-07-15T10:30:00"),
        createdAt: new Date("2023-06-15"),
        avatarUrl: "/avatars/judge.png",
      },
      {
        id: "2",
        name: "Detective Mike Johnson",
        email: "mike.johnson@police.gov",
        role: "detective",
        organization: "Metro Police Department",
        status: "active",
        lastLogin: new Date("2024-07-15T09:15:00"),
        createdAt: new Date("2023-08-20"),
        avatarUrl: "/avatars/detective.png",
      },
      {
        id: "3",
        name: "Dr. Emily Chen",
        email: "emily.chen@forensics.gov",
        role: "forensic",
        organization: "State Forensic Laboratory",
        status: "active",
        lastLogin: new Date("2024-07-14T16:45:00"),
        createdAt: new Date("2023-05-10"),
        avatarUrl: "/avatars/forensic.png",
      },
      {
        id: "4",
        name: "Attorney David Lee",
        email: "david.lee@lawfirm.com",
        role: "lawyer",
        organization: "Lee & Associates",
        status: "inactive",
        lastLogin: new Date("2024-05-14T14:20:00"),
        createdAt: new Date("2023-07-05"),
        avatarUrl: "/avatars/lawyer.png",
      },
      {
        id: "5",
        name: "Admin User",
        email: "admin@system.gov",
        role: "admin",
        organization: "System Administration",
        status: "active",
        lastLogin: new Date("2024-07-15T11:00:00"),
        createdAt: new Date("2023-01-01"),
        avatarUrl: "/avatars/admin.png",
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
        avatarUrl: "/avatars/officer.png",
      },
    ],
    []
  );

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

  const getRoleBadgeVariant = (role: UserRole): BadgeProps["variant"] => {
    switch (role) {
      case "admin":
        return "destructive";
      case "court":
        return "default";
      case "detective":
        return "secondary";
      case "officer":
        return "secondary";
      case "forensic":
        return "outline";
      case "lawyer":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIndicator = (status: UserStatus) => {
    switch (status) {
      case "active":
        return <div className="flex items-center"><div className="h-2 w-2 rounded-full bg-green-500 mr-2" />Active</div>;
      case "inactive":
        return <div className="flex items-center"><div className="h-2 w-2 rounded-full bg-gray-400 mr-2" />Inactive</div>;
      case "suspended":
        return <div className="flex items-center"><div className="h-2 w-2 rounded-full bg-red-500 mr-2" />Suspended</div>;
      default:
        return <div className="flex items-center"><div className="h-2 w-2 rounded-full bg-gray-400 mr-2" />Unknown</div>;
    }
  };

  const handleEditUser = (user: SystemUser) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
    logInfo(`Editing user: ${user.name}`);
  };
  
  const AddUserDialog = () => (
    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new system user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Form fields for adding a new user */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
          <Button type="submit">Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const EditUserDialog = () => (
    <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit User Profile</DialogTitle>
          <DialogDescription>
            Update user details and permissions for {selectedUser?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Form fields for editing user */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">User Management</h1>
        <p className="mt-2 text-muted-foreground">
          Administer and manage all system users, roles, and permissions.
        </p>
      </header>

      <Card className="border-border/40 shadow-lg">
        <CardHeader className="border-b border-border/40 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, org..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border/60 focus:ring-primary"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] bg-input border-border/60">
                  <SelectValue placeholder="Filter by role" />
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
                <SelectTrigger className="w-[180px] bg-input border-border/60">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AddUserDialog />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b-border/40">
                <TableHead className="w-[280px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-border/20">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize text-sm">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusIndicator(user.status)}
                  </TableCell>
                  <TableCell>{user.organization}</TableCell>
                  <TableCell>
                    {user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Edit Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>Deactivate User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <EditUserDialog />
    </div>
  );
};

export default UserManagement;
