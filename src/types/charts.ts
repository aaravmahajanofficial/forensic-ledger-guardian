// Common chart data interfaces
export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface MonthlyDataPoint {
  month: string;
  [key: string]: string | number;
}

export interface UserActivityData {
  name: string;
  value: number;
}

// Evidence related types
export interface EvidenceData {
  name: string;
  value: number;
}

export interface VerificationStatus {
  name: "Verified" | "Pending" | "Failed";
  value: number;
}

// Case related types
export interface CasesByType {
  name:
    | "Cybercrime"
    | "Financial Fraud"
    | "Intellectual Property"
    | "Identity Theft"
    | "Other";
  value: number;
}

export interface CaseStatus {
  name: "Active" | "Closed" | "Pending Review" | "Archived";
  value: number;
}
