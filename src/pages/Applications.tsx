
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/Header";
import JobList from "@/components/jobs/JobList";
import FilterBar from "@/components/jobs/FilterBar";
import { useJobs } from "@/contexts/JobsContext";
import { JobFilter } from "@/types";

const Applications: React.FC = () => {
  const { jobs, isLoading } = useJobs();
  const [filter, setFilter] = useState<JobFilter>({
    sortBy: "dateApplied",
    sortDirection: "desc",
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header 
        title="Job Applications" 
        subtitle={`Managing ${jobs.length} applications`} 
      />
      
      <FilterBar 
        filter={filter}
        onFilterChange={setFilter}
      />
      
      <JobList 
        jobs={jobs} 
        filter={filter} 
      />
    </MainLayout>
  );
};

export default Applications;
