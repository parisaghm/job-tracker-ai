
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { JobApplication, JobStatus } from "@/types";

interface StatCardsProps {
  jobs: JobApplication[];
}

const StatCards: React.FC<StatCardsProps> = ({ jobs }) => {
  // Calculate overall stats
  const totalApplications = jobs.length;
  
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);
  
  const interviewCount = statusCounts.interview || 0;
  const offerCount = statusCounts.offer || 0;
  
  // Get applications in the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentApplications = jobs.filter(job => 
    new Date(job.dateApplied) >= oneWeekAgo
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
          <p className="text-4xl font-bold mt-2">{totalApplications}</p>
          <p className="text-xs text-gray-500 mt-2">
            {recentApplications} in the last 7 days
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-gray-500 text-sm font-medium">Active Interviews</h3>
          <p className="text-4xl font-bold mt-2 text-purple-600">{interviewCount}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-gray-500 text-sm font-medium">Offers Received</h3>
          <p className="text-4xl font-bold mt-2 text-purple-600">{offerCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
