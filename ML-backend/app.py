from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from joblib import load
import fitz  # PyMuPDF
import requests

app = Flask(__name__)
CORS(app)

# Load your trained ML model (expects 5 features)
model = load('skillmodel.pkl')

# Predefined skill keywords for extraction
SKILL_KEYWORDS = [
    'python', 'java', 'c++', 'sql', 'html', 'css', 'javascript',
    'machine learning', 'data science', 'react', 'node.js', 'flask',
    'django', 'tensorflow', 'keras', 'git', 'linux', 'pandas', 'numpy'
]

# Extract relevant skills from any text
def extract_skills(text):
    text = text.lower()
    return list({skill for skill in SKILL_KEYWORDS if skill in text})

# Fetch top YouTube tutorial for a skill
def get_youtube_video(skill):
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q={skill} tutorial&type=video&key=AIzaSyBml-nLQxt7y4Z7NeYENrRXNlt_gRM7K-c"
    try:
        response = requests.get(url).json()
        video_id = response['items'][0]['id']['videoId']
        return f"https://www.youtube.com/watch?v={video_id}"
    except Exception:
        return "https://www.youtube.com"

# API: Match resume vs JD
@app.route('/match-skills', methods=['POST'])
def match_skills():
    resume = request.files['resume']
    jd = request.files['jd']

    resume_text = fitz.open(stream=resume.read(), filetype="pdf").get_page_text(0)
    jd_text = fitz.open(stream=jd.read(), filetype="pdf").get_page_text(0)

    student_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    missing_skills = list(set(jd_skills) - set(student_skills))
    recommendations = {skill: get_youtube_video(skill) for skill in missing_skills}

    return jsonify({
        "missing_skills": missing_skills,
        "recommendations": recommendations
    })

# API: Predict eligibility using CGPA + ML model
@app.route('/predict-eligibility', methods=['POST'])
def predict_eligibility():
    data = request.json
    cgpa = float(data['cgpa'])

    if cgpa < 6.5:
        return jsonify({"eligible": False, "reason": "CGPA below 6.5"})

    features = [
        float(data['current_sem']),
        float(data['active_backlogs']),
        float(data['history_of_backlogs']),
        float(data['cgpa']),
        int(data.get('internship_completed', 0))
    ]

    prediction = model.predict([features])[0]
    return jsonify({
        "eligible": bool(prediction),
        "reason": "Eligible" if prediction else "Not Eligible based on model"
    })

# 🔄 Updated API: Predict placement & show skill match %
@app.route('/predict-placement', methods=['POST'])
def predict_placement():
    name = request.form.get('name')
    usn = request.form.get('usn')
    sem = float(request.form.get('sem'))
    backlog_active = float(request.form.get('backlogActive'))
    backlog_history = float(request.form.get('backlogHistory'))
    cgpa = float(request.form.get('cgpa'))
    internship = int(request.form.get('internship_completed', 0))

    resume = request.files.get('resume')
    jd = request.files.get('jd')

    resume_text = fitz.open(stream=resume.read(), filetype="pdf").get_page_text(0)
    jd_text = fitz.open(stream=jd.read(), filetype="pdf").get_page_text(0)

    student_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    matched_skills = list(set(jd_skills).intersection(student_skills))
    missing_skills = list(set(jd_skills) - set(student_skills))

    skill_match_pct = round((len(matched_skills) / len(jd_skills)) * 100, 2) if jd_skills else 0.0

    # Placement chance level and color
    if skill_match_pct < 40:
        placement_chance = "Low"
        placement_color = "red"
    elif 40 <= skill_match_pct < 70:
        placement_chance = "Medium"
        placement_color = "orange"
    else:
        placement_chance = "High"
        placement_color = "green"

    recommendations = {skill: get_youtube_video(skill) for skill in missing_skills}

    eligible = cgpa >= 6.5

    return jsonify({
        "eligible": eligible,
        "missing_skills": missing_skills,
        "recommendations": recommendations,
        "skill_match_pct": skill_match_pct,
        "placement_chance": placement_chance,
        "placement_color": placement_color
    })

   

if __name__ == '__main__':
    app.run(debug=True, port=8001)
