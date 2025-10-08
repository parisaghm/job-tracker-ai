import React from "react";
import JobCard from "./JobCard";
import { JobApplication, JobFilter } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useJobs } from "@/contexts/JobsContext";

interface JobListProps {
  jobs: JobApplication[];
  filter: JobFilter;
}

const JobList: React.FC<JobListProps> = ({ jobs, filter }) => {
  const { toast } = useToast();
  const { deleteJob, updateJob } = useJobs();

  const handleEdit = (updatedJob: JobApplication) => {
    updateJob(updatedJob);
    toast({
      title: "Job Updated",
      description: "The job application has been updated.",
    });
  };

  const handleDelete = (id: string) => {
    deleteJob(id);
    toast({
      title: "Job Deleted",
      description: "The job application has been removed.",
    });
  };

  const filteredJobs = jobs.filter((job) => {
    // Apply status filter if set
    if (filter.status && job.status !== filter.status) {
      return false;
    }

    // Apply search filter if set
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchCompany = job.companyName.toLowerCase().includes(searchLower);
      const matchTitle = job.jobTitle.toLowerCase().includes(searchLower);
      if (!matchCompany && !matchTitle) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const sortField = filter.sortBy || 'dateApplied';
    const sortDirection = filter.sortDirection || 'desc';
    
    if (sortField === 'dateApplied') {
      const dateA = new Date(a.dateApplied).getTime();
      const dateB = new Date(b.dateApplied).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === 'companyName') {
      return sortDirection === 'asc' 
        ? a.companyName.localeCompare(b.companyName)
        : b.companyName.localeCompare(a.companyName);
    }
    
    if (sortField === 'lastUpdated') {
      const dateA = new Date(a.lastUpdated).getTime();
      const dateB = new Date(b.lastUpdated).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });

  if (sortedJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-500">No job applications found</h3>
        <p className="text-gray-400 mt-2">
          {filter.status || filter.search 
            ? "Try adjusting your filters" 
            : "Start by adding your first job application"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default JobList;
