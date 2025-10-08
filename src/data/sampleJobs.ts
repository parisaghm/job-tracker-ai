
import { JobApplication } from "@/types";
import { subDays } from "date-fns";

// Helper to generate dates in the past
const daysAgo = (days: number) => {
  return subDays(new Date(), days).toISOString().split('T')[0];
};

export const sampleJobs: JobApplication[] = [
  {
    id: "job-1",
    companyName: "TechCorp",
    jobTitle: "Frontend Developer",
    dateApplied: daysAgo(12),
    jobLink: "https://example.com/job1",
    status: "interview",
    notes: "Had first interview on May 1st. Waiting for feedback.",
    lastUpdated: daysAgo(5),
  },
  {
    id: "job-2",
    companyName: "WebSolutions Inc.",
    jobTitle: "React Developer",
    dateApplied: daysAgo(20),
    jobLink: "https://example.com/job2",
    status: "rejected",
    notes: "Received rejection email on May 5th.",
    lastUpdated: daysAgo(3),
  },
  {
    id: "job-3",
    companyName: "DataViz LLC",
    jobTitle: "UI/UX Developer",
    dateApplied: daysAgo(8),
    jobLink: "https://example.com/job3",
    status: "applied",
    notes: "Application submitted through their careers portal.",
    lastUpdated: daysAgo(8),
  },
  {
    id: "job-4",
    companyName: "StartupX",
    jobTitle: "Full Stack Developer",
    dateApplied: daysAgo(2),
    jobLink: "https://example.com/job4",
    status: "applied",
    resumeText: "Sample resume text for this application...",
    lastUpdated: daysAgo(2),
  },
  {
    id: "job-5",
    companyName: "BigTech Co.",
    jobTitle: "Senior Frontend Engineer",
    dateApplied: daysAgo(30),
    jobLink: "https://example.com/job5",
    status: "offer",
    notes: "Received offer: $120k/year. Need to respond by May 15th.",
    lastUpdated: daysAgo(1),
  },
  {
    id: "job-6",
    companyName: "Agency XYZ",
    jobTitle: "JavaScript Developer",
    dateApplied: daysAgo(15),
    jobLink: "https://example.com/job6",
    status: "interview",
    notes: "Technical interview scheduled for next week.",
    lastUpdated: daysAgo(2),
  },
  {
    id: "job-7",
    companyName: "InnovateTech",
    jobTitle: "React Native Developer",
    dateApplied: daysAgo(1),
    jobLink: "https://example.com/job7",
    status: "interested",
    notes: "Interesting position, need to prepare resume for this role.",
    lastUpdated: daysAgo(1),
  },
  {
    id: "job-8",
    companyName: "SoftwarePro",
    jobTitle: "Frontend Architect",
    dateApplied: daysAgo(5),
    jobLink: "https://example.com/job8",
    status: "applied",
    notes: "Applied via LinkedIn Easy Apply.",
    lastUpdated: daysAgo(5),
  },
];
