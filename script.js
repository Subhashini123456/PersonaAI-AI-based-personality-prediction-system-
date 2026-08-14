// =========================================================
// MINDMETRIC AI
// Personality Assessment Logic
// =========================================================


// =========================================================
// QUESTIONS
// =========================================================

const questions = [

    {
        trait: "Openness",
        text: "I enjoy trying new and unfamiliar things."
    },

    {
        trait: "Openness",
        text: "I am curious about different ideas and subjects."
    },

    {
        trait: "Openness",
        text: "I enjoy creative activities such as art, music, or writing."
    },

    {
        trait: "Conscientiousness",
        text: "I complete my tasks on time."
    },

    {
        trait: "Conscientiousness",
        text: "I like to keep my work and surroundings organized."
    },

    {
        trait: "Conscientiousness",
        text: "I make plans before starting important work."
    },

    {
        trait: "Extraversion",
        text: "I enjoy talking to new people."
    },

    {
        trait: "Extraversion",
        text: "I feel comfortable in social situations."
    },

    {
        trait: "Extraversion",
        text: "I enjoy being the center of attention."
    },

    {
        trait: "Agreeableness",
        text: "I care about other people's feelings."
    },

    {
        trait: "Agreeableness",
        text: "I like helping other people."
    },

    {
        trait: "Agreeableness",
        text: "I try to avoid unnecessary arguments and conflicts."
    },

    {
        trait: "Neuroticism",
        text: "I often worry about things."
    },

    {
        trait: "Neuroticism",
        text: "I become stressed easily."
    },

    {
        trait: "Neuroticism",
        text: "I frequently feel nervous in difficult situations."
    }

];


// =========================================================
// ANSWER OPTIONS
// =========================================================

const answerOptions = [

    {
        text: "Strongly Disagree",
        value: 1
    },

    {
        text: "Disagree",
        value: 2
    },

    {
        text: "Neutral",
        value: 3
    },

    {
        text: "Agree",
        value: 4
    },

    {
        text: "Strongly Agree",
        value: 5
    }

];


// =========================================================
// VARIABLES
// =========================================================

let answers = new Array(questions.length).fill(null);

let radarChart = null;


// =========================================================
// DOM ELEMENTS
// =========================================================

const startButton =
    document.getElementById("startAssessment");

const assessmentSection =
    document.getElementById("assessment");

const questionsContainer =
    document.getElementById("questionsContainer");

const submitButton =
    document.getElementById("submitAssessment");

const dashboard =
    document.getElementById("dashboard");

const scoreGrid =
    document.getElementById("scoreGrid");

const dominantCard =
    document.getElementById("dominantCard");

const insightGrid =
    document.getElementById("insightGrid");

const retakeButton =
    document.getElementById("retakeAssessment");


// =========================================================
// START ASSESSMENT
// =========================================================

startButton.addEventListener("click", function () {

    document
        .getElementById("home")
        .style.display = "none";

    document
        .getElementById("features")
        .style.display = "none";

    assessmentSection.style.display = "block";

    assessmentSection.scrollIntoView({
        behavior: "smooth"
    });

    createQuestions();

});


// =========================================================
// CREATE QUESTIONS
// =========================================================

function createQuestions() {

    questionsContainer.innerHTML = "";

    questions.forEach(function (question, index) {

        const questionCard =
            document.createElement("div");

        questionCard.className =
            "question-card";

        questionCard.innerHTML = `

            <div class="question-number">
                QUESTION ${String(index + 1).padStart(2, "0")} / 15
            </div>

            <div class="question-text">
                ${question.text}
            </div>

            <div class="answer-options">

                ${answerOptions.map(function (option) {

                    return `

                        <div
                            class="answer-option"
                            data-question="${index}"
                            data-value="${option.value}"
                        >
                            ${option.text}
                        </div>

                    `;

                }).join("")}

            </div>

        `;

        questionsContainer.appendChild(
            questionCard
        );

    });


    addAnswerListeners();

}


// =========================================================
// ANSWER SELECTION
// =========================================================

