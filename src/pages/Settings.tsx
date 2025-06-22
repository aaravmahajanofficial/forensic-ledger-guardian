import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Bell,
  Shield,
  Key,
  Save,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    title: user?.roleTitle || "",
    email: "user@example.com",
    bio: "Experienced forensic analyst with a background in digital evidence processing and blockchain technology.",
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    caseUpdates: true,
    newEvidence: true,
    roleAssignments: true,
    systemAnnouncements: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    recoveryEmail: "",
  });

  const [walletSettings, setWalletSettings] = useState({
    autoSign: false,
    txNotifications: true,
  });

  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isNotifSaving, setIsNotifSaving] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNotificationToggle = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityChange = (
    key: keyof typeof securitySettings,
    value: boolean | string
  ) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleWalletChange = (
    key: keyof typeof walletSettings,
    value: string | boolean
  ) => {
    setWalletSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfileChanges = () => {
    setIsProfileSaving(true);
    setTimeout(() => {
      setIsProfileSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    }, 1000);
  };

  const saveNotificationPrefs = () => {
    setIsNotifSaving(true);
    setTimeout(() => {
      setIsNotifSaving(false);
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    }, 1000);
  };

  const saveSecuritySettings = () => {
    setIsSecuritySaving(true);
    setTimeout(() => {
      setIsSecuritySaving(false);
      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been saved successfully.",
      });
    }, 1000);
  };

  const getNotificationDescription = (key: keyof typeof notificationPrefs) => {
    switch (key) {
      case "caseUpdates":
        return "Get notified about status changes in your assigned cases.";
      case "newEvidence":
        return "Receive alerts when new evidence is submitted to your cases.";
      case "roleAssignments":
        return "Be informed about new role assignments or permission changes.";
      case "systemAnnouncements":
        return "Receive important announcements and updates from administrators.";
      default:
        return "";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in bg-background text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Settings
        </h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-6 bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <Key className="h-5 w-5" />
            <span>Wallet & Blockchain</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>
                Update your personal and professional information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={handleProfileChange}
                    placeholder="e.g., Forensic Analyst"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="your.email@agency.gov"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  placeholder="A brief summary of your professional background..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/50">
              <Button
                onClick={saveProfileChanges}
                disabled={isProfileSaving}
                className="ml-auto"
              >
                {isProfileSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications from the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 divide-y">
              {Object.entries(notificationPrefs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between pt-4 first:pt-0"
                >
                  <div>
                    <Label
                      htmlFor={key}
                      className="font-medium text-foreground"
                    >
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {getNotificationDescription(
                        key as keyof typeof notificationPrefs
                      )}
                    </p>
                  </div>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={() =>
                      handleNotificationToggle(
                        key as keyof typeof notificationPrefs
                      )
                    }
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/50">
              <Button
                onClick={saveNotificationPrefs}
                disabled={isNotifSaving}
                className="ml-auto"
              >
                {isNotifSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Security Settings</CardTitle>
              <CardDescription>
                Enhance your account&apos;s security.rity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div>
                  <Label htmlFor="twoFactorAuth" className="font-medium">
                    Two-Factor Authentication (2FA)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require a second verification step to log in.
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    handleSecurityChange("twoFactorAuth", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div>
                  <Label htmlFor="loginNotifications" className="font-medium">
                    Login Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get an email notification for every new login to your
                    account.
                  </p>
                </div>
                <Switch
                  id="loginNotifications"
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={(checked) =>
                    handleSecurityChange("loginNotifications", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recoveryEmail">Recovery Email</Label>
                <Input
                  id="recoveryEmail"
                  type="email"
                  value={securitySettings.recoveryEmail}
                  onChange={(e) =>
                    handleSecurityChange("recoveryEmail", e.target.value)
                  }
                  placeholder="recovery.email@example.com"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/50">
              <Button
                onClick={saveSecuritySettings}
                disabled={isSecuritySaving}
                className="ml-auto"
              >
                {isSecuritySaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-destructive/50 bg-destructive/10">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <div>
                <CardTitle className="text-lg text-destructive">
                  Account Deactivation
                </CardTitle>
                <CardDescription className="text-destructive/80">
                  Permanently deactivate your account and delete all associated
                  data.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive/90 mb-4">
                This action is irreversible. Please be certain before
                proceeding. All your cases, evidence records, and activity logs
                will be permanently erased.
              </p>
              <Button variant="destructive">Deactivate Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Wallet & Blockchain</CardTitle>
              <CardDescription>
                Manage your connected wallet and transaction settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center p-4 rounded-lg border bg-background">
                <div className="flex-grow">
                  <Label className="font-medium">
                    Connected Wallet Address
                  </Label>
                  <p className="text-sm text-muted-foreground font-mono break-all">
                    {user?.address || "0x0000...0000"}
                  </p>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div>
                  <Label htmlFor="autoSign" className="font-medium">
                    Auto-Sign Transactions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the application to sign transactions without a prompt.
                  </p>
                </div>
                <Switch
                  id="autoSign"
                  checked={walletSettings.autoSign}
                  onCheckedChange={(checked) =>
                    handleWalletChange("autoSign", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div>
                  <Label htmlFor="txNotifications" className="font-medium">
                    Transaction Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for completed or failed transactions.
                  </p>
                </div>
                <Switch
                  id="txNotifications"
                  checked={walletSettings.txNotifications}
                  onCheckedChange={(checked) =>
                    handleWalletChange("txNotifications", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
