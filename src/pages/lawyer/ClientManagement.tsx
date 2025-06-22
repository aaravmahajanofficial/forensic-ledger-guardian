import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  UserPlus,
  CalendarPlus,
  Filter,
  MoreVertical,
  Briefcase,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientManagementProps {
  view?: "clients" | "meetings";
}

// Mock client data with avatars
const clientsData = [
  {
    id: "C001",
    name: "Marcus Turner",
    email: "m.turner@example.com",
    phone: "555-0123",
    cases: ["FF-2023-076"],
    status: "active",
    lastContact: "2025-06-18T14:00:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=marcus-turner",
  },
  {
    id: "C002",
    name: "Sarah Chen",
    email: "s.chen@example.com",
    phone: "555-0124",
    cases: ["FF-2023-101"],
    status: "active",
    lastContact: "2025-06-17T10:30:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=sarah-chen",
  },
  {
    id: "C003",
    name: "Raj Patel",
    email: "r.patel@example.com",
    phone: "555-0125",
    cases: ["FF-2023-118"],
    status: "inactive",
    lastContact: "2025-05-29T15:45:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=raj-patel",
  },
  {
    id: "C004",
    name: "Elena Rodriguez",
    email: "e.rodriguez@example.com",
    phone: "555-0126",
    cases: [],
    status: "pending",
    lastContact: "2025-06-20T09:15:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=elena-rodriguez",
  },
];

// Mock meetings data
const meetingsData = [
  {
    id: "M001",
    title: "Case Strategy Discussion",
    clientId: "C001",
    clientName: "Marcus Turner",
    date: "2025-06-25T14:00:00Z",
    duration: 60,
    status: "scheduled",
    location: "Office Room 3A",
    notes: "Review evidence and prepare defense strategy.",
  },
  {
    id: "M002",
    title: "Initial Consultation",
    clientId: "C004",
    clientName: "Elena Rodriguez",
    date: "2025-06-20T15:30:00Z",
    duration: 45,
    status: "completed",
    location: "Virtual Meeting",
    notes: "First meeting to understand case details and establish representation.",
  },
  {
    id: "M003",
    title: "Evidence Review",
    clientId: "C002",
    clientName: "Sarah Chen",
    date: "2025-06-28T10:00:00Z",
    duration: 90,
    status: "scheduled",
    location: "Conference Room B",
    notes: "Deep dive into the newly submitted digital evidence from the forensic team.",
  },
  {
    id: "M004",
    title: "Court Preparation",
    clientId: "C001",
    clientName: "Marcus Turner",
    date: "2025-07-02T13:30:00Z",
    duration: 120,
    status: "scheduled",
    location: "Office Room 2B",
    notes: "Final preparation and mock cross-examination before the court hearing.",
  },
  {
    id: "M005",
    title: "Case Update Call",
    clientId: "C003",
    clientName: "Raj Patel",
    date: "2025-06-15T11:00:00Z",
    duration: 30,
    status: "completed",
    location: "Phone Call",
    notes: "Brief update on case progress and next steps.",
  },
];

const getClientStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
    case "inactive":
      return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
    case "pending":
      return <Badge variant="warning"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getMeetingStatusBadge = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Badge variant="default"><CalendarIcon className="h-3 w-3 mr-1" />Scheduled</Badge>;
    case "completed":
      return <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const ClientManagement: React.FC<ClientManagementProps> = ({
  view: initialView = "clients",
}) => {
  const [activeTab, setActiveTab] = useState<"clients" | "meetings">(initialView);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);
  const [selectedClientForMeeting, setSelectedClientForMeeting] = useState<string | undefined>(undefined);

  const handleTabChange = (value: string) => {
    if (value === "clients" || value === "meetings") {
      setActiveTab(value as "clients" | "meetings");
    }
  };
  
  const openMeetingDialogForClient = (clientId: string) => {
    setSelectedClientForMeeting(clientId);
    setShowNewMeetingDialog(true);
  };

  const filteredClients = useMemo(() => clientsData.filter((client) => {
    if (searchQuery && activeTab === 'clients') {
      const query = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.cases.some((caseId) => caseId.toLowerCase().includes(query))
      );
    }
    return true;
  }), [searchQuery, activeTab]);

  const filteredMeetings = useMemo(() => meetingsData.filter((meeting) => {
    if (searchQuery && activeTab === 'meetings') {
      const query = searchQuery.toLowerCase();
      return (
        meeting.title.toLowerCase().includes(query) ||
        meeting.clientName.toLowerCase().includes(query) ||
        (meeting.notes && meeting.notes.toLowerCase().includes(query))
      );
    }
    return true;
  }), [searchQuery, activeTab]);

  const upcomingMeetings = useMemo(() => filteredMeetings.filter(m => m.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [filteredMeetings]);
  const pastMeetings = useMemo(() => filteredMeetings.filter(m => m.status !== 'scheduled').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [filteredMeetings]);

  const renderEmptyState = (title: string, description: string, icon: React.ReactNode) => (
    <div className="text-center py-16 px-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-primary">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground animate-fade-in">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Client & Meeting Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage client information, cases, and consultations.
            </p>
          </div>
          <TabsList className="grid w-full sm:w-auto sm:grid-cols-2 rounded-lg p-1 bg-muted">
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Meetings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={activeTab === "clients" ? "Search clients by name, email, or case ID..." : "Search meetings by title or client..."}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {activeTab === "clients" ? (
              <Button className="w-full md:w-auto" onClick={() => setShowNewClientDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            ) : (
              <Button className="w-full md:w-auto" onClick={() => setShowNewMeetingDialog(true)}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="clients">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>
                A list of all your current and past clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Associated Cases</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={client.avatarUrl} alt={client.name} />
                            <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                            <p className="text-sm text-muted-foreground">{client.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getClientStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        {client.cases.length > 0 ? (
                          client.cases.map((caseId) => (
                            <Badge key={caseId} variant="outline" className="mr-1 mb-1">
                              <Briefcase className="h-3 w-3 mr-1.5" />
                              {caseId}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No cases</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(client.lastContact).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openMeetingDialogForClient(client.id)}>Schedule Meeting</DropdownMenuItem>
                            <DropdownMenuItem>Edit Client</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        {renderEmptyState("No Clients Found", "Your search returned no results, or you haven't added any clients yet.", <Users className="h-6 w-6 text-muted-foreground" />)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>
                Your scheduled client meetings and consultations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Meeting</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingMeetings.length > 0 ? upcomingMeetings.map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-muted/50">
                      <TableCell>
                        <p className="font-semibold">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{meeting.notes}</p>
                      </TableCell>
                      <TableCell>{meeting.clientName}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({meeting.duration} min)
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {meeting.location.toLowerCase().includes('virtual') ? <Video className="h-4 w-4 mr-2 text-muted-foreground" /> : <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />}
                          {meeting.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Start Meeting</Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                      <TableCell colSpan={5}>
                        {renderEmptyState("No Upcoming Meetings", "You have no meetings scheduled. Why not schedule one?", <CalendarIcon className="h-6 w-6 text-muted-foreground" />)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Past Meetings</CardTitle>
              <CardDescription>
                A log of your completed or cancelled meetings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Meeting</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastMeetings.length > 0 ? pastMeetings.map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-muted/50">
                      <TableCell>
                        <p className="font-semibold">{meeting.title}</p>
                      </TableCell>
                      <TableCell>{meeting.clientName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(meeting.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getMeetingStatusBadge(meeting.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">View Notes</Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        {renderEmptyState("No Past Meetings", "Your meeting history will appear here once completed.", <Clock className="h-6 w-6 text-muted-foreground" />)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add New Client Dialog */}
      <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client&apos;s details below. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Marcus" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Turner" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="m.turner@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="555-0123" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="caseId">Associated Case ID (Optional)</Label>
              <Input id="caseId" placeholder="FF-2023-076" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowNewClientDialog(false)}>Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule New Meeting Dialog */}
      <Dialog open={showNewMeetingDialog} onOpenChange={setShowNewMeetingDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new client meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="meetingTitle">Meeting Title</Label>
              <Input id="meetingTitle" placeholder="e.g., Case Strategy Discussion" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
               <Select value={selectedClientForMeeting} onValueChange={setSelectedClientForMeeting}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clientsData.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" placeholder="60" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="location">Location / Link</Label>
                <Input id="location" placeholder="e.g., Conference Room B" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes / Agenda</Label>
              <Textarea id="notes" placeholder="Enter key topics or an agenda for the meeting." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMeetingDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowNewMeetingDialog(false)}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
