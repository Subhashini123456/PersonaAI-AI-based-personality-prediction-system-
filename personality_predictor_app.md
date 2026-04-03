# app.py

from flask import Flask, request, render_template_string

app = Flask(__name__)

# ---------------------------
# Questions and Options
# ---------------------------
questions = [
    {
        "q": "How do you prefer spending your free time?",
        "options": {"Being alone": "Introvert", "With friends or family": "Extrovert"}
    },
    {
        "q": "When making decisions, you usually rely on:",
        "options": {"Careful thinking and facts": "Thinker", "Your intuition or feelings": "Creative"}
    },
    {
        "q": "Which best describes your work style?",
        "options": {"I like structure and plans": "Thinker", "I prefer flexibility and creativity": "Creative"}
    },
    {
        "q": "Your social energy level is:",
        "options": {"Low, I get tired quickly": "Introvert", "High, I enjoy being around people": "Extrovert"}
    },
    {
        "q": "What do you enjoy more?",
        "options": {"Reading, learning, or quiet activities": "Introvert", "Parties, social events, or group activities": "Extrovert"}
    },
    {
        "q": "How do you approach solving problems?",
        "options": {"Analyze facts carefully": "Thinker", "Look for new creative solutions": "Creative"}
    },
    {
        "q": "Your favorite hobby is:",
        "options": {"Painting, writing, music, or other creative arts": "Creative", "Puzzles, strategy games, or logical challenges": "Thinker"}
    },
    {
        "q": "When making decisions, you are usually:",
        "options": {"Slow and thoughtful": "Introvert", "Quick and decisive": "Extrovert"}
    },
    {
        "q": "Your mind focuses more on:",
        "options": {"Ideas, imagination, and possibilities": "Creative", "Details, logic, and facts": "Thinker"}
    },
    {
        "q": "Where do you get your energy from?",
        "options": {"Spending time alone": "Introvert", "Being with people": "Extrovert"}
    }
]

# ---------------------------
# Personality Descriptions
# ---------------------------
personality_descriptions = {
    "Introvert": "You are reflective, thoughtful, and enjoy solitude to recharge.",
    "Extrovert": "You are social, energetic, and love interacting with people.",
    "Thinker": "You are logical, analytical, and prefer careful planning.",
    "Creative": "You are imaginative, innovative, and love exploring new ideas."
}

# ---------------------------
# HTML Template
# ---------------------------
template = """
<!DOCTYPE html>
<html>
<head>
    <title>Personality Predictor</title>
    <style>
        body {
            margin:0;
            padding:0;
            background: linear-gradient(to right, #8e2de2, #4a00e0);
            font-family:'Arial', sans-serif;
            color:#fff;
            text-align:center;
        }
        .container {
            margin-top:50px;
            padding:40px;
            background: rgba(255,255,255,0.08);
            border-radius:25px;
            width:650px;
            margin:auto;
            box-shadow:0 0 25px rgba(0,0,0,0.7);
            backdrop-filter:blur(15px);
        }
        h1 {
            color:#ffdd00;
            text-shadow:0 0 10px #ffdd00;
            font-size:48px;
        }
        .question {
            margin:25px 0;
            font-size:20px;
        }
        select {
            padding:10px;
            border-radius:12px;
            border:none;
            font-size:17px;
            background: rgba(255,255,255,0.12);
            color:#000;
            width:80%;
            transition:0.3s;
        }
        select:hover { background: rgba(255,255,255,0.2); }
        select option { color:#000; }
        select:focus { outline:none; background: rgba(255,255,255,0.25); }
        button {
            padding:14px 30px;
            border:none;
            border-radius:15px;
            background: linear-gradient(to right, #ffdd00, #f7971e);
            color:#000;
            font-size:18px;
            cursor:pointer;
            margin-top:20px;
            transition:0.3s;
            box-shadow:0 0 15px rgba(0,0,0,0.5);
        }
        button:hover { transform: scale(1.05); box-shadow:0 0 25px rgba(0,0,0,0.8); }
        .result {
            margin-top:35px;
            font-size:24px;
            color:#ffdd00;
            text-shadow:0 0 8px #ffdd00;
        }
        .description { font-size:18px; margin-top:15px; color:#fff; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Personality Predictor</h1>
        {% if not result %}
        <form method="POST">
            {% for idx, q in questions %}
                <div class="question">
                    <p>{{ q.q }}</p>
                    <select name="q{{ idx }}" required>
                        <option value="">-- Select an option --</option>
                        {% for opt, val in q.options.items() %}
                        <option value="{{ val }}">{{ opt }}</option>
                        {% endfor %}
                    </select>
                </div>
            {% endfor %}
            <button type="submit">Submit</button>
        </form>
        {% else %}
            <div class="result">
                <h2>Your Personality: {{ result }}</h2>
                <p class="description">{{ description }}</p>
            </div>
        {% endif %}
    </div>
</body>
</html>
"""

# ---------------------------
# Flask Routes
# ---------------------------
@app.route('/', methods=['GET', 'POST'])
def home():
    result = None
    description = None

    if request.method == 'POST':
        scores = {"Introvert":0, "Extrovert":0, "Thinker":0, "Creative":0}
        for idx in range(len(questions)):
            val = request.form.get(f'q{idx}')
            if val:
                scores[val] += 1

        result = max(scores, key=scores.get)
        description = personality_descriptions[result]

    return render_template_string(template, questions=enumerate(questions), result=result, description=description)

# ---------------------------
# Run App
# ---------------------------
if __name__ == '__main__':
    app.run(debug=True)

