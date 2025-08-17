import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Use environment variable for API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/summarize", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    // Call Gemini 2.0 Flash API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              { text: `Summarize this meeting transcript in bullet points:\n${transcript}` }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GEMINI_API_KEY,
        },
      }
    );

    // Safely extract summary
    const summary =
      response.data?.candidates?.[0]?.content?.[0]?.text ||
      response.data?.outputText ||
      "No summary generated";

    res.json({ summary });

  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    res.status(500).json({ summary: "⚠️ Error generating summary" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
