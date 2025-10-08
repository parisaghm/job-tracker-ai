
import React from "react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobApplication } from "@/types";

interface UpcomingRemindersProps {
  jobs: JobApplication[];
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "followup" | "interview" | "deadline";
}

const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({ jobs }) => {
  // Generate reminders based on job applications
  const reminders: Reminder[] = [];
  
  // Current date for comparisons
  const today = new Date();
  
  jobs.forEach(job => {
    const applicationDate = new Date(job.dateApplied);
    
    // Follow-up reminder for applications more than 5 days old without response
    if (job.status === "applied" && isBefore(applicationDate, addDays(today, -5))) {
      reminders.push({
        id: `followup-${job.id}`,
        title: `Follow up with ${job.companyName}`,
        description: `It's been over 5 days since you applied for the ${job.jobTitle} position`,
        date: today,
        type: "followup",
      });
    }
    
    // If there's a follow-up date set
    if (job.followUpDate && isAfter(new Date(job.followUpDate), today)) {
      reminders.push({
        id: `scheduled-${job.id}`,
        title: `Scheduled follow-up for ${job.companyName}`,
        description: `${job.jobTitle} position`,
        date: new Date(job.followUpDate),
        type: "deadline",
      });
    }
  });
  
  // Sort reminders by date
  reminders.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Take only upcoming reminders (limit to 5)
  const upcomingReminders = reminders.filter(r => 
    isAfter(r.date, today) || 
    format(r.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
  ).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingReminders.length > 0 ? (
          <ul className="space-y-4">
            {upcomingReminders.map((reminder) => (
              <li key={reminder.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  reminder.type === "followup" 
                    ? "bg-blue-500" 
                    : reminder.type === "interview" 
                      ? "bg-green-500" 
                      : "bg-purple-500"
                }`} />
                <div>
                  <h4 className="font-medium">{reminder.title}</h4>
                  <p className="text-sm text-gray-500">{reminder.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(reminder.date, "MMM d, yyyy")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No upcoming reminders</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
