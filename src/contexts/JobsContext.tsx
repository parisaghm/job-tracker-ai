
import React, { createContext, useContext, useState, useEffect } from "react";
import { JobApplication } from "@/types";

// Sample data
import { sampleJobs } from "@/data/sampleJobs";

interface JobsContextType {
  jobs: JobApplication[];
  addJob: (job: JobApplication) => void;
  updateJob: (job: JobApplication) => void;
  deleteJob: (id: string) => void;
  isLoading: boolean;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API or database
    // For now, we'll use localStorage with sample data as fallback
    const savedJobs = localStorage.getItem("jobApplications");
    
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      // Use sample data for demonstration
      setJobs(sampleJobs);
    }
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever jobs change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("jobApplications", JSON.stringify(jobs));
    }
  }, [jobs, isLoading]);

  const addJob = (job: JobApplication) => {
    setJobs((prevJobs) => [...prevJobs, job]);
  };

  const updateJob = (updatedJob: JobApplication) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  return (
    <JobsContext.Provider value={{ jobs, addJob, updateJob, deleteJob, isLoading }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
