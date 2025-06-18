import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import {
  Users,
  Search,
  UserPlus,
  Calendar,
  Clock,
  UserCheck,
  Phone,
  Mail,
  Filter,
  Plus,
  Check,
  X,
  Clock3,
  FileText,
} from "lucide-react";

interface ClientManagementProps {
  view?: "clients" | "meetings";
}

// Mock client data
const clientsData = [
  {
    id: "C001",
    name: "Marcus Turner",
    email: "m.turner@example.com",
    phone: "555-0123",
    cases: ["FF-2023-076"],
    status: "active",
    lastContact: "2025-04-08T14:00:00Z",
  },
  {
    id: "C002",
    name: "Sarah Chen",
    email: "s.chen@example.com",
    phone: "555-0124",
    cases: ["FF-2023-101"],
    status: "active",
    lastContact: "2025-04-07T10:30:00Z",
  },
  {
    id: "C003",
    name: "Raj Patel",
    email: "r.patel@example.com",
    phone: "555-0125",
    cases: ["FF-2023-118"],
    status: "inactive",
    lastContact: "2025-03-29T15:45:00Z",
  },
  {
    id: "C004",
    name: "Elena Rodriguez",
    email: "e.rodriguez@example.com",
    phone: "555-0126",
    cases: [],
    status: "pending",
    lastContact: "2025-04-09T09:15:00Z",
  },
];

// Mock meetings data
const meetingsData = [
  {
    id: "M001",
    title: "Case Strategy Discussion",
    clientId: "C001",
    clientName: "Marcus Turner",
    date: "2025-04-10T14:00:00Z",
    duration: 60,
    status: "scheduled",
    location: "Office Room 3A",
    notes: "Review evidence and prepare defense strategy",
  },
  {
    id: "M002",
    title: "Initial Consultation",
    clientId: "C004",
    clientName: "Elena Rodriguez",
    date: "2025-04-09T15:30:00Z",
    duration: 45,
    status: "completed",
    location: "Virtual Meeting",
    notes: "First meeting to understand case details",
  },
  {
    id: "M003",
    title: "Evidence Review",
    clientId: "C002",
    clientName: "Sarah Chen",
    date: "2025-04-11T10:00:00Z",
    duration: 90,
    status: "scheduled",
    location: "Conference Room B",
    notes: "Review newly submitted evidence",
  },
  {
    id: "M004",
    title: "Court Preparation",
    clientId: "C001",
    clientName: "Marcus Turner",
    date: "2025-04-15T13:30:00Z",
    duration: 120,
    status: "scheduled",
    location: "Office Room 2B",
    notes: "Prepare client for court appearance",
  },
  {
    id: "M005",
    title: "Case Update",
    clientId: "C003",
    clientName: "Raj Patel",
    date: "2025-04-08T11:00:00Z",
    duration: 30,
    status: "completed",
    location: "Phone Call",
    notes: "Brief update on case progress",
  },
];

const getClientStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-forensic-success/20 text-forensic-success">
          <Check className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case "inactive":
      return (
        <Badge className="bg-forensic-400/20 text-forensic-600">
          <X className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-forensic-warning/20 text-forensic-warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return (
        <Badge className="bg-forensic-300 text-forensic-600">Unknown</Badge>
      );
  }
};

const getMeetingStatusBadge = (status: string) => {
  switch (status) {
    case "scheduled":
      return (
        <Badge className="bg-forensic-accent/20 text-forensic-accent">
          <Calendar className="h-3 w-3 mr-1" />
          Scheduled
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-forensic-success/20 text-forensic-success">
          <Check className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-forensic-danger/20 text-forensic-danger">
          <X className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge className="bg-forensic-300 text-forensic-600">Unknown</Badge>
      );
  }
};

