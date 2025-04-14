export default function FeedbackCard({ feedback }) {
    return (
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Feedback</h3>
        <p className="whitespace-pre-wrap">{feedback}</p>
      </div>
    );
  }
  