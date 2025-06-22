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
import { ROLES, ROLE_NAMES } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, User, Shield, Building, Key, ArrowLeft } from "lucide-react";

const getRoleTitle = (roleId: string): string => {
    const roleValue = parseInt(roleId, 10) as keyof typeof ROLE_NAMES;
    return ROLE_NAMES[roleValue] || "Unknown Role";
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
    if (password.length < 8) {
        toast({
            title: "Invalid Password",
            description: "Password must be at least 8 characters long.",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Mock user creation with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: "User Invitation Sent",
      description: `${formData.name} has been invited as a ${getRoleTitle(
        formData.role
      )}. They will receive an email to set up their account.`,
      variant: "success",
    });
    
    navigate("/users/manage");
  };

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to User Management
            </Button>
        </div>
        <Card className="bg-card/80 backdrop-blur-sm border-border/20">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
                        <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-foreground">Invite New User</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Fill out the form below to invite a new user to the platform.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                <User className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Jane Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                <Mail className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="e.g., jane.doe@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-background/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="role">
                                <Shield className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                                Assign Role
                            </Label>
                            <Select onValueChange={handleRoleChange} value={formData.role} name="role">
                                <SelectTrigger id="role" className="bg-background/50">
                                    <SelectValue placeholder="Select a role..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ROLES)
                                        .filter(([key]) => key !== 'NONE')
                                        .map(([, value]) => (
                                        <SelectItem key={value} value={String(value)}>
                                            {ROLE_NAMES[value]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="organization">
                                <Building className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                                Organization / Department
                            </Label>
                            <Input
                                id="organization"
                                name="organization"
                                placeholder="e.g., Central Police Dept."
                                value={formData.organization}
                                onChange={handleChange}
                                className="bg-background/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                <Key className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                                Create Temporary Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                <Key className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                                Confirm Temporary Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="bg-background/50"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">
                        The user will be required to change this temporary password upon their first login.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-border/20 pt-6">
                    <Button type="submit" disabled={isSubmitting} size="lg">
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin mr-2">◌</span>
                                Sending Invitation...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Invite User
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
};

export default AddUser;