function addAnswerListeners() {

    const options =
        document.querySelectorAll(
            ".answer-option"
        );


    options.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                const questionIndex =
                    Number(
                        option.dataset.question
                    );

                const value =
                    Number(
                        option.dataset.value
                    );


                answers[questionIndex] =
                    value;


                // Remove previous selection
                document
                    .querySelectorAll(
                        `[data-question="${questionIndex}"]`
                    )
                    .forEach(function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    });


                // Select current answer
                option.classList.add(
                    "selected"
                );

            }
        );

    });

}


// =========================================================
// SUBMIT ASSESSMENT
// =========================================================

submitButton.addEventListener(
    "click",
    function () {

        const unanswered =
            answers.filter(
                answer => answer === null
            ).length;


        if (unanswered > 0) {

            alert(
                `Please answer all 15 questions.\n\n${unanswered} question(s) remaining.`
            );

            return;

        }


        const scores =
            calculateScores();


        showDashboard(scores);

    }
);


// =========================================================
// CALCULATE SCORES
// =========================================================

function calculateScores() {

    const scores = {

        Openness: 0,

        Conscientiousness: 0,

        Extraversion: 0,

        Agreeableness: 0,

        Neuroticism: 0

    };


    const counts = {

        Openness: 0,

        Conscientiousness: 0,

        Extraversion: 0,

        Agreeableness: 0,

        Neuroticism: 0

    };


    questions.forEach(
        function (question, index) {

            scores[question.trait] +=
                answers[index];

            counts[question.trait]++;

        }
    );


    // Convert to percentage

    Object.keys(scores).forEach(
        function (trait) {

            const maximum =
                counts[trait] * 5;

            scores[trait] =
                Math.round(
                    (scores[trait] / maximum) * 100
                );

        }
    );


    return scores;

}


// =========================================================
// SHOW DASHBOARD
// =========================================================

function showDashboard(scores) {

    assessmentSection.style.display =
        "none";

    dashboard.style.display =
        "block";


    createScoreCards(scores);

    createRadarChart(scores);

    createDominantTrait(scores);

    createInsights(scores);


    dashboard.scrollIntoView({
        behavior: "smooth"
    });

}


// =========================================================
// SCORE CARDS
// =========================================================

function createScoreCards(scores) {

    scoreGrid.innerHTML = "";


    const icons = {

        Openness: "💡",

        Conscientiousness: "🎯",

        Extraversion: "⚡",

        Agreeableness: "🤝",

        Neuroticism: "🌊"

    };


    Object.entries(scores).forEach(
        function ([trait, score]) {

            const card =
                document.createElement("div");

            card.className =
                "score-card";


            card.innerHTML = `

                <div class="score-name">
                    ${icons[trait]} &nbsp; ${trait}
                </div>

                <div class="score-value">
                    ${score}%
                </div>

                <div class="score-bar">

                    <div
                        class="score-fill"
                        style="width:${score}%"
                    ></div>

                </div>

            `;


            scoreGrid.appendChild(card);

        }
    );

}


// =========================================================
// RADAR CHART
// =========================================================