const ClientManagement: React.FC<ClientManagementProps> = ({
  view = "clients",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);

  // Filter clients based on search
  const filteredClients = clientsData.filter((client) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.cases.some((caseId) => caseId.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Filter meetings based on search
  const filteredMeetings = meetingsData.filter((meeting) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        meeting.title.toLowerCase().includes(query) ||
        meeting.clientName.toLowerCase().includes(query) ||
        meeting.notes.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Tabs */}
      <Tabs value={view} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-forensic-800 mb-1">
              {view === "clients" ? "Client Management" : "Client Meetings"}
            </h1>
            <p className="text-sm text-forensic-600">
              {view === "clients"
                ? "Manage client information, cases, and representation details"
                : "Schedule and manage client meetings and consultations"}
            </p>
          </div>
          <div>
            {view === "clients" ? (
              <Button
                className="bg-forensic-evidence hover:bg-forensic-evidence/90 flex items-center gap-2"
                onClick={() => setShowNewClientDialog(true)}
              >
                <UserPlus className="h-4 w-4" />
                <span>Add New Client</span>
              </Button>
            ) : (
              <Button
                className="bg-forensic-evidence hover:bg-forensic-evidence/90 flex items-center gap-2"
                onClick={() => setShowNewMeetingDialog(true)}
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Meeting</span>
              </Button>
            )}
          </div>
        </div>
      </Tabs>

      {/* Search & Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-500" />
          <Input
            placeholder={
              view === "clients" ? "Search clients..." : "Search meetings..."
            }
            className="pl-8 border-forensic-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>

      {/* Clients View */}
      {view === "clients" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Your current client list and case assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Case(s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-forensic-500" />
                          {client.email}
                        </span>
                        <span className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1 text-forensic-500" />
                          {client.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.cases.length > 0 ? (
                        client.cases.map((caseId) => (
                          <Badge
                            key={caseId}
                            variant="outline"
                            className="mr-1"
                          >
                            {caseId}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-forensic-500 text-sm">
                          No cases
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getClientStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-sm text-forensic-600">
                      {new Date(client.lastContact).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-forensic-accent hover:bg-forensic-accent/90"
                          onClick={() => setShowNewMeetingDialog(true)}
                        >
                          Schedule
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredClients.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-forensic-300 mx-auto mb-2" />
                <h3 className="font-medium text-lg">No clients found</h3>
                <p className="text-forensic-500">
                  Add new clients or adjust your search criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Meetings View */}
      {view === "meetings" && (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>
                Scheduled client meetings and consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings
                    .filter((meeting) => meeting.status !== "completed")
                    .map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell>
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-sm text-forensic-500 truncate max-w-[200px]">
                            {meeting.notes}
                          </div>
                        </TableCell>
                        <TableCell>{meeting.clientName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-forensic-500" />
                            <span className="text-sm">
                              {new Date(meeting.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1 text-forensic-500" />
                            <span className="text-sm">
                              {new Date(meeting.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              ({meeting.duration} min)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{meeting.location}</TableCell>
                        <TableCell>
                          {getMeetingStatusBadge(meeting.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-forensic-accent hover:bg-forensic-accent/90"
                            >
                              Start
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {filteredMeetings.filter((m) => m.status !== "completed")
                .length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 text-forensic-300 mx-auto mb-2" />
                  <h3 className="font-medium text-lg">No upcoming meetings</h3>
                  <p className="text-forensic-500">
                    Schedule a meeting with your clients
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Past Meetings</CardTitle>
              <CardDescription>
                Completed meetings and their summaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings
                    .filter((meeting) => meeting.status === "completed")
                    .map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell>
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-sm text-forensic-500 truncate max-w-[200px]">
                            {meeting.notes}
                          </div>
                        </TableCell>
                        <TableCell>{meeting.clientName}</TableCell>
                        <TableCell className="text-sm text-forensic-600">
                          {new Date(meeting.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getMeetingStatusBadge(meeting.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              <span>View Notes</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add New Client Dialog */}
      <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client details to add them to your client list.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input placeholder="Enter last name" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" placeholder="email@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="555-0000" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Case ID (if applicable)
              </label>
              <Input placeholder="e.g., FF-2023-000" />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewClientDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-forensic-evidence hover:bg-forensic-evidence/90"
              onClick={() => setShowNewClientDialog(false)}
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule New Meeting Dialog */}
      <Dialog
        open={showNewMeetingDialog}
        onOpenChange={setShowNewMeetingDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Set up a new meeting with a client.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Title</label>
              <Input placeholder="Enter meeting title" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Client</label>
              <Input placeholder="Select or search client" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration (minutes)
                </label>
                <Input placeholder="60" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="Office Room / Virtual" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Notes</label>
              <Input placeholder="Enter meeting agenda or notes" />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewMeetingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-forensic-evidence hover:bg-forensic-evidence/90"
              onClick={() => setShowNewMeetingDialog(false)}
            >
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
