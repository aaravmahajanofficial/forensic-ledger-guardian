import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { z } from "zod";
import { supabase } from '@/lib/supabaseClient';

const emailSchema = z.string().email({ message: "Please enter a valid email address" });

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate email
      emailSchema.parse(email);

      setIsLoading(true);

      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (supabaseError) throw new Error(supabaseError.message);

      setIsSubmitted(true);
      toast({
        title: "Recovery email sent",
        description: "Check your inbox for password reset instructions",
      });

    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
        toast({
          title: "Password reset failed",
          description: err.message || "An error occurred while sending the recovery email",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg border-forensic-200 animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-12 w-12 text-forensic-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
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
                    aria-invalid={error ? "true" : "false"}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                          5.291A7.962 7.962 0 014 12H0c0 
                          3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Recovery Email Sent</h3>
                <p className="text-muted-foreground text-sm">
                  We've sent a password reset link to <span className="font-medium text-forensic-800">{email}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
              >
                Try a different email
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center text-forensic-accent hover:text-forensic-accent/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
