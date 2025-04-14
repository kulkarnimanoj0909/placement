import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">Placement Portal</h2>
        <div className="nav-links">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/placement-prediction")}>Placement Prediction</button>
          <button onClick={() => navigate("/Assessment")}>Assessment</button>
          <button onClick={() => navigate("/courses")}>Courses</button>
          <button onClick={() => navigate("/upcoming-placements")}>Upcoming Placements</button>
          <button onClick={() => navigate("/interview")}>Inter</button>
        </div>
      </nav>

      {/* Dashboard Feature Cards */}
      <h1>Welcome to Placement Portal</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/placement-prediction")}>
          <h3>Placement Prediction</h3>
          <p>Check your eligibility based on your skills and resume.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/Assessment")}>
          <h3>Assessment</h3>
          <p>Take assessments to evaluate your skills.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/courses")}>
          <h3>Courses</h3>
          <p>Find courses to improve your skills.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/upcoming-placements")}>
          <h3>Upcoming Placements</h3>
          <p>Check upcoming placement opportunities.</p>
        </div>
       
        <div className="interview-card" onClick={() => navigate("/interview")}>
          <h3>Interview Assistant</h3>
          <p>CDheck Your Communication and Interview Cracking Skill</p>
        </div>
        

      </div>
    </div>
  );
};

export default Dashboard;
