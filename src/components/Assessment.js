import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Assessment.css';

const Assessment = () => {
  const [jobRole, setJobRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(30 * 60); // 30 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Tech stack options (job roles)
  const jobRoles = ['JavaScript', 'Python', 'Java', 'C++'];

  useEffect(() => {
    if (jobRole) {
      fetchQuestions(jobRole); // Fetch questions based on job role
    }
  }, [jobRole]);

  // Timer function: Countdown every second
  useEffect(() => {
    let interval;
    if (timer > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleSubmit(); // Auto submit when time is up
    }
    return () => clearInterval(interval); // Clean up on unmount
  }, [timer, isSubmitted]);

  // Fetch questions based on job role
  const fetchQuestions = async (role) => {
    try {
      const response = await axios.get('https://api.stackexchange.com/2.3/questions', {
        params: {
          site: 'stackoverflow',
          order: 'desc',
          sort: 'activity',
          tagged: role.toLowerCase(),
          pagesize: 20, // Fetch 20 questions
        },
      });
      setQuestions(response.data.items);
    } catch (error) {
      console.error('Error fetching questions: ', error);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  // Handle form submission (e.g., when time is up or user submits manually)
  const handleSubmit = () => {
    let correctAnswers = 0;

    // Loop through questions and compare selected answers with correct answers
    questions.forEach(question => {
      if (answers[question.question_id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    // Calculate score
    setScore(correctAnswers);
    setIsSubmitted(true);
  };

  // Format time (e.g., 30:00)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="assessment-container">
      <h1>Select Tech Stack</h1>
      <select onChange={(e) => setJobRole(e.target.value)} value={jobRole}>
        <option value="">Select a Tech Stack</option>
        {jobRoles.map((role) => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>

      {jobRole && !isSubmitted && (
        <div>
          <h2>Answer the following questions within 30 minutes:</h2>
          <div className="timer">
            Time Left: {formatTime(timer)}
          </div>

          <div className="questions-container">
            {questions.map((question) => (
              <div key={question.question_id} className="question">
                <h3>{question.title}</h3>
                <div className="answers">
                  {question.answers.map((answer, index) => (
                    <div key={index} className="answer-option">
                      <input
                        type="radio"
                        name={question.question_id}
                        value={answer}
                        onChange={() => handleAnswerChange(question.question_id, answer)}
                      />
                      <label>{answer}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={handleSubmit}>Submit Test</button>
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="result">
          <h2>Your Score: {score} / {questions.length}</h2>
        </div>
      )}
    </div>
  );
};

export default Assessment;
