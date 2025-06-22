import React, { useState } from "react";
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
import { Shield, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email({
  message: "Please enter a valid email address.",
});

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      emailSchema.parse(email);
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      toast({
        title: "Recovery Email Sent",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast({
          title: "Password Reset Failed",
          description: "An error occurred while sending the recovery email.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Reset Password
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            {isSubmitted
              ? "A recovery link is on its way!"
              : "Enter your email to receive a password reset link."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {isSubmitted ? (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-foreground font-semibold">
                Please check your inbox for an email from us.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                It contains instructions to reset your password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., officer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                  aria-invalid={!!error}
                />
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Sending Link..."
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Send Recovery Link
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center p-6 bg-muted/50">
          <Button
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
