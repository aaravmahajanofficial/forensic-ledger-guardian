export const caseData = {
  id: "FF-2023-123",
  title: "State vs. John Doe",
  status: "active",
  dateCreated: "April 15, 2023",
  courtDate: "October 10, 2023",
  filingOfficer: "Officer James Wilson",
  assignedJudge: "Hon. Sarah Mitchell",
  description:
    "Case involving alleged theft of digital assets worth approximately $75,000 from a cryptocurrency exchange.",
  evidenceCount: 12,
  parties: [
    { name: "John Doe", role: "Defendant" },
    { name: "State", role: "Prosecutor" },
  ],
  evidenceItems: [
    {
      id: "EV-2023-001",
      name: "Transaction Log",
      type: "digital",
      status: "verified",
    },
    {
      id: "EV-2023-002",
      name: "Access Records",
      type: "digital",
      status: "verified",
    },
    {
      id: "EV-2023-003",
      name: "Email Correspondence",
      type: "digital",
      status: "pending",
    },
  ],
  timeline: [
    {
      date: "April 12, 2023",
      event: "Case Filed",
      actor: "Officer James Wilson",
    },
    {
      date: "April 15, 2023",
      event: "Evidence Uploaded",
      actor: "Forensic Tech Sarah Johnson",
    },
    {
      date: "April 20, 2023",
      event: "Evidence Verified",
      actor: "Blockchain System",
    },
    { date: "May 5, 2023", event: "Court Date Set", actor: "Court Admin" },
  ],
};
