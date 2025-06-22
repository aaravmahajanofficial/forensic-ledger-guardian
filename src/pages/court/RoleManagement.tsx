import React, { useState } from "react";
import { UserCog, Save, Plus, Trash2, Check, X, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ROLES, ROLE_NAMES } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import CaseAccessControl from "@/components/court/CaseAccessControl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility function to convert role number to string
const getRoleString = (role: number): string => {
  return ROLE_NAMES[role as keyof typeof ROLE_NAMES] || "Unknown";
};

// Type for user object
interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  caseAccess: string[];
}

// Type for new user form
interface NewUser {
  name: string;
  email: string;
  address: string;
  role: number;
}

const RoleManagement = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@court.gov",
      role: ROLES.COURT,
      caseAccess: ["C-2023-001", "C-2023-005"],
    },
    {
      id: "2",
      name: "Emma Clark",
      email: "emma@police.gov",
      role: ROLES.OFFICER,
      caseAccess: ["C-2023-001", "C-2023-002"],
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael@lab.gov",
      role: ROLES.FORENSIC,
      caseAccess: ["C-2023-002"],
    },
    {
      id: "4",
      name: "Sarah Johnson",
      email: "sarah@legal.gov",
      role: ROLES.LAWYER,
      caseAccess: ["C-2023-001", "C-2023-005"],
    },
  ]);

  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    address: "",
    role: ROLES.NONE,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSaveRoles = () => {
    toast({
      title: "Changes Saved",
      description: "User role assignments have been securely saved.",
      variant: "default",
    });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.address || newUser.role === ROLES.NONE) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and select a role.",
        variant: "destructive",
      });
      return;
    }

    setUsers([
      ...users,
      {
        id: `${Date.now()}`, // Use a more robust ID in a real app
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        caseAccess: [],
      },
    ]);

    setNewUser({ name: "", email: "", address: "", role: ROLES.NONE });
    setShowAddForm(false);

    toast({
      title: "User Added",
      description: `${newUser.name} has been added to the system.`,
      variant: "default",
    });
  };

  const handleRemoveUser = (id: string) => {
    const userToRemove = users.find((user) => user.id === id);
    setUsers(users.filter((user) => user.id !== id));
    toast({
      title: "User Removed",
      description: `${userToRemove?.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const getRoleBadgeVariant = (role: number): BadgeProps["variant"] => {
    switch (role) {
      case ROLES.COURT:
        return "secondary";
      case ROLES.OFFICER:
        return "default";
      case ROLES.FORENSIC:
        return "success";
      case ROLES.LAWYER:
        return "warning";
      default:
        return "outline";
    }
  };

  // Render mobile-specific card for each user
  const renderUserCard = (user: User) => (
    <Card key={user.id} className="mb-4 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-primary">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <Badge variant={getRoleBadgeVariant(user.role)}>
            {getRoleString(user.role)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Label className="text-sm text-muted-foreground mb-2 block">Case Access</Label>
        <div className="flex flex-wrap gap-2">
          {user.caseAccess.length > 0 ? (
            user.caseAccess.map((caseId) => (
              <Badge
                key={caseId}
                variant="outline"
                className="font-mono"
              >
                {caseId}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No cases assigned
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRemoveUser(user.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove User</span>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 bg-background text-foreground">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <UserCog className="h-8 w-8 text-secondary" />
            Role Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles, permissions, and access to sensitive case data.
          </p>
        </div>
        <Button
          onClick={handleSaveRoles}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </header>

      <div className="grid gap-8">
        <Card className="shadow-lg border-border">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">User Role Assignments</CardTitle>
              <CardDescription>
                Add, remove, or modify user roles and permissions.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto"
            >
              {showAddForm ? (
                <X className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {showAddForm ? "Cancel" : "Add New User"}
            </Button>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <div className="bg-muted/50 border rounded-lg p-4 md:p-6 mb-6 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  New User Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Jane Doe"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., jane.doe@example.com"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input
                      id="address"
                      placeholder="0x..."
                      value={newUser.address}
                      onChange={(e) =>
                        setNewUser({ ...newUser, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Assign Role</Label>
                    <Select
                      value={String(newUser.role)}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(ROLES.NONE)} disabled>Select a role</SelectItem>
                        <SelectItem value={String(ROLES.COURT)}>Court</SelectItem>
                        <SelectItem value={String(ROLES.OFFICER)}>Officer</SelectItem>
                        <SelectItem value={String(ROLES.FORENSIC)}>Forensic</SelectItem>
                        <SelectItem value={String(ROLES.LAWYER)}>Lawyer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddUser}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm and Add User
                  </Button>
                </div>
              </div>
            )}

            {isMobile ? (
              <div className="space-y-4">{users.map(renderUserCard)}</div>
            ) : (
              <ScrollArea className="w-full rounded-md border">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Case Access</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-primary font-semibold">{user.name}</span>
                            <span className="text-muted-foreground text-sm">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                            {getRoleString(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {user.caseAccess.length > 0 ? (
                              user.caseAccess.map((caseId) => (
                                <Badge
                                  key={caseId}
                                  variant="outline"
                                  className="font-mono"
                                >
                                  {caseId}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm italic">N/A</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove {user.name}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              <strong>{users.length}</strong> users currently in the system.
            </p>
            <p className="text-xs text-muted-foreground italic">Changes are recorded on the blockchain.</p>
          </CardFooter>
        </Card>

        <CaseAccessControl />
      </div>
    </div>
  );
};

export default RoleManagement;
