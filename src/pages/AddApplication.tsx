
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/Header";
import AddJobForm from "@/components/jobs/AddJobForm";
import { useJobs } from "@/contexts/JobsContext";

const AddApplication: React.FC = () => {
  const { addJob } = useJobs();

  return (
    <MainLayout>
      <Header 
        title="Add Job Application" 
        subtitle="Track a new opportunity" 
      />
      
      <AddJobForm onAddJob={addJob} />
    </MainLayout>
  );
};

export default AddApplication;
