import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_CONSTANTS } from "@/config";

// Role type and enum-like object for convenience
type Role = (typeof APP_CONSTANTS.ROLES)[keyof typeof APP_CONSTANTS.ROLES];
const Role = APP_CONSTANTS.ROLES;
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, User, Shield, Building, Key } from "lucide-react";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!name || !email || !role || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Mock user creation (would connect to API/blockchain in real implementation)
    setTimeout(() => {
      toast({
        title: "User Created",
        description: `${name} has been added as a ${getRoleTitle(
          parseInt(role)
        )}.`,
      });
      setIsSubmitting(false);
      navigate("/users/manage");
    }, 1500);
  };

  const getRoleTitle = (roleId: number): string => {
    switch (roleId) {
      case Role.Court:
        return "Court Judge";
      case Role.Officer:
        return "Police Officer";
      case Role.Forensic:
        return "Forensic Investigator";
      case Role.Lawyer:
        return "Defense Attorney";
      default:
        return "Unknown Role";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">Add New User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-forensic-court" />
            Create User Account
          </CardTitle>
          <CardDescription>
            Add a new user to the forensic evidence platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-forensic-600" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-forensic-600" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-forensic-600" />
                  Role
                </Label>
                <Select value={role} onValueChange={setRole}>
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

              <div className="space-y-2">
                <Label
                  htmlFor="organization"
                  className="flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-forensic-600" />
                  Organization
                </Label>
                <Input
                  id="organization"
                  placeholder="Enter organization name"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-forensic-600" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4 text-forensic-600" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users/manage")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-forensic-court hover:bg-forensic-court/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;
