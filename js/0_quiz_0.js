document.addEventListener('DOMContentLoaded', () => {
    const quizId = '0_quiz_0';
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

const quiz0 = [
    { question: "What is the main objective of Unit 0?", options: ["Course overview", "Advanced modeling", "Data analysis", "Project submission"], answer: 0, weight: 1 },
    { question: "Where can students post questions?", options: ["Forum", "Email", "Printing", "Assignments"], answer: 0, weight: 1 },
    { question: "Who is the instructor for this course?", options: ["Ayele", "Admin", "Guest", "Professor X"], answer: 0, weight: 1 },
    { question: "How many lecture hours are allocated?", options: ["2", "3", "4", "5"], answer: 2, weight: 1 },
    { question: "Which unit covers course introduction?", options: ["Unit 0", "Unit 1", "Unit 2", "Unit 3"], answer: 0, weight: 1 },
    { question: "Forum posts are saved in?", options: ["localStorage", "server", "cookies", "session"], answer: 0, weight: 1 },
    { question: "How many attempts per quiz are allowed?", options: ["1", "2", "3", "Unlimited"], answer: 2, weight: 1 },
    { question: "Quizzes are controlled by?", options: ["Student", "Admin", "Teacher Assistant", "System"], answer: 1, weight: 1 },
    { question: "Which tool tracks progress?", options: ["UIProgress", "Forum", "Quiz.js", "auth.js"], answer: 0, weight: 1 },
    { question: "Password changes are saved in?", options: ["localStorage", "users.json", "database", "cookies"], answer: 0, weight: 1 },
    { question: "Can students copy text?", options: ["Yes", "No"], answer: 1, weight: 1 },
    { question: "What does SESSION_KEY store?", options: ["Current User", "Quiz Score", "Forum Posts", "Password"], answer: 0, weight: 1 },
    { question: "Which file handles login?", options: ["auth.js", "quiz.js", "forum.js", "admin.js"], answer: 0, weight: 1 },
    { question: "Which file updates progress bar?", options: ["progress.js", "auth.js", "quiz.js", "forum.js"], answer: 0, weight: 1 }
];

localStorage.setItem('0_quiz_0', JSON.stringify(quiz0));
