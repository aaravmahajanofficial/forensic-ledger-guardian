import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  HardDrive,
  Shield,
  DatabaseBackup,
  Bell,
  Globe,
  Lock,
  UserCog,
  Settings,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SystemConfiguration = () => {
  const { toast } = useToast();

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings Saved",
      description: `${settingType} settings have been successfully updated.`,
      variant: "default",
    });
  };

  const SettingRow = ({
    id,
    title,
    description,
    defaultChecked = false,
  }: {
    id: string;
    title: string;
    description: string;
    defaultChecked?: boolean;
  }) => (
    <div className="flex items-center justify-between space-x-4 py-4">
      <div className="flex flex-col">
        <Label htmlFor={id} className="font-semibold text-primary">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 bg-background text-foreground">
      <header>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Settings className="h-8 w-8 text-secondary" />
          System Configuration
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage global system settings, security policies, and blockchain network
          configurations.
        </p>
      </header>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="security">
            <Shield className="h-5 w-5 mr-2" />
            Security & Access
          </TabsTrigger>
          <TabsTrigger value="blockchain">
            <HardDrive className="h-5 w-5 mr-2" />
            Blockchain & Data
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lock className="h-6 w-6 text-secondary" />
                Authentication Controls
              </CardTitle>
              <CardDescription>
                Strengthen security with robust authentication policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                id="2fa"
                title="Two-Factor Authentication (2FA)"
                description="Require a second verification step for all users upon login."
                defaultChecked
              />
              <SettingRow
                id="session-timeout"
                title="Automatic Session Timeout"
                description="Log users out automatically after a period of inactivity."
                defaultChecked
              />
              <SettingRow
                id="ip-whitelist"
                title="IP Address Whitelisting"
                description="Restrict system access to a pre-approved list of IP addresses."
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full sm:w-auto ml-auto"
                onClick={() => handleSaveSettings("Authentication")}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Auth Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserCog className="h-6 w-6 text-secondary" />
                User Permission Policies
              </CardTitle>
              <CardDescription>
                Define and enforce role-based access control (RBAC) rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                id="rbac"
                title="Enforce Role-Based Restrictions"
                description="Strictly limit functionality based on assigned user roles."
                defaultChecked
              />
              <SettingRow
                id="access-logs"
                title="Detailed Evidence Access Logging"
                description="Record every attempt to access or modify evidence records."
                defaultChecked
              />
              <SettingRow
                id="auto-terminate"
                title="Terminate Session on Role Change"
                description="Immediately end user sessions if their role or permissions change."
                defaultChecked
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full sm:w-auto ml-auto"
                onClick={() => handleSaveSettings("Permission")}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Permission Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="mt-6 space-y-6">
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HardDrive className="h-6 w-6 text-accent" />
                Network Configuration
              </CardTitle>
              <CardDescription>
                Manage connections and interactions with the blockchain network.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                id="testnet"
                title="Use Test Network"
                description="Connect to a test network (e.g., Sepolia) instead of the mainnet."
              />
              <SettingRow
                id="gas-optimization"
                title="Gas Price Optimization"
                description="Automatically adjust gas fees for cost-effective transactions."
                defaultChecked
              />
              <SettingRow
                id="contract-versioning"
                title="Smart Contract Versioning"
                description="Enable and manage multiple versions of system smart contracts."
                defaultChecked
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full sm:w-auto ml-auto"
                onClick={() => handleSaveSettings("Network")}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Network Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <DatabaseBackup className="h-6 w-6 text-accent" />
                Decentralized Data Storage
              </CardTitle>
              <CardDescription>
                Configure options for evidence data storage on IPFS.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                id="ipfs-integration"
                title="Enable IPFS Integration"
                description="Store all evidence files and metadata on the IPFS network."
                defaultChecked
              />
              <SettingRow
                id="local-backup"
                title="Local Data Caching"
                description="Maintain a local cache of blockchain data for faster access."
                defaultChecked
              />
              <SettingRow
                id="auto-pinning"
                title="Automatic IPFS Pinning"
                description="Ensure data availability by automatically pinning content to a pinning service."
                defaultChecked
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full sm:w-auto ml-auto"
                onClick={() => handleSaveSettings("Storage")}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Storage Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bell className="h-6 w-6 text-warning" />
                System Event Notifications
              </CardTitle>
              <CardDescription>
                Configure which system-wide events should trigger notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                id="case-updates"
                title="Case Status Updates"
                description="Notify relevant parties when a case status is updated."
                defaultChecked
              />
              <SettingRow
                id="new-evidence"
                title="New Evidence Uploads"
                description="Send alerts when new evidence is added to a case."
                defaultChecked
              />
              <SettingRow
                id="approval-requests"
                title="Court Approval Requests"
                description="Notify court officials when a case requires their approval."
                defaultChecked
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full sm:w-auto ml-auto"
                onClick={() => handleSaveSettings("Notification")}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-6 w-6 text-warning" />
                Email & External Integrations
              </CardTitle>
              <CardDescription>
                Manage how notifications are delivered to external services like
                email.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                id="email-notifications"
                title="Enable Email Notifications"
                description="Send all enabled system notifications to users via email."
                defaultChecked
              />
              <SettingRow
                id="daily-digest"
                title="Daily Activity Digest"
                description="Send a daily summary of all system and case activities."
              />
              <SettingRow
                id="critical-alerts"
                title="Immediate Critical Alerts"
                description="Send instant email alerts for high-priority security events."
                defaultChecked
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full sm:w-auto ml-auto"
                onClick={() => handleSaveSettings("Email")}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration;