function createRadarChart(scores) {

    const canvas = document.getElementById("radarChart");

    if (!canvas) {
        console.error("Radar chart canvas not found.");
        return;
    }

    // Destroy previous chart
    if (radarChart) {
        radarChart.destroy();
        radarChart = null;
    }

    const ctx = canvas.getContext("2d");

    radarChart = new Chart(ctx, {

        type: "radar",

        data: {

            labels: [
                "Openness",
                "Conscientiousness",
                "Extraversion",
                "Agreeableness",
                "Neuroticism"
            ],

            datasets: [

                {
                    label: "Your Personality",

                    data: [
                        scores.Openness,
                        scores.Conscientiousness,
                        scores.Extraversion,
                        scores.Agreeableness,
                        scores.Neuroticism
                    ],

                    backgroundColor:
                        "rgba(139, 92, 246, 0.20)",

                    borderColor:
                        "#8B5CF6",

                    borderWidth: 3,

                    pointBackgroundColor:
                        "#A78BFA",

                    pointBorderColor:
                        "#FFFFFF",

                    pointBorderWidth: 2,

                    pointRadius: 5,

                    pointHoverRadius: 7
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {
                duration: 1000
            },

            scales: {

                r: {

                    min: 0,

                    max: 100,

                    beginAtZero: true,

                    ticks: {

                        stepSize: 20,

                        color: "#64748B",

                        backdropColor:
                            "transparent",

                        font: {
                            size: 10
                        }

                    },

                    grid: {

                        color:
                            "rgba(148, 163, 184, 0.15)"

                    },

                    angleLines: {

                        color:
                            "rgba(148, 163, 184, 0.15)"

                    },

                    pointLabels: {

                        color:
                            "#CBD5E1",

                        font: {

                            size: 13,

                            weight: "600"

                        }

                    }

                }

            },

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}

// =========================================================
// DOMINANT TRAIT
// =========================================================

function createDominantTrait(scores) {

    let dominantTrait =
        Object.keys(scores)[0];


    Object.keys(scores).forEach(
        function (trait) {

            if (
                scores[trait] >
                scores[dominantTrait]
            ) {

                dominantTrait =
                    trait;

            }

        }
    );


    const score =
        scores[dominantTrait];


    const descriptions = {

        Openness:
            "You tend to be curious, imaginative, creative, and receptive to new ideas and experiences.",

        Conscientiousness:
            "You tend to be organized, responsible, disciplined, and focused on achieving your goals.",

        Extraversion:
            "You tend to be energetic, expressive, social, and comfortable interacting with others.",

        Agreeableness:
            "You tend to be empathetic, cooperative, supportive, and considerate toward others.",

        Neuroticism:
            "You may be more emotionally sensitive and responsive to stress or challenging situations."

    };


    dominantCard.innerHTML = `

        <div class="dominant-label">
            ✦ DOMINANT TRAIT
        </div>

        <div class="dominant-name">
            ${dominantTrait}
        </div>

        <div class="dominant-score">
            ${score}%
        </div>

        <div class="dominant-description">
            ${descriptions[dominantTrait]}
        </div>

    `;

}


// =========================================================
// PERSONALITY INSIGHTS
// =========================================================

function createInsights(scores) {

    insightGrid.innerHTML = "";


    const strongest =
        Object.keys(scores)
            .reduce(function (a, b) {

                return scores[a] >
                    scores[b]
                    ? a
                    : b;

            });


    const weakest =
        Object.keys(scores)
            .reduce(function (a, b) {

                return scores[a] <
                    scores[b]
                    ? a
                    : b;

            });


    const insights = [

        {

            icon: "🚀",

            title: "Your Strength",

            description:
                `Your strongest measured dimension is ${strongest} with a score of ${scores[strongest]}%.`

        },


        {

            icon: "🧩",

            title: "Your Profile",

            description:
                `Your personality profile contains five dimensions, with ${weakest} currently being your lowest measured dimension.`

        },


        {

            icon: "✨",

            title: "MindMetric Insight",

            description:
                "Use these results as a starting point for self-reflection and personal development."

        }

    ];


    insights.forEach(function (insight) {

        const card =
            document.createElement("div");

        card.className =
            "insight-card";


        card.innerHTML = `

            <div class="insight-icon">
                ${insight.icon}
            </div>

            <div class="insight-title">
                ${insight.title}
            </div>

            <div class="insight-description">
                ${insight.description}
            </div>

        `;


        insightGrid.appendChild(card);

    });

}


// =========================================================
// RETAKE ASSESSMENT
// =========================================================

retakeButton.addEventListener(
    "click",
    function () {

        answers =
            new Array(
                questions.length
            ).fill(null);


        if (radarChart) {

            radarChart.destroy();

            radarChart = null;

        }


        dashboard.style.display =
            "none";

        assessmentSection.style.display =
            "block";


        createQuestions();


        assessmentSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);