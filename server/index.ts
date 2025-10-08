// server/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- OpenAI client ---
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Quick health check
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    openaiConfigured: Boolean(apiKey),
  });
});

type Analysis = {
  strengths: string[];
  improvements: string[];
  tailoring: string[];
};

app.post("/api/analyze-resume", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: "OpenAI API key not configured" });
    }

    const { resumeText, jobDescription = "" } = (req.body ?? {}) as {
      resumeText?: string;
      jobDescription?: string;
    };

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: "resumeText is required" });
    }

    const prompt = `
You are a resume coach. Given the resume text and optional job description,
return STRICT JSON with keys: strengths, improvements, tailoring (arrays of strings).
No prose. Example:
{
  "strengths": ["..."],
  "improvements": ["..."],
  "tailoring": ["..."]
}

Resume:
${resumeText}

Job description (optional):
${jobDescription}
`.trim();

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const text = resp.choices[0]?.message?.content || "";

    // Try to locate JSON in the response
    let analysis: Analysis = { strengths: [], improvements: [], tailoring: [] };
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const json = text.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(json);
      analysis = {
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements
          : [],
        tailoring: Array.isArray(parsed.tailoring) ? parsed.tailoring : [],
      };
    } else {
      // Fallback if the model didn’t produce parsable JSON
      analysis = {
        strengths: [],
        improvements: [],
        tailoring: [],
      };
    }

    return res.json(analysis);
  } catch (err: unknown) {
    console.error("analyze-resume failed:", err instanceof Error ? err.message : err);
    return res
      .status(500)
      .json({ error: (err as Error)?.message || "Internal Server Error" });
  }
});

const PORT = Number(process.env.PORT || 8787);
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`Health:      GET http://localhost:${PORT}/health`);
});
