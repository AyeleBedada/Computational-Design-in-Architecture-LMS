document.addEventListener('DOMContentLoaded', () => {
    const quizId = '4.1_introduction_BIM';
    const container = document.getElementById('quiz-container');

    if(container){
        QUIZ.initQuizPage(container, quizId);

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



const quiz4_1 = [
    { question: "BIM stands for?", options: ["Building Information Modeling", "Basic Information Management", "Building Industrial Model", "Binary Information Model"], answer: 0, weight: 1 },
    { question: "Quiz weight?", options: ["15%", "14%", "10%", "20%"], answer: 0, weight: 1 },
    { question: "Lesson includes?", options: ["Introduction to BIM", "Painting", "Cooking", "Writing"], answer: 0, weight: 1 },
    { question: "Forum included?", options: ["Yes", "No"], answer: 0, weight: 1 },
    { question: "Live feedback?", options: ["Yes", "No"], answer: 0, weight: 1 },
    { question: "Password stored in?", options: ["localStorage", "server", "cookies", "users.json"], answer: 0, weight: 1 },
    { question: "Max attempts allowed?", options: ["3", "1", "5", "Unlimited"], answer: 0, weight: 1 },
    { question: "Top menu visibility?", options: ["After login", "Before login", "Always hidden", "Optional"], answer: 0, weight: 1 },
    { question: "Left sidebar shows?", options: ["Navigation links", "Answers", "Score", "Forum"], answer: 0, weight: 1 },
    { question: "Step progress shows?", options: ["Checkmarks", "Numbers", "Colors", "None"], answer: 0, weight: 1 },
    { question: "Forum posts stored in?", options: ["localStorage", "Server", "Database", "Cookies"], answer: 0, weight: 1 },
    { question: "Quiz points total?", options: ["15", "14", "12", "10"], answer: 0, weight: 1 },
    { question: "Quiz questions number?", options: ["15", "14", "12", "10"], answer: 0, weight: 1 },
    { question: "Who controls quiz?", options: ["Admin", "Student", "TA", "System"], answer: 0, weight: 1 },
    { question: "Global score tracked via?", options: ["UIProgress", "Forum", "Quiz.js", "auth.js"], answer: 0, weight: 1 }
];

localStorage.setItem('quiz4_1', JSON.stringify(quiz4_1));
