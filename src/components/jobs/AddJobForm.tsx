import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { JobApplication, JobStatus } from "@/types";
import { Card, CardContent } from "../ui/card";

interface AddJobFormProps {
  onAddJob: (job: JobApplication) => void;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onAddJob }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    dateApplied: format(new Date(), "yyyy-MM-dd"),
    jobLink: "",
    status: "interested" as JobStatus,
    resumeText: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as JobStatus }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.jobTitle) {
      toast({
        title: "Error",
        description: "Company name and job title are required.",
        variant: "destructive",
      });
      return;
    }

    const newJob: JobApplication = {
      id: `job-${Date.now()}`,
      ...formData,
      lastUpdated: new Date().toISOString(),
    };

    onAddJob(newJob);
    
    toast({
      title: "Success",
      description: "Job application added successfully!",
    });
    
    // Use setTimeout to ensure state updates before navigation
    setTimeout(() => {
      navigate("/applications");
    }, 100);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name*</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g. Acme Inc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title*</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date Applied/Interested</Label>
              <Input
                id="dateApplied"
                name="dateApplied"
                type="date"
                value={formData.dateApplied}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Application Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="jobLink">Job Posting URL</Label>
              <Input
                id="jobLink"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleInputChange}
                placeholder="https://example.com/job-posting"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="resumeText">Resume Text (for AI analysis)</Label>
              <Textarea
                id="resumeText"
                name="resumeText"
                value={formData.resumeText}
                onChange={handleInputChange}
                placeholder="Paste your resume text here for AI analysis..."
                className="min-h-32"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about this application..."
              />
            </div>
          </div>
          
          <div className="flex gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Job Application</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddJobForm;