import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from joblib import dump
import random

# Generate synthetic data
data = []
for _ in range(500):
    cgpa = round(random.uniform(5.0, 10.0), 2)
    active_backlogs = random.randint(0, 5)
    history_backlogs = random.randint(0, 10)
    semester = random.randint(1, 8)
    matched_skills = random.randint(0, 15)

    # Define label logic
    if cgpa >= 6.5 and active_backlogs == 0 and matched_skills >= 5:
        eligible = 1
    else:
        eligible = 0

    data.append([cgpa, active_backlogs, history_backlogs, semester, matched_skills, eligible])

# Convert to DataFrame
df = pd.DataFrame(data, columns=[
    'cgpa', 'active_backlogs', 'history_backlogs', 'semester', 'matched_skills', 'eligible'
])

# Split data
X = df[['cgpa', 'active_backlogs', 'history_backlogs', 'semester', 'matched_skills']]
y = df['eligible']

# Train Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
dump(model, 'skillmodel.pkl')

print("✅ skillmodel.pkl created successfully.")