import React, { useState } from 'react';
import axios from 'axios';
import './InterviewAssistant.css'; // Importing the new CSS styles

const InterviewAssistant = () => {
    const [answer, setAnswer] = useState('');
    const [sentimentScore, setSentimentScore] = useState(null);
    const [sentimentMagnitude, setSentimentMagnitude] = useState(null);

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const analyzeAnswer = async () => {
        try {
            const response = await axios.post('http://localhost:5000/analyze-answer', { answer });

            setSentimentScore(response.data.sentimentScore);
            setSentimentMagnitude(response.data.sentimentMagnitude);
        } catch (error) {
            console.error('Error analyzing answer:', error);
        }
    };

    return (
        <div className="interview-cardd">
            <h2>Interview Assistant</h2>
            <textarea
                value={answer}
                onChange={handleAnswerChange}
                rows="6"
                cols="40"
                placeholder="Enter interview answer..."
            />
            <br />
            <button onClick={analyzeAnswer}>Analyze Answer</button>

            {sentimentScore !== null && (
                <div>
                    <p>Sentiment Score: {sentimentScore}</p>
                    <p>Sentiment Magnitude: {sentimentMagnitude}</p>
                </div>
            )}
        </div>
    );
};

export default InterviewAssistant;
