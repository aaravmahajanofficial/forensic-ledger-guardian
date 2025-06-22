import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Lock, Info, X, Save, Search, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ROLES } from "@/constants";

// Types
type Role = (typeof ROLES)[keyof typeof ROLES];

interface UserType {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface CaseType {
  id: string;
  title: string;
}

interface AccessMatrixItem {
  userId: string;
  caseId: string;
  hasAccess: boolean;
}

// Mock Data
const mockUsers: UserType[] = [
    { id: "1", name: "Judge Anderson", email: "j.anderson@court.gov", role: ROLES.COURT },
    { id: "2", name: "Officer Miller", email: "m.miller@police.gov", role: ROLES.OFFICER },
    { id: "3", name: "Dr. Evelyn Reed", email: "e.reed@forensics.gov", role: ROLES.FORENSIC },
    { id: "4", name: "Laura Bailey, Esq.", email: "l.bailey@justice.gov", role: ROLES.LAWYER },
];

const mockCases: CaseType[] = [
    { id: "C-2024-011", title: "State v. Harrison" },
    { id: "C-2024-012", title: "Cybercrime Initiative" },
    { id: "C-2024-015", title: "Evidence Tampering Inquiry" },
    { id: "C-2024-017", title: "Financial Fraud Analysis" },
];

const initialAccessMatrix: AccessMatrixItem[] = [
    { userId: "1", caseId: "C-2024-011", hasAccess: true },
    { userId: "2", caseId: "C-2024-011", hasAccess: true },
    { userId: "2", caseId: "C-2024-012", hasAccess: true },
    { userId: "3", caseId: "C-2024-012", hasAccess: true },
    { userId: "4", caseId: "C-2024-011", hasAccess: true },
    { userId: "4", caseId: "C-2024-015", hasAccess: true },
];

const CaseAccessControl = () => {
  const { toast } = useToast();

  const [users] = useState<UserType[]>(mockUsers);
  const [cases] = useState<CaseType[]>(mockCases);
  const [accessMatrix, setAccessMatrix] = useState<AccessMatrixItem[]>(initialAccessMatrix);

  const [selectedCases, setSelectedCases] = useState<CaseType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [grantAccess, setGrantAccess] = useState<boolean>(true);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [openCaseCommand, setOpenCaseCommand] = useState<boolean>(false);
  const [openUserCommand, setOpenUserCommand] = useState<boolean>(false);
  const [caseSearchQuery, setCaseSearchQuery] = useState<string>("");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

  const filteredCases = useMemo(() => 
    cases.filter(
      (caseItem) =>
        caseItem.id.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        caseItem.title.toLowerCase().includes(caseSearchQuery.toLowerCase())
    ), [cases, caseSearchQuery]);

  const filteredUsers = useMemo(() =>
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    ), [users, userSearchQuery]);

