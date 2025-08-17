export default function SummaryOutput({ summary }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg flex-1 flex items-center justify-center text-gray-400">
      {summary ? (
        <p className="text-white">{summary}</p>
      ) : (
        <div className="text-center">
          <div className="mb-2">📄</div>
          <p>Your AI-generated summary will appear here</p>
        </div>
      )}
    </div>
  );
}
