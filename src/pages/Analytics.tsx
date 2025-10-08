
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";

// Sample data for the various charts
const weeklyApplicationData = [
  { week: 'Oct 16-22', applications: 2 },
  { week: 'Oct 23-29', applications: 3 },
  { week: 'Oct 30-Nov 5', applications: 4 },
  { week: 'Nov 6-12', applications: 5 },
  { week: 'Nov 13-19', applications: 2 },
];

const statusData = [
  { name: 'Interested', value: 17, color: '#1e88e5' },
  { name: 'Applied', value: 17, color: '#00c9a7' },
  { name: 'Interview', value: 33, color: '#ffbb33' },
  { name: 'Rejected', value: 17, color: '#ff6b6b' },
  { name: 'Offer', value: 17, color: '#9c7df3' },
];

const offerRate = 17; // Percentage
const averageDaysToInterview = 7.5;

const config = {
  interested: { color: '#1e88e5' },
  applied: { color: '#00c9a7' },
  interview: { color: '#ffbb33' },
  rejected: { color: '#ff6b6b' },
  offer: { color: '#9c7df3' },
  applications: { color: '#8884d8' },
};

const Analytics = () => {
  return (
    <MainLayout>
      <Header 
        title="Analytics" 
        subtitle="Visualize your job search progress" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Offer Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Offer Rate</CardTitle>
            <p className="text-sm text-muted-foreground">
              Percentage of applications that resulted in job offers
            </p>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#e9ecef" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#7e57c2" 
                  strokeWidth="10" 
                  strokeDasharray={`${offerRate * 2.51} ${(100 - offerRate) * 2.51}`} 
                  strokeDashoffset="0" 
                  transform="rotate(-90 50 50)" 
                />
                <text 
                  x="50" 
                  y="55" 
                  textAnchor="middle" 
                  fontSize="20" 
                  fontWeight="bold"
                  fill="#000"
                >
                  {offerRate}%
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Average Days to Interview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Average Days to Interview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Time between application and first interview
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <div className="text-6xl font-bold">{averageDaysToInterview}</div>
            <div className="text-xl text-muted-foreground">days</div>
          </CardContent>
        </Card>

        {/* Applications Per Week Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Per Week</CardTitle>
            <p className="text-sm text-muted-foreground">
              Number of job applications submitted each week
            </p>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer
              config={config}
              className="w-full h-full"
            >
              <BarChart
                data={weeklyApplicationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  angle={-45} 
                  textAnchor="end"
                  tickMargin={10}
                />
                <YAxis domain={[0, 8]} />
                <Tooltip />
                <Bar dataKey="applications" fill="#7e57c2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution of your job applications by status
            </p>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={config}
              className="w-full aspect-[4/3]"
            >
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;
