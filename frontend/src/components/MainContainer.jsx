import TranscriptInput from "./TranscriptInput";
import SummaryOutput from "./SummaryOutput";
import { useState } from "react";

export default function MainContainer() {
  const [summary, setSummary] = useState("");

  const handleSubmit = async (text) => {
    // TODO: connect to backend API
    setSummary("This is a sample summary from AI.");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-900 min-h-screen">
      <TranscriptInput onSubmit={handleSubmit} />
      <SummaryOutput summary={summary} />
    </div>
  );
}
