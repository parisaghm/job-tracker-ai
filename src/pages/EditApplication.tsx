import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobs } from "@/contexts/JobsContext";
import { useToast } from "@/hooks/use-toast";
import { JobApplication } from "@/types";
import AddApplicationForm from "@/components/jobs/AddJobForm"; 

const EditApplication: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useJobs();
  const { toast } = useToast();

  const [job, setJob] = useState<JobApplication | null>(null);

  useEffect(() => {
    const found = jobs.find(j => j.id === id);
    if (found) setJob(found);
    else {
      toast({ title: "Not found", description: "Job does not exist", variant: "destructive" });
      navigate("/applications");
    }
  }, [id, jobs, toast, navigate]);

  if (!job) return null;

  const handleSubmit = (updated: JobApplication) => {
    updateJob(updated);
    toast({ title: "Updated!", description: "Job updated." });
    navigate("/applications");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Application</h1>
      <AddApplicationForm
        initialData={job}
        onSubmit={handleSubmit}
        onAddJob={() => {}}
      />
    </div >
  );
};

export default EditApplication;
