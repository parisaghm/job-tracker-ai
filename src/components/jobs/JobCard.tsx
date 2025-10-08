import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import JobStatusBadge from "./JobStatusBadge";
import { JobApplication, JobStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Pencil, ExternalLink } from "lucide-react";

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: job.companyName,
    jobTitle: job.jobTitle,
    dateApplied: format(new Date(job.dateApplied), "yyyy-MM-dd"),
    jobLink: job.jobLink || "",
    status: job.status as JobStatus,
    resumeText: job.resumeText || "",
    notes: job.notes || "",
  });
  const { toast } = useToast();

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{job.jobTitle}</h3>
              <p className="text-muted-foreground">{job.companyName}</p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm space-y-2">
            <p className="text-muted-foreground">
              <span className="font-medium">Applied:</span>{" "}
              {format(new Date(job.dateApplied), "MMM d, yyyy")}
            </p>
            {job.jobLink && (
              <p className="text-muted-foreground truncate">
                <span className="font-medium">Link:</span>{" "}
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {job.jobLink.length > 40
                    ? `${job.jobLink.substring(0, 40)}...`
                    : job.jobLink}
                </a>
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setShowEditDialog(true)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowViewDialog(true)}>
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive" 
            onClick={() => onDelete(job.id)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Update the job application details.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedJob: JobApplication = {
                ...job,
                companyName: editForm.companyName.trim(),
                jobTitle: editForm.jobTitle.trim(),
                dateApplied: new Date(editForm.dateApplied).toISOString(),
                jobLink: editForm.jobLink || "",
                status: editForm.status,
                resumeText: editForm.resumeText,
                notes: editForm.notes,
                lastUpdated: new Date().toISOString(),
              };
              onEdit(updatedJob);
              toast({
                title: "Job updated",
                description: "Your changes have been saved.",
              });
              setShowEditDialog(false);
            }}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={editForm.jobTitle}
                  onChange={(e) => setEditForm((p) => ({ ...p, jobTitle: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateApplied">Date Applied</Label>
                <Input
                  id="dateApplied"
                  type="date"
                  value={editForm.dateApplied}
                  onChange={(e) => setEditForm((p) => ({ ...p, dateApplied: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm((p) => ({ ...p, status: v as JobStatus }))}
                >
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
                <Label htmlFor="jobLink">Job Link</Label>
                <Input
                  id="jobLink"
                  value={editForm.jobLink}
                  onChange={(e) => setEditForm((p) => ({ ...p, jobLink: e.target.value }))}
                  placeholder="https://example.com/job-posting"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="resumeText">Resume Text</Label>
                <Textarea
                  id="resumeText"
                  value={editForm.resumeText}
                  onChange={(e) => setEditForm((p) => ({ ...p, resumeText: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{job.jobTitle}</DialogTitle>
            <DialogDescription className="text-lg">{job.companyName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold mb-1">Status</h4>
              <JobStatusBadge status={job.status} />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Date Applied</h4>
              <p className="text-muted-foreground">{format(new Date(job.dateApplied), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Last Updated</h4>
              <p className="text-muted-foreground">{format(new Date(job.lastUpdated), "MMMM d, yyyy")}</p>
            </div>
            {job.jobLink && (
              <div>
                <h4 className="font-semibold mb-1">Job Link</h4>
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {job.jobLink}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
            {job.followUpDate && (
              <div>
                <h4 className="font-semibold mb-1">Follow-up Date</h4>
                <p className="text-muted-foreground">{format(new Date(job.followUpDate), "MMMM d, yyyy")}</p>
              </div>
            )}
            {job.notes && (
              <div>
                <h4 className="font-semibold mb-1">Notes</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.notes}</p>
              </div>
            )}
            {job.resumeText && (
              <div>
                <h4 className="font-semibold mb-1">Resume</h4>
                <div className="bg-muted p-4 rounded-md max-h-48 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{job.resumeText}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobCard;
