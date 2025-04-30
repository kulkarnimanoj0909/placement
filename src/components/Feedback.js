import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [companyName, setCompanyName] = useState(""); // State for company name
  const [feedbackList, setFeedbackList] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback");
      setFeedbackList(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks(); // Fetch feedback on component mount
  }, []);

  const handleInputChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleCompanyChange = (e) => {
    setCompanyName(e.target.value); // Update company name state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("companyName", companyName); // Append company name
    formData.append("text", feedback);

    try {
      await axios.post("http://localhost:5000/api/feedback", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFeedback(""); // Reset feedback input
      setCompanyName(""); // Reset company name input
      fetchFeedbacks(); // Fetch updated feedback list
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="feedback-container">
      <h2>Share Your Experience</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <input
          type="text"
          value={companyName}
          onChange={handleCompanyChange}
          placeholder="Enter company name"
          className="input-field"
        />
        <textarea
          value={feedback}
          onChange={handleInputChange}
          placeholder="Type your feedback here..."
          rows="4"
          className="input-field"
        ></textarea>
        <button type="submit">Submit Feedback</button>
      </form>

      <div className="feedback-list">
        <h3>Recent Feedback:</h3>
        {feedbackList.length === 0 ? (
          <p className="no-feedback-message">No feedback yet!</p>
        ) : (
          feedbackList.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <h4>{feedback.companyName}</h4> {/* Display company name */}
              <p>{feedback.text}</p>
              {feedback.fileURL && (
                <a href={feedback.fileURL} target="_blank" rel="noopener noreferrer">
                  View Uploaded File
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;
