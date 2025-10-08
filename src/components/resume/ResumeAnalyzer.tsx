import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeAnalysis } from "@/types";
import { FileText, Sparkles, Upload } from "lucide-react";

const ResumeAnalyzer: React.FC = () => {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);

    // Demo parsing – replace with real parsing later
    setTimeout(() => {
      setResumeText(
        `Resume content extracted from ${file.name}:\n\n` +
          `John Doe\nSoftware Engineer\n\nExperience:\n- React Developer at TechCorp (2021-2023)\n` +
          `- Frontend Engineer at StartupXYZ (2019-2021)\n\n` +
          `Skills: React, TypeScript, Node.js, Python\n\n` +
          `Education:\nBachelor of Science in Computer Science\nUniversity of Technology (2015-2019)`
      );
    }, 1000);

    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded and processed.`,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Error",
        description: "Please upload a resume file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);

      const resp = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: "", // add actual JD if you collect it
        }),
      });

      if (!resp.ok) {
        let message = `Server error: ${resp.status}`;
        try {
          const maybeErr = (await resp.json()) as unknown;
          const err = maybeErr as { error?: string };
          if (err?.error) message = err.error;
        } catch {
          /* ignore parse errors */
        }
        throw new Error(message);
      }

      // Safely coerce to our expected shape
      const raw = (await resp.json()) as unknown;
      const rawAnalysis = raw as {
        strengths?: unknown;
        improvements?: unknown;
        tailoring?: unknown;
      };

      const sane: ResumeAnalysis = {
        strengths: Array.isArray(rawAnalysis.strengths)
          ? (rawAnalysis.strengths as string[])
          : [],
        improvements: Array.isArray(rawAnalysis.improvements)
          ? (rawAnalysis.improvements as string[])
          : [],
        tailoring: Array.isArray(rawAnalysis.tailoring)
          ? (rawAnalysis.tailoring as string[])
          : [],
      };

      setAnalysis(sane);

      toast({
        title: "Analysis Complete! ✨",
        description: "Your resume has been analyzed with AI.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      console.error(err);
      toast({
        title: "Analysis failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Upload Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-secondary/5">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI Resume Analyzer
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Upload your resume to get AI-powered feedback and insights
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
              ${isDragging ? "border-primary bg-primary/5 scale-105" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"}
              ${uploadedFile ? "border-primary bg-primary/5" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {uploadedFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <p className="font-medium text-primary">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                    setResumeText("");
                  }}
                >
                  Remove file
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragging ? "Drop your resume here" : "Upload your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag & drop or click to select • PDF, DOC, DOCX, TXT (max 5MB)
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t bg-muted/20">
          <div className="flex-1 text-sm text-muted-foreground">
            {resumeText ? (
              <span className="text-primary font-medium">
                ✓ Resume ready for analysis ({resumeText.length} characters)
              </span>
            ) : (
              "Upload a resume file to get started"
            )}
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText}
            size="lg"
            className="min-w-[160px]"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Resume
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Resume Analysis Results</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered insights to improve your resume and match job requirements
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="strengths" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full h-12 bg-muted/50">
                <TabsTrigger
                  value="strengths"
                  className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  💪 Strengths
                </TabsTrigger>
                <TabsTrigger
                  value="improvements"
                  className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  🔧 Improvements
                </TabsTrigger>
                <TabsTrigger
                  value="tailoring"
                  className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  🎯 Tailoring Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="strengths" className="space-y-3">
                <div className="grid gap-3">
                  {analysis?.strengths?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <span className="text-green-600 dark:text-green-400 text-sm font-bold mt-0.5">✓</span>
                      <span className="text-green-800 dark:text-green-200 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="improvements" className="space-y-3">
                <div className="grid gap-3">
                  {analysis?.improvements?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
                    >
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-bold mt-0.5">•</span>
                      <span className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tailoring" className="space-y-3">
                <div className="grid gap-3">
                  {analysis?.tailoring?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold mt-0.5">→</span>
                      <span className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
