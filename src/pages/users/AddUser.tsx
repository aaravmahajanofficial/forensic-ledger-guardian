import { useState } from "react";
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
import { ROLES } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, User, Shield, Building, Key } from "lucide-react";

// Helper function moved outside for better performance and separation of concerns
const getRoleTitle = (roleId: string): string => {
  const roleKey = Object.keys(ROLES).find(
    (key) => ROLES[key as keyof typeof ROLES].toString() === roleId
  );
  switch (roleKey) {
    case "Court":
      return "Court Judge";
    case "Officer":
      return "Police Officer";
    case "Forensic":
      return "Forensic Investigator";
    case "Lawyer":
      return "Defense Attorney";
    default:
      return "Unknown Role";
  }
};

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    organization: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const validateForm = () => {
    const { name, email, role, password, confirmPassword } = formData;
    if (!name || !email || !role || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Mock user creation
    setTimeout(() => {
      toast({
        title: "User Created",
        description: `${formData.name} has been added as a ${getRoleTitle(
          formData.role
        )}.`,
      });
      setIsSubmitting(false);
      navigate("/users/manage");
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card className="border-2 border-forensic-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-forensic-500 p-3 text-white">
              <UserPlus size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-forensic-800">
                Create a New User
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill out the form to add a new user to the system.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="mr-2 inline-block h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="mr-2 inline-block h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">
                  <Shield className="mr-2 inline-block h-4 w-4" />
                  Assign Role
                </Label>
                <Select
                  name="role"
                  onValueChange={handleRoleChange}
                  value={formData.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLES).map(([key, value]) => (
                      <SelectItem key={key} value={value.toString()}>
                        {getRoleTitle(value.toString())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">
                  <Building className="mr-2 inline-block h-4 w-4" />
                  Organization (Optional)
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  placeholder="Enter organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Key className="mr-2 inline-block h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  <Key className="mr-2 inline-block h-4 w-4" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating User..." : "Create User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;
