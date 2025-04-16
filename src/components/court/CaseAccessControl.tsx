
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Calendar, Lock, Info, X, Plus, Save } from "lucide-react";
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
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Role } from '@/services/web3Service';

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

const CaseAccessControl = () => {
  const { toast } = useToast();
  
  // Mock data
  const users: UserType[] = [
    { id: '1', name: 'John Smith', email: 'john@court.gov', role: Role.Court },
    { id: '2', name: 'Emma Clark', email: 'emma@police.gov', role: Role.Officer },
    { id: '3', name: 'Michael Chen', email: 'michael@lab.gov', role: Role.Forensic },
    { id: '4', name: 'Sarah Johnson', email: 'sarah@legal.gov', role: Role.Lawyer }
  ];
  
  const cases: CaseType[] = [
    { id: 'C-2023-001', title: 'Prosecutor v. Smith' },
    { id: 'C-2023-002', title: 'Robbery Investigation' },
    { id: 'C-2023-005', title: 'Digital Evidence Case' },
    { id: 'C-2023-007', title: 'Financial Fraud Case' }
  ];
  
  // State
  const [selectedCases, setSelectedCases] = useState<CaseType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [grantAccess, setGrantAccess] = useState<boolean>(true);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [openCaseCommand, setOpenCaseCommand] = useState<boolean>(false);
  const [openUserCommand, setOpenUserCommand] = useState<boolean>(false);
  const [accessMatrix, setAccessMatrix] = useState<AccessMatrixItem[]>([
    { userId: '1', caseId: 'C-2023-001', hasAccess: true },
    { userId: '2', caseId: 'C-2023-001', hasAccess: true },
    { userId: '2', caseId: 'C-2023-002', hasAccess: true },
    { userId: '3', caseId: 'C-2023-002', hasAccess: true },
    { userId: '4', caseId: 'C-2023-001', hasAccess: true },
    { userId: '4', caseId: 'C-2023-005', hasAccess: true },
  ]);
  
  // Helper functions
  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.Court: return "bg-forensic-court text-white";
      case Role.Officer: return "bg-forensic-800 text-white";
      case Role.Forensic: return "bg-forensic-accent text-white";
      case Role.Lawyer: return "bg-forensic-warning text-forensic-900";
      default: return "bg-gray-500 text-white";
    }
  };
  
  const getRoleString = (role: Role): string => {
    switch (role) {
      case Role.Court: return "Court";
      case Role.Officer: return "Officer";
      case Role.Forensic: return "Forensic";
      case Role.Lawyer: return "Lawyer";
      default: return "Unknown";
    }
  };
  
  const hasAccess = (userId: string, caseId: string): boolean => {
    return !!accessMatrix.find(item => item.userId === userId && item.caseId === caseId && item.hasAccess);
  };
  
  const toggleAccess = (userId: string, caseId: string) => {
    const existingItem = accessMatrix.find(item => item.userId === userId && item.caseId === caseId);
    
    if (existingItem) {
      setAccessMatrix(accessMatrix.map(item => 
        item.userId === userId && item.caseId === caseId 
          ? { ...item, hasAccess: !item.hasAccess } 
          : item
      ));
    } else {
      setAccessMatrix([...accessMatrix, { userId, caseId, hasAccess: true }]);
    }
  };
  
  const handleUpdateAccess = () => {
    if (selectedUsers.length === 0 || selectedCases.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select both users and cases to update access",
        variant: "destructive"
      });
      return;
    }
    
    // Create new access matrix items based on selections
    const updatedMatrix = [...accessMatrix];
    
    selectedUsers.forEach(user => {
      selectedCases.forEach(caseItem => {
        const existingItemIndex = updatedMatrix.findIndex(
          item => item.userId === user.id && item.caseId === caseItem.id
        );
        
        if (existingItemIndex >= 0) {
          updatedMatrix[existingItemIndex].hasAccess = grantAccess;
        } else {
          updatedMatrix.push({
            userId: user.id,
            caseId: caseItem.id,
            hasAccess: grantAccess
          });
        }
      });
    });
    
    setAccessMatrix(updatedMatrix);
    
    toast({
      title: grantAccess ? "Access Granted" : "Access Revoked",
      description: `Successfully updated access for ${selectedUsers.length} user(s) and ${selectedCases.length} case(s)${expiryDate ? ` until ${format(expiryDate, 'PPP')}` : ''}`,
      variant: "default"
    });
  };
  
  const removeSelectedCase = (caseToRemove: CaseType) => {
    setSelectedCases(selectedCases.filter(c => c.id !== caseToRemove.id));
  };
  
  const removeSelectedUser = (userToRemove: UserType) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userToRemove.id));
  };

  return (
    <Card className="shadow-sm border-forensic-200 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-5 w-5 text-forensic-accent" />
          Case Access Control
        </CardTitle>
        <CardDescription>
          Manage which users have access to specific cases
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Case and User Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Case Selection */}
            <div className="space-y-2">
              <Label htmlFor="caseSelect" className="text-sm font-medium">
                Case ID <span className="text-xs text-muted-foreground">(Multi-select)</span>
              </Label>
              
              <div className="relative">
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between border-forensic-200"
                  onClick={() => setOpenCaseCommand(!openCaseCommand)}
                >
                  {selectedCases.length > 0 
                    ? `${selectedCases.length} case${selectedCases.length > 1 ? 's' : ''} selected` 
                    : "Select Cases"}
                </Button>
                
                <Command className={cn("absolute top-full left-0 w-full z-10 rounded-lg border shadow-md mt-1", 
                  openCaseCommand ? "opacity-100" : "opacity-0 pointer-events-none")}>
                  <CommandInput placeholder="Search cases..." />
                  <CommandList>
                    <CommandEmpty>No cases found.</CommandEmpty>
                    <CommandGroup>
                      {cases.map(caseItem => (
                        <CommandItem
                          key={caseItem.id}
                          onSelect={() => {
                            const isSelected = selectedCases.some(c => c.id === caseItem.id);
                            if (!isSelected) {
                              setSelectedCases([...selectedCases, caseItem]);
                            }
                            setOpenCaseCommand(false);
                          }}
                        >
                          <Checkbox
                            checked={selectedCases.some(c => c.id === caseItem.id)}
                            className="mr-2"
                          />
                          <span>{caseItem.id}</span>
                          <span className="ml-2 text-muted-foreground text-xs">- {caseItem.title}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
              
              {/* Selected Cases Tags */}
              {selectedCases.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCases.map(caseItem => (
                    <Badge 
                      key={caseItem.id} 
                      variant="secondary"
                      className="pl-2 py-1 pr-1 flex items-center gap-1 bg-forensic-50 text-forensic-800 hover:bg-forensic-100"
                    >
                      {caseItem.id}
                      <button
                        onClick={() => removeSelectedCase(caseItem)}
                        className="ml-1 rounded-full hover:bg-forensic-200 h-5 w-5 inline-flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="userSelect" className="text-sm font-medium">
                User <span className="text-xs text-muted-foreground">(Multi-select)</span>
              </Label>
              
              <div className="relative">
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between border-forensic-200"
                  onClick={() => setOpenUserCommand(!openUserCommand)}
                >
                  {selectedUsers.length > 0 
                    ? `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected` 
                    : "Select Users"}
                </Button>
                
                <Command className={cn("absolute top-full left-0 w-full z-10 rounded-lg border shadow-md mt-1", 
                  openUserCommand ? "opacity-100" : "opacity-0 pointer-events-none")}>
                  <CommandInput placeholder="Search users..." />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {users.map(user => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            const isSelected = selectedUsers.some(u => u.id === user.id);
                            if (!isSelected) {
                              setSelectedUsers([...selectedUsers, user]);
                            }
                            setOpenUserCommand(false);
                          }}
                        >
                          <Checkbox
                            checked={selectedUsers.some(u => u.id === user.id)}
                            className="mr-2"
                          />
                          <span>{user.name}</span>
                          <Badge className={cn("ml-2", getRoleBadgeColor(user.role))}>
                            {getRoleString(user.role)}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
              
              {/* Selected Users Tags */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map(user => (
                    <Badge 
                      key={user.id} 
                      variant="secondary"
                      className="pl-2 py-1 pr-1 flex items-center gap-1 bg-forensic-50 text-forensic-800 hover:bg-forensic-100"
                    >
                      {user.name}
                      <button
                        onClick={() => removeSelectedUser(user)}
                        className="ml-1 rounded-full hover:bg-forensic-200 h-5 w-5 inline-flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Grant Access Toggle and Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="grant-access" 
                checked={grantAccess} 
                onCheckedChange={setGrantAccess} 
              />
              <Label htmlFor="grant-access" className="font-medium">
                {grantAccess ? 'Grant' : 'Revoke'} access to selected cases
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry-date" className="text-sm font-medium flex items-center gap-1">
                Optional Expiration Date
              </Label>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-forensic-200",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : <span>Select expiry date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Grant Access Button */}
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleUpdateAccess} 
              className="w-full sm:w-auto bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {grantAccess ? 'Grant Access' : 'Revoke Access'}
            </Button>
            
            <p className="text-xs text-muted-foreground flex items-center">
              <Info className="h-3 w-3 mr-1" />
              {grantAccess 
                ? 'This will grant selected users access to selected cases' 
                : 'This will revoke access for selected users to selected cases'}
              {expiryDate && `, until ${format(expiryDate, 'PPP')}`}
            </p>
          </div>
          
          {/* Access Matrix Table */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Access Matrix</h3>
            <ScrollArea className="h-[250px] rounded-md border">
              <div className="p-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">User</TableHead>
                      {cases.map(caseItem => (
                        <TableHead key={caseItem.id} className="text-center">
                          <div className="flex flex-col">
                            <span>{caseItem.id}</span>
                            <span className="text-xs text-muted-foreground font-normal">{caseItem.title}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </TableCell>
                        {cases.map(caseItem => (
                          <TableCell key={`${user.id}-${caseItem.id}`} className="text-center">
                            <div className="flex justify-center">
                              <Switch
                                checked={hasAccess(user.id, caseItem.id)}
                                onCheckedChange={() => toggleAccess(user.id, caseItem.id)}
                                className="data-[state=checked]:bg-forensic-accent"
                              />
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {accessMatrix.filter(item => item.hasAccess).length} active access permissions
        </p>
      </CardFooter>
    </Card>
  );
};

export default CaseAccessControl;
