document.addEventListener('DOMContentLoaded', () => {
    const quizId = '3.1_digital_fabrication';
    const container = document.getElementById('quiz-container');

    if(container){
        Quiz.initQuizPage(container, quizId);
        FORUM.render(quizId);

        const forumInput = document.getElementById('forum-input');
        const forumSubmit = document.getElementById('forum-submit');
        if(forumSubmit && forumInput){
            forumSubmit.addEventListener('click', () => {
                FORUM.post(quizId, forumInput.value);
                forumInput.value = '';
            });
        }
    }
});

const quiz3_1 = [
    { question: "Digital fabrication includes?", options: ["3D printing, CNC", "Painting", "Cooking", "Sculpting"], answer: 0, weight: 1 },
    { question: "Quiz weight?", options: ["14%", "15%", "10%", "20%"], answer: 0, weight: 1 },
    { question: "Forum section?", options: ["Yes", "No"], answer: 0, weight: 1 },
    { question: "Password storage?", options: ["localStorage", "server", "cookies", "users.json"], answer: 0, weight: 1 },
    { question: "Progress tracking?", options: ["UIProgress", "Forum", "Quiz.js", "auth.js"], answer: 0, weight: 1 },
    { question: "Max attempts?", options: ["3", "1", "5", "Unlimited"], answer: 0, weight: 1 },
    { question: "Live feedback?", options: ["Yes", "No"], answer: 0, weight: 1 },
    { question: "Top menu?", options: ["Visible after login", "Hidden", "Always visible", "Optional"], answer: 0, weight: 1 },
    { question: "Left sidebar?", options: ["Navigation links", "Answers", "Score", "Forum"], answer: 0, weight: 1 },
    { question: "Who opens quiz?", options: ["Admin", "Student", "TA", "System"], answer: 0, weight: 1 },
    { question: "Forum posts stored in?", options: ["localStorage", "Server", "Database", "Cookies"], answer: 0, weight: 1 },
    { question: "Step progress shows?", options: ["Checkmarks", "Numbers", "Colors", "None"], answer: 0, weight: 1 },
    { question: "Quiz questions number?", options: ["14", "15", "12", "10"], answer: 0, weight: 1 },
    { question: "Quiz total points?", options: ["14", "15", "10", "12"], answer: 0, weight: 1 }
];

localStorage.setItem('3.1_digital_fabrication', JSON.stringify(quiz3_1));
