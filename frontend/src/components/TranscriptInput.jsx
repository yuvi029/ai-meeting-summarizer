import { useState } from "react";

export default function TranscriptInput({ onSubmit }) {
  const [text, setText] = useState("");

  return (
    <div className="bg-gray-800 p-6 rounded-lg flex-1">
      <h2 className="text-lg font-semibold mb-4">Meeting Transcript</h2>
      <textarea
        className="w-full h-48 p-3 bg-gray-700 text-white rounded-lg resize-none"
        placeholder="Paste your meeting transcript here or upload a file..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4 flex gap-3">
        <input
          type="file"
          accept=".txt,.docx,.pdf"
          className="text-gray-300"
        />
        <button
          onClick={() => onSubmit(text)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
        >
          Generate Summary
        </button>
      </div>
    </div>
  );
}
