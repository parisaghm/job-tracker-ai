
export type JobStatus = "interested" | "applied" | "interview" | "rejected" | "offer";

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  jobLink?: string;
  resumeText?: string;
  status: JobStatus;
  notes?: string;
  followUpDate?: string;
  lastUpdated: string;
}

export interface ResumeAnalysis {
  strengths: string[];
  improvements: string[];
  tailoring: string[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

export interface JobFilter {
  status?: JobStatus;
  search?: string;
  dateRange?: [Date | null, Date | null];
  sortBy?: 'dateApplied' | 'companyName' | 'lastUpdated';
  sortDirection?: 'asc' | 'desc';
}
