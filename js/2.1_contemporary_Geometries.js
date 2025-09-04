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



document.addEventListener('DOMContentLoaded', () => {
    const quizId = '1.2_handles_Manipulators';
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



const quiz2_1 = [
    { question: "Topological surfaces include?", options: ["Torus, Möbius Strip", "Circle", "Square", "Triangle"], answer: 0, weight: 1 },
    { question: "Non-standard geometries are?", options: ["Complex surfaces", "Flat shapes", "Linear forms", "Simple blocks"], answer: 0, weight: 1 },
    { question: "Quiz weight?", options: ["14%", "10%", "15%", "20%"], answer: 0, weight: 1 },
    { question: "Forum purpose?", options: ["Discussion", "Printing", "Saving PDF", "Watching videos"], answer: 0, weight: 1 },
    { question: "Progress tracked via?", options: ["UIProgress", "Quiz.js", "Forum.js", "auth.js"], answer: 0, weight: 1 },
    { question: "Password storage?", options: ["localStorage", "users.json", "server DB", "Cookies"], answer: 0, weight: 1 },
    { question: "Max attempts?", options: ["3", "1", "5", "Unlimited"], answer: 0, weight: 1 },
    { question: "Live feedback?", options: ["Yes", "No"], answer: 0, weight: 1 },
    { question: "Quiz controlled by?", options: ["Admin", "Student", "TA", "System"], answer: 0, weight: 1 },
    { question: "Left sidebar shows?", options: ["Navigation Links", "Answers", "Score", "Forum"], answer: 0, weight: 1 },
    { question: "Top menu shows?", options: ["After login", "Before login", "Always hidden", "Optional"], answer: 0, weight: 1 },
    { question: "Forum posts stored in?", options: ["localStorage", "Server", "Database", "Cookies"], answer: 0, weight: 1 },
    { question: "Step progress uses?", options: ["Checkmarks", "Numbers only", "Colors only", "None"], answer: 0, weight: 1 },
    { question: "Quiz points count?", options: ["14", "10", "15", "12"], answer: 0, weight: 1 }
];

localStorage.setItem('quiz2_1', JSON.stringify(quiz2_1));
