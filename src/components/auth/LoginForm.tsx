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
import { Shield, Wallet, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import web3Service from "@/services/web3Service";
import ForgotPasswordForm from "./ForgotPasswordForm";
import AuthResetButton from "./AuthResetButton";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, loginWithWallet } = useAuth();
  const { connectWallet, account, userRole, isConnected } = useWeb3();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      console.log("Login success:", success);

      // Don't navigate here - let the AuthContext handle navigation
      // The login function already handles navigation internally
    } catch (error) {
      console.log("error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    setIsLoading(true);

    try {
      // Connect to MetaMask and get account directly
      await connectWallet();

      // Get the account directly from web3Service after connection
      // This avoids race conditions with React state updates
      const connectedAccount = await web3Service.getCurrentAccount();

      if (connectedAccount) {
        // Authenticate with the wallet
        const success = await loginWithWallet(connectedAccount);

        if (!success) {
          toast({
            title: "Authentication failed",
            description: "Could not authenticate with the connected wallet",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Connection incomplete",
          description: "Please ensure MetaMask is installed and unlocked.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("MetaMask login error:", error);
      toast({
        title: "Connection failed",
        description:
          "Could not connect to MetaMask. Please ensure MetaMask is installed and try again.",
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
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg border-forensic-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-12 w-12 text-forensic-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-forensic-200"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-forensic-accent hover:text-forensic-accent/90 p-0 h-auto font-normal"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-forensic-200"
                />
              </div>
              <Button
                type="submit"
                className="bg-forensic-accent hover:bg-forensic-accent/90 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-forensic-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-forensic-500">or</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-forensic-200"
                onClick={handleMetaMaskLogin}
                disabled={isLoading}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect with MetaMask
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-forensic-500">
            Don't have access? Contact your administrator.
          </p>
          {import.meta.env.MODE === "development" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Having login issues?
              </span>
              <AuthResetButton variant="ghost" size="sm" />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
