
import React from "react";
import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types";
import { cn } from "@/lib/utils";

interface JobStatusBadgeProps {
  status: JobStatus;
}

const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case "interested":
        return { color: "bg-jobStatus-interested text-white", label: "Interested" };
      case "applied":
        return { color: "bg-jobStatus-applied text-white", label: "Applied" };
      case "interview":
        return { color: "bg-jobStatus-interview text-white", label: "Interview" };
      case "rejected":
        return { color: "bg-jobStatus-rejected text-white", label: "Rejected" };
      case "offer":
        return { color: "bg-jobStatus-offer text-white", label: "Offer" };
      default:
        return { color: "bg-gray-400 text-white", label: "Unknown" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={cn("font-medium", config.color)}>
      {config.label}
    </Badge>
  );
};

export default JobStatusBadge;
