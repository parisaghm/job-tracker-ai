
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/Header";
import ResumeAnalyzer from "@/components/resume/ResumeAnalyzer";

const ResumeAnalyzerPage: React.FC = () => {
  return (
    <MainLayout>
      <Header 
        title="Resume Analyzer" 
        subtitle="Get AI-powered feedback on your resume" 
      />
      
      <ResumeAnalyzer />
    </MainLayout>
  );
};

export default ResumeAnalyzerPage;
