import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './InterviewAssistant.css';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyDrGTILPyQBmno4stooykMRphAN4t6nEPw'; // Replace with your key

const InterviewAssistant = () => {
    const [videos, setVideos] = useState([]);
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'interview_videos'));
                const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVideos(videosData);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchVideos();
    }, []);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, newMessage]);
        setUserMessage('');
        setLoading(true);

        try {
            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY,
                {
                    contents: [{ parts: [{ text: userMessage }] }]
                }
            );

            const botText = response.data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not understand.';
            const botResponse = { sender: 'bot', text: botText };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: '❌ Error contacting Gemini API.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="interview-container">
            {/* Left Side: Videos */}
            <div className="video-section">
                <h2>📹 Interview Prep Videos</h2>

                {/* Category Filter Dropdown */}
                <div className="filter-container">
                    <label>Filter by Category: </label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="All">All</option>
                        <option value="HR">HR</option>
                        <option value="Technical">Technical</option>
                    </select>
                </div>

                {/* Video Grid */}
                <div className="video-grid">
                    {videos.length > 0 ? (
                        videos
                            .filter(video => selectedCategory === 'All' || video.category === selectedCategory)
                            .map((video) => (
                                <div className="video-card" key={video.id}>
                                    <h4>{video.title}</h4>
                                    <div
                                        className="video-iframe"
                                        dangerouslySetInnerHTML={{ __html: video.Video_url }}
                                    />
                                    <p>{video.Description}</p>
                                </div>
                            ))
                    ) : (
                        <p>No videos available.</p>
                    )}
                </div>
            </div>

            {/* Right Side: Chatbot */}
            <div className="chatbot-section">
                <h2>🤖 Chat with Interview Assistant</h2>
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {loading && <div className="chat-message bot">⏳ Thinking...</div>}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Ask me anything about interviews..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default InterviewAssistant;
