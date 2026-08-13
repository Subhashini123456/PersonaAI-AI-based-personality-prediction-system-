from flask import Flask, render_template, request
import numpy as np
import joblib

app = Flask(__name__)

# Load trained personality model
model = joblib.load("ml/personality_model.pkl")

QUESTIONS = [
    "I enjoy meeting and talking with new people.",
    "I enjoy exploring unfamiliar ideas and experiences.",
    "I keep my work organized and structured.",
    "I usually try to understand how other people feel.",
    "I often feel energetic when I am around other people.",
    "I plan important tasks before I begin them.",
    "I am curious about new subjects and possibilities.",
    "I am comfortable expressing my opinions in groups.",
    "I usually complete tasks before moving to something else.",
    "I am willing to help people when they need support.",
    "I enjoy learning about different perspectives.",
    "I feel comfortable taking the lead in social situations.",
    "I prefer having a clear plan rather than acting spontaneously.",
    "I care about maintaining positive relationships with others.",
    "I enjoy creative activities and thinking differently."
]

TRAITS = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism"
]


def get_interpretation(scores):
    openness = scores[0]
    conscientiousness = scores[1]
    extraversion = scores[2]
    agreeableness = scores[3]
    neuroticism = scores[4]

    strongest_index = int(np.argmax(scores))
    strongest_trait = TRAITS[strongest_index]

    descriptions = {
        "Openness":
            "You show a strong tendency toward curiosity, creativity, "
            "new experiences, and exploring different ideas.",

        "Conscientiousness":
            "You show a strong preference for organization, planning, "
            "responsibility, and completing tasks.",

        "Extraversion":
            "You appear comfortable with social interaction, communication, "
            "and energetic environments.",

        "Agreeableness":
            "Your responses suggest empathy, cooperation, and consideration "
            "for the people around you.",

        "Neuroticism":
            "Your responses indicate greater sensitivity to stress and "
            "emotional changes."
    }

    return strongest_trait, descriptions[strongest_trait]


@app.route("/", methods=["GET", "POST"])
def index():

    if request.method == "POST":

        responses = []

        for i in range(15):
            value = request.form.get(f"q{i}")

            if value is None:
                value = 3

            responses.append(int(value))

        input_data = np.array(responses).reshape(1, -1)

        prediction = model.predict(input_data)[0]

        prediction = np.clip(prediction, 0, 100)

        scores = {
            "Openness": round(float(prediction[0])),
            "Conscientiousness": round(float(prediction[1])),
            "Extraversion": round(float(prediction[2])),
            "Agreeableness": round(float(prediction[3])),
            "Neuroticism": round(float(prediction[4]))
        }

        strongest_trait, description = get_interpretation(
            list(scores.values())
        )

        return render_template(
            "index.html",
            questions=QUESTIONS,
            results=True,
            scores=scores,
            strongest_trait=strongest_trait,
            description=description
        )

    return render_template(
        "index.html",
        questions=QUESTIONS,
        results=False
    )


if __name__ == "__main__":
    app.run(debug=True)