  const getRoleBadgeVariant = (role: Role): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch (role) {
      case ROLES.COURT: return "default";
      case ROLES.OFFICER: return "secondary";
      case ROLES.FORENSIC: return "success";
      case ROLES.LAWYER: return "warning";
      default: return "outline";
    }
  };

  const hasAccess = (userId: string, caseId: string): boolean => {
    return !!accessMatrix.find(
      (item) => item.userId === userId && item.caseId === caseId && item.hasAccess
    );
  };

  const toggleAccess = (userId: string, caseId: string) => {
    const existingItem = accessMatrix.find(
      (item) => item.userId === userId && item.caseId === caseId
    );

    if (existingItem) {
      setAccessMatrix(
        accessMatrix.map((item) =>
          item.userId === userId && item.caseId === caseId
            ? { ...item, hasAccess: !item.hasAccess }
            : item
        )
      );
    } else {
      setAccessMatrix([...accessMatrix, { userId, caseId, hasAccess: true }]);
    }
  };

  const handleUpdateAccess = () => {
    if (selectedUsers.length === 0 || selectedCases.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one user and one case.",
        variant: "warning",
      });
      return;
    }

    const updatedMatrix = [...accessMatrix];
    selectedUsers.forEach((user) => {
      selectedCases.forEach((caseItem) => {
        const existingItemIndex = updatedMatrix.findIndex(
          (item) => item.userId === user.id && item.caseId === caseItem.id
        );

        if (existingItemIndex >= 0) {
          updatedMatrix[existingItemIndex].hasAccess = grantAccess;
        } else {
          updatedMatrix.push({ userId: user.id, caseId: caseItem.id, hasAccess: grantAccess });
        }
      });
    });

    setAccessMatrix(updatedMatrix);

    toast({
      title: `Access ${grantAccess ? "Granted" : "Revoked"}`,
      description: `Updated access for ${selectedUsers.length} user(s) to ${selectedCases.length} case(s)${
        expiryDate ? ` until ${format(expiryDate, "PPP")}` : ""
      }.`,
      variant: "success",
    });

    // Clear selections after update
    setSelectedCases([]);
    setSelectedUsers([]);
    setExpiryDate(undefined);
  };

  const removeSelectedItem = <T extends { id: string }>(
    items: T[], 
    setItems: React.Dispatch<React.SetStateAction<T[]>>, 
    itemToRemove: T
  ) => {
    setItems(items.filter((i) => i.id !== itemToRemove.id));
  };

  return (
    <Card className="w-full animate-fade-in shadow-lg border-border/40">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-xl font-bold text-foreground">Case Access Control</CardTitle>
                <CardDescription className="text-muted-foreground">Manage user permissions for specific cases.</CardDescription>
            </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        {/* Case and User Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Case Selection */}
          <div className="space-y-3">
            <Label htmlFor="caseSelect" className="text-base font-semibold text-foreground">Select Cases</Label>
            <Popover open={openCaseCommand} onOpenChange={setOpenCaseCommand}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openCaseCommand} className="w-full justify-between text-base h-11">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCases.length > 0 ? `${selectedCases.length} case(s) selected` : "Search and select cases..."}</span>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", openCaseCommand && "rotate-180")} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search by ID or title..." value={caseSearchQuery} onValueChange={setCaseSearchQuery} />
                  <CommandList>
                    <CommandEmpty>No cases found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[200px]">
                        {filteredCases.map((caseItem) => (
                          <CommandItem key={caseItem.id} onSelect={() => {
                            const isSelected = selectedCases.some((c) => c.id === caseItem.id);
                            if (isSelected) {
                              removeSelectedItem(selectedCases, setSelectedCases, caseItem);
                            } else {
                              setSelectedCases([...selectedCases, caseItem]);
                            }
                          }}>
                            <Checkbox checked={selectedCases.some((c) => c.id === caseItem.id)} className="mr-2" />
                            <div className="flex flex-col">
                              <span className="font-medium">{caseItem.id}</span>
                              <span className="text-xs text-muted-foreground">{caseItem.title}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedCases.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCases.map((caseItem) => (
                  <Badge key={caseItem.id} variant="secondary" className="pl-2 pr-1 py-1 text-sm">
                    {caseItem.id}
                    <button onClick={() => removeSelectedItem(selectedCases, setSelectedCases, caseItem)} className="ml-1.5 rounded-full hover:bg-muted-foreground/20 p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* User Selection */}
          <div className="space-y-3">
            <Label htmlFor="userSelect" className="text-base font-semibold text-foreground">Select Users</Label>
            <Popover open={openUserCommand} onOpenChange={setOpenUserCommand}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openUserCommand} className="w-full justify-between text-base h-11">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUsers.length > 0 ? `${selectedUsers.length} user(s) selected` : "Search and select users..."}</span>
                    </div>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", openUserCommand && "rotate-180")} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search by name or email..." value={userSearchQuery} onValueChange={setUserSearchQuery} />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[200px]">
                        {filteredUsers.map((user) => (
                          <CommandItem key={user.id} onSelect={() => {
                            const isSelected = selectedUsers.some((u) => u.id === user.id);
                            if (isSelected) {
                              removeSelectedItem(selectedUsers, setSelectedUsers, user);
                            } else {
                              setSelectedUsers([...selectedUsers, user]);
                            }
                          }}>
                            <Checkbox checked={selectedUsers.some((u) => u.id === user.id)} className="mr-2" />
                            <div className="flex-grow">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="pl-2 pr-1 py-1 text-sm">
                    {user.name}
                    <button onClick={() => removeSelectedItem(selectedUsers, setSelectedUsers, user)} className="ml-1.5 rounded-full hover:bg-muted-foreground/20 p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grant Access Toggle and Date Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-lg border p-4 bg-background/50">
          <div className="flex items-center space-x-3">
            <Switch id="grant-access" checked={grantAccess} onCheckedChange={setGrantAccess} />
            <Label htmlFor="grant-access" className="text-base font-medium">
              {grantAccess ? "Grant Access" : "Revoke Access"}
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry-date" className="text-sm font-medium flex items-center gap-1 text-muted-foreground">Optional Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal h-11", !expiryDate && "text-muted-foreground")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : <span>No expiry date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus disabled={(date) => date < new Date()} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Access Matrix Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Access Matrix Overview</h3>
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <ScrollArea className="h-[300px]">
              <Table className="bg-card">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[220px] font-semibold">User</TableHead>
                    {cases.map((caseItem) => (
                      <TableHead key={caseItem.id} className="text-center font-semibold">
                        <div className="flex flex-col items-center">
                          <span>{caseItem.id}</span>
                          <span className="text-xs text-muted-foreground font-normal truncate max-w-[120px]">{caseItem.title}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      {cases.map((caseItem) => (
                        <TableCell key={`${user.id}-${caseItem.id}`} className="text-center">
                          <div className="flex justify-center">
                            <Switch checked={hasAccess(user.id, caseItem.id)} onCheckedChange={() => toggleAccess(user.id, caseItem.id)} />
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>{accessMatrix.filter((item) => item.hasAccess).length} active permissions.</p>
        </div>
        <Button onClick={handleUpdateAccess} size="lg" className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Update Access Permissions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseAccessControl;
