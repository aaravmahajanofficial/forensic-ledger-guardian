import React, { useState } from "react";
import { UserCog, Save, Plus, Trash2, Check, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ROLES, ROLE_NAMES } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import CaseAccessControl from "@/components/court/CaseAccessControl";

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
      title: "Roles Saved",
      description: "User role assignments have been saved to the blockchain",
    });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.address) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setUsers([
      ...users,
      {
        id: `${users.length + 1}`,
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
      description: "The new user has been added successfully",
    });
  };

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    toast({
      title: "User Removed",
      description: "The user has been removed successfully",
    });
  };

  const getRoleBadgeColor = (role: number) => {
    switch (role) {
      case ROLES.COURT:
        return "bg-forensic-court text-white";
      case ROLES.OFFICER:
        return "bg-forensic-800 text-white";
      case ROLES.FORENSIC:
        return "bg-forensic-accent text-white";
      case ROLES.LAWYER:
        return "bg-forensic-warning text-forensic-900";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Render mobile-specific card for each user
  const renderUserCard = (user: User) => (
    <Card key={user.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{user.name}</CardTitle>
            <CardDescription className="text-xs">{user.email}</CardDescription>
          </div>
          <Badge className={getRoleBadgeColor(user.role)}>
            {getRoleString(user.role)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-xs text-muted-foreground mb-2">Case Access:</div>
        <div className="flex flex-wrap gap-1">
          {user.caseAccess.map((caseId) => (
            <Badge
              key={caseId}
              variant="outline"
              className="bg-forensic-50 text-xs"
            >
              {caseId}
            </Badge>
          ))}
          {user.caseAccess.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No cases assigned
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRemoveUser(user.id)}
          className="text-forensic-500 hover:text-red-600 p-1 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-forensic-800 flex items-center">
            <UserCog className="h-5 w-5 md:h-6 md:w-6 mr-2 text-forensic-court" />
            Role Management
          </h1>
          <p className="text-xs md:text-sm text-forensic-500">
            Assign users to specific cases with role designation and manage
            access permissions
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-forensic-court text-white hover:bg-forensic-court/90 flex items-center gap-2 w-full sm:w-auto"
          onClick={handleSaveRoles}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>User Role Assignment</CardTitle>
                <CardDescription>
                  Manage user roles and case access permissions
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                {showAddForm ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {showAddForm ? "Cancel" : "Add User"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <div className="bg-forensic-50 border border-forensic-200 rounded-md p-3 md:p-4 mb-4">
                <h3 className="font-medium mb-3 text-sm md:text-base">
                  Add New User
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
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
                      value={newUser.address}
                      onChange={(e) =>
                        setNewUser({ ...newUser, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          role: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value={ROLES.NONE}>Select Role</option>
                      <option value={ROLES.COURT}>Court</option>
                      <option value={ROLES.OFFICER}>Officer</option>
                      <option value={ROLES.FORENSIC}>Forensic</option>
                      <option value={ROLES.LAWYER}>Lawyer</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddUser}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </div>
            )}

            {isMobile ? (
              <div className="space-y-2">{users.map(renderUserCard)}</div>
            ) : (
              <ScrollArea className="w-full rounded-md border">
                <div className="min-w-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Case Access</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="inline-flex items-center">
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {getRoleString(user.role)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.caseAccess.map((caseId) => (
                                <Badge
                                  key={caseId}
                                  variant="outline"
                                  className="bg-forensic-50"
                                >
                                  {caseId}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-forensic-500 hover:text-red-600 p-0 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {users.length} users configured with role assignments
            </p>
          </CardFooter>
        </Card>

        <CaseAccessControl />
      </div>
    </div>
  );
};

export default RoleManagement;
