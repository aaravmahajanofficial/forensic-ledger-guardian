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
import { Separator } from "@/components/ui/separator";
import {
  HardDrive,
  Shield,
  DatabaseBackup,
  Bell,
  Globe,
  Lock,
  UserCog,
} from "lucide-react";

const SystemConfiguration = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forensic-800 mb-2">
          System Configuration
        </h1>
        <p className="text-forensic-600">
          Manage system settings, security, and blockchain configuration
        </p>
      </div>

      <Tabs defaultValue="security">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span>Blockchain</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lock className="h-5 w-5 mr-2 text-forensic-court" />
                Access Controls
              </CardTitle>
              <CardDescription>
                Manage access controls and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-forensic-600">
                      Require 2FA for all admin users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-forensic-600">
                      Automatically logout after inactivity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">IP Restrictions</h4>
                    <p className="text-sm text-forensic-600">
                      Limit access to specific IP ranges
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-forensic-court hover:bg-forensic-court/90">
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UserCog className="h-5 w-5 mr-2 text-forensic-court" />
                User Permissions
              </CardTitle>
              <CardDescription>
                Configure role-based access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Role-Based Restrictions</h4>
                    <p className="text-sm text-forensic-600">
                      Restrict functionality based on user roles
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Evidence Access Logs</h4>
                    <p className="text-sm text-forensic-600">
                      Log all evidence access attempts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-Terminate Sessions</h4>
                    <p className="text-sm text-forensic-600">
                      End sessions when role changes are detected
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-forensic-court hover:bg-forensic-court/90">
                Save Permission Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <HardDrive className="h-5 w-5 mr-2 text-forensic-evidence" />
                Network Configuration
              </CardTitle>
              <CardDescription>
                Configure blockchain network settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Use Testnet</h4>
                    <p className="text-sm text-forensic-600">
                      Connect to test network instead of mainnet
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Gas Price Optimization</h4>
                    <p className="text-sm text-forensic-600">
                      Automatically optimize transaction gas prices
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Smart Contract Versioning</h4>
                    <p className="text-sm text-forensic-600">
                      Enable smart contract version management
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90">
                Save Network Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DatabaseBackup className="h-5 w-5 mr-2 text-forensic-evidence" />
                Data Storage
              </CardTitle>
              <CardDescription>
                Configure evidence data storage options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">IPFS Integration</h4>
                    <p className="text-sm text-forensic-600">
                      Store evidence metadata on IPFS
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Local Backup</h4>
                    <p className="text-sm text-forensic-600">
                      Maintain local backup of all blockchain data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-pinning</h4>
                    <p className="text-sm text-forensic-600">
                      Automatically pin IPFS content to ensure availability
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90">
                Save Storage Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Bell className="h-5 w-5 mr-2 text-forensic-warning" />
                System Notifications
              </CardTitle>
              <CardDescription>
                Configure system-wide notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Case Updates</h4>
                    <p className="text-sm text-forensic-600">
                      Notify when cases are updated
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Evidence</h4>
                    <p className="text-sm text-forensic-600">
                      Notify when new evidence is uploaded
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Court Approvals</h4>
                    <p className="text-sm text-forensic-600">
                      Notify when cases need court approval
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900">
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Globe className="h-5 w-5 mr-2 text-forensic-warning" />
                Email Integration
              </CardTitle>
              <CardDescription>
                Configure email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-forensic-600">
                      Send system notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Daily Digest</h4>
                    <p className="text-sm text-forensic-600">
                      Send daily summary of all activities
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Critical Alerts</h4>
                    <p className="text-sm text-forensic-600">
                      Send immediate alerts for critical events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900">
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
