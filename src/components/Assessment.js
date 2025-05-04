import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Assessment.css';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchQuestions = async (category) => {
    const cached = localStorage.getItem(`quiz-${category}`);
    if (cached) {
      setQuestions(JSON.parse(cached));
      setQuizStarted(true);
      setQuizCompleted(false);
      setScore(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('https://quizapi.io/api/v1/questions', {
        headers: { 'X-Api-Key': process.env.REACT_APP_QUIZAPI_KEY },
        params: { category, limit: 5 },
      });
      setQuestions(res.data);
      localStorage.setItem(`quiz-${category}`, JSON.stringify(res.data));
      setQuizStarted(true);
      setQuizCompleted(false);
      setScore(null);
      setError(null);
    } catch (error) {
      setError('Failed to fetch questions. Please try another quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuestions(quiz);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  useEffect(() => {
    if (timeRemaining > 0 && quizStarted && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeRemaining <= 0 && quizStarted && !quizCompleted) {
      calculateScore();
    }
  }, [timeRemaining, quizStarted, quizCompleted]);

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      const selectedAnswerKey = answers[index];
      const correctAnswerKey = Object.entries(question.correct_answers)
        .find(([key, value]) => value === "true");

      if (correctAnswerKey) {
        const correctKey = correctAnswerKey[0].split("_")[1]; // e.g., "a"
        if (selectedAnswerKey && selectedAnswerKey.endsWith(correctKey)) {
          correct += 1;
        }
      }
    });
    setScore(correct);
    setQuizCompleted(true);
  };

  const handleSubmit = () => {
    calculateScore();
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="assessment-container">
      <h2 className="heading">Select a Technical Quiz</h2>
      <select className="quiz-select" onChange={(e) => handleQuizSelect(e.target.value)} value={selectedQuiz}>
        <option value="">Select Quiz</option>
        <option value="Linux">Linux</option>
        <option value="DevOps">DevOps</option>
        <option value="Docker">Docker</option>
        <option value="SQL">SQL</option>
        <option value="python">Python</option>
      </select>

      {loading && <p className="loading">⏳ Loading questions...</p>}
      {error && <p className="error">{error}</p>}

      {quizStarted && !loading && (
        <div className="quiz-section">
          <div className="quiz-header">
            <h2>Online Assessment: {selectedQuiz}</h2>
            <p className="timer">⏱ Time Remaining: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</p>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="question-card">
              <p className="question"><strong>Q{index + 1}:</strong> {q.question}</p>
              <div className="options-grid">
                {Object.entries(q.answers).map(([key, value]) => (
                  value && (
                    <label className="option-item" key={key}>
                      <input
                        type="radio"
                        name={`q-${index}`}
                        value={key}
                        checked={answers[index] === key}
                        onChange={() => handleAnswerChange(index, key)}
                      />
                      <span>{value}</span>
                    </label>
                  )
                ))}
              </div>
            </div>
          ))}

          {!quizCompleted && (
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          )}

          {quizCompleted && (
            <div className="score-section">
              <h3>Your Score: <span className="score">{score} / {questions.length}</span></h3>
              <button className="dashboard-btn" onClick={goToDashboard}>Go to Dashboard</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Assessment;
