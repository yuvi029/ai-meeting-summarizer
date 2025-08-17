import { useState } from "react";
import { Copy, Download, FileText, Settings, Bot } from "lucide-react";
import Navbar from "./components/Navbar";
import axios from "axios";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("concise");

  // Replace with your Gemini API Key (only for testing!)
  const GEMINI_API_KEY = "AIzaSyD5fjyVkchbdmNi4DZdrX7I_Jtr_4pKqc4";

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setTranscript(event.target.result);
      reader.readAsText(file);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      alert("Please paste or upload a meeting transcript first.");
      return;
    }

    try {
      setLoading(true);

      const promptText = `Summarize this meeting transcript in ${
        summaryStyle === "concise" ? "short bullet points" : summaryStyle
      }:\n\n${transcript}${customPrompt ? "\n\n" + customPrompt : ""}`;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GEMINI_API_KEY
          }
        }
      );

      console.log("Gemini response:", response.data);

      const summaryText =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No summary generated";

      setSummary(summaryText);
    } catch (err) {
      console.error("Gemini API error:", err.response?.data || err.message);
      setSummary("⚠️ Error generating summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    alert("Summary copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Meeting Transcript Section */}
          <div className="bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-blue-500/20 transition">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4 text-blue-400">
              <FileText size={22} /> Meeting Transcript
            </h2>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              className="w-full h-64 p-4 rounded-xl bg-gray-900/60 text-white outline-none resize-none border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
            />
            <div className="mt-5">
              <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition text-sm font-medium inline-block">
                Upload File
                <input
                  type="file"
                  accept=".txt,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Summary Settings Section */}
          <div className="bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-purple-500/20 transition">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-purple-400">
              <Settings size={22} /> Summary Settings
            </h2>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Summarize in bullet points for executives"
              className="w-full p-3 rounded-lg bg-gray-900/60 text-white border border-gray-600 mb-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              {["concise", "detailed", "action-items", "bullet-points"].map((style) => (
                <button
                  key={style}
                  onClick={() => setSummaryStyle(style)}
                  className={`p-2 rounded-lg border font-medium transition ${
                    summaryStyle === style
                      ? "bg-purple-600 border-purple-500 shadow-md shadow-purple-500/30"
                      : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  {style.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" defaultChecked className="accent-purple-500" />
              Auto-detect language
            </label>

            <button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="mt-6 w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition text-sm font-semibold shadow-lg hover:shadow-purple-500/30 disabled:opacity-50"
            >
              {loading ? "⚡ Generating..." : "✨ Generate Summary"}
            </button>
          </div>
        </div>

        {/* Right Column - Summary Output */}
        <div className="bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-green-500/20 transition">
          <h2 className="flex items-center gap-2 text-2xl font-bold mb-4 text-green-400">
            <Bot size={22} /> Your AI-generated Summary
          </h2>
          {summary ? (
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full h-96 p-4 rounded-xl bg-gray-900/60 text-white outline-none resize-none border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition text-sm leading-relaxed"
            />
          ) : (
            <div className="bg-gray-900/60 p-4 rounded-xl h-96 overflow-y-auto border border-gray-600 text-sm leading-relaxed">
              <span className="text-gray-400 text-sm">
                Upload a meeting transcript and click{" "}
                <span className="font-semibold text-purple-400">'Generate Summary'</span> to get started.
              </span>
            </div>
          )}

          {summary && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm font-medium"
              >
                <Copy size={16} /> Copy
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm font-medium"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={() =>
                  (window.location.href = `mailto:?subject=Meeting Summary&body=${encodeURIComponent(summary)}`)
                }
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm font-medium"
              >
                📧 Send as Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
