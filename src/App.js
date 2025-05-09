import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Admin from "./components/Admin"; // Ensure correct import
import Dashboard from "./components/Dashboard"; // Ensure correct import
import UpcomingPlacements from "./components/UpcomingPlacements"; // adjust path
import Assessment from  "./components/Assessment"; // adjust path
import InterviewAssistant from './components/InterviewAssistant';
import Feedback from "./components/Feedback"; 
import PlacementPrediction from "./components/PlacementPrediction";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
         <Route path="/upcoming-placements" element={<UpcomingPlacements />} />
        <Route path="/Assessment" element={<Assessment />} /> 
        <Route path="/interview" element={<InterviewAssistant />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/placementprediction" element={<PlacementPrediction />} />

      </Routes>
    </Router>
  );
}

export default App;


