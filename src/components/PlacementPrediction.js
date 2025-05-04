import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Placementprediction.css';

function PlacementPrediction() {
const [form, setForm] = useState({
name: '',
usn: '',
sem: '',
backlogActive: '',
backlogHistory: '',
cgpa: '',
});
const [resume, setResume] = useState(null);
const [jd, setJd] = useState(null);
const [result, setResult] = useState(null);
const [error, setError] = useState('');
const [watched, setWatched] = useState({});

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleToggleWatched = (skill) => {
setWatched((prev) => ({ ...prev, [skill]: !prev[skill] }));
};

const handleSubmit = async () => {
setError('');
setResult(null);


if (parseFloat(form.cgpa) < 6.5) {
  setError('CGPA must be greater than 6.5 to be eligible.');
  return;
}

if (!resume || !jd) {
  setError('Please upload both resume and job description.');
  return;
}

const formData = new FormData();
Object.keys(form).forEach((key) => {
  formData.append(key, form[key]);
});
formData.append('resume', resume);
formData.append('jd', jd);

try {
  const res = await axios.post('http://localhost:8001/predict-placement', formData);
  setResult(res.data);
  // Initialize watched state
  const initialWatched = {};
  res.data.missing_skills.forEach((skill) => {
    initialWatched[skill] = false;
  });
  setWatched(initialWatched);
} catch (err) {
  setError('An error occurred. Please try again.');
}
};

const calculateProgress = () => {
const total = result?.missing_skills.length || 0;
const completed = Object.values(watched).filter(Boolean).length;
return total === 0 ? 100 : Math.floor((completed / total) * 100);
};

return (
<motion.div
className="placement-container"
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
style={{
padding: '30px',
maxWidth: '700px',
margin: 'auto',
border: '1px solid #ccc',
borderRadius: '12px',
background: '#fefefe',
boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
}}
>
<motion.h2 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
📊 Placement Prediction Form
</motion.h2>


  <div className="form-grid" style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
    <input name="name" placeholder="Name" onChange={handleChange} />
    <input name="usn" placeholder="USN" onChange={handleChange} />
    <input name="sem" placeholder="Current Semester" type="number" onChange={handleChange} />
    <input name="backlogActive" placeholder="No. of Active Backlogs" type="number" onChange={handleChange} />
    <input name="backlogHistory" placeholder="History of Backlogs" type="number" onChange={handleChange} />
    <input name="cgpa" placeholder="CGPA" type="number" step="0.01" onChange={handleChange} />
    <label>Upload Resume (PDF):</label>
    <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
    <label>Upload Job Description (PDF):</label>
    <input type="file" accept=".pdf" onChange={(e) => setJd(e.target.files[0])} />
  </div>

  <motion.button
    onClick={handleSubmit}
    style={{
      marginTop: '20px',
      padding: '10px 20px',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
    whileHover={{ scale: 1.05 }}
  >
    Predict Placement Eligibility
  </motion.button>

  {error && (
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'red', marginTop: '15px' }}>
      ❌ {error}
    </motion.p>
  )}

  {result && (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        marginTop: '30px',
        background: '#f1f8e9',
        padding: '20px',
        borderRadius: '10px',
        color: 'black',
      }}
    >
      <h3>Eligibility: {result.eligible ? '✅ Eligible' : '❌ Not Eligible'}</h3>
      <h4 style={{ marginBottom: '10px' }}>📚 Missing Skills & Progress Tracker</h4>
      {result.missing_skills.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {result.missing_skills.map((skill) => (
            <div
              key={skill}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '12px 16px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <span style={{ fontWeight: '600' }}>{skill.toUpperCase()}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={result.recommendations[skill]}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    background: '#2196f3',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  📺 Watch
                </a>
                <input
                  type="checkbox"
                  checked={watched[skill] || false}
                  onChange={() => handleToggleWatched(skill)}
                  title="Mark as watched"
                />
              </div>
            </div>
          ))}
          <div style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Progress:</label>
            <div style={{ height: '10px', background: '#ddd', borderRadius: '6px', marginTop: '6px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${calculateProgress()}%`,
                  background: '#4caf50',
                  borderRadius: '6px',
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>{calculateProgress()}% completed</p>
          </div>
        </div>
      ) : (
        <p>🎉 No missing skills! You're all set!</p>
      )}

      <h4 style={{ color: result.placement_color }}>
        Placement Chance: {result.placement_chance} ({result.skill_match_pct}% skill match)
      </h4>
    </motion.div>
  )}
</motion.div>
);
}
export default PlacementPrediction;