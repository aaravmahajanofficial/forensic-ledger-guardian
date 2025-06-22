import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Wallet, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import ForgotPasswordForm from "./ForgotPasswordForm";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();
  const { connectWallet } = useWeb3();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          "Invalid credentials or an unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    setIsLoading(true);
    try {
      await connectWallet();
      // Web3Context will handle navigation on successful connection
    } catch (error) {
      console.error("MetaMask connection error:", error);
      toast({
        title: "MetaMask Connection Failed",
        description:
          "Could not connect to your MetaMask wallet. Please ensure it's installed and unlocked.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4 sm:mx-0 animate-fade-in-up shadow-2xl border-border/80">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Shield
              className="h-16 w-16 text-primary animate-pulse"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Guardian Login
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Securely access the Forensic Ledger Guardian platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., officer@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing In..."
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </>
              )}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 font-bold"
            onClick={handleMetaMaskLogin}
            disabled={isLoading}
          >
            <Wallet className="mr-2 h-5 w-5 text-primary" />
            Connect with MetaMask
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 p-6 bg-muted/50">
          <Button
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot your password?
          </Button>
          <div className="text-xs text-center text-muted-foreground p-3 bg-background/50 rounded-lg border border-dashed">
            <p className="font-semibold mb-1">Demo Accounts:</p>
            <p>court@example.com / court123</p>
            <p>officer@example.com / officer123</p>
            <p>forensic@example.com / forensic123</p>
            <p>lawyer@example.com / lawyer123</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
