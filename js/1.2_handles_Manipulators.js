document.addEventListener('DOMContentLoaded', () => {
    const quizId = '1.2_handles_Manipulators';
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

const quiz1_2 = [
    { question: "Handles and manipulators help in?", options: ["3D modeling", "Painting", "Writing Essays", "Photography"], answer: 0, weight: 1 },
    { question: "Manipulators allow?", options: ["Scaling, rotating, moving", "Printing", "Cooking", "Running simulations"], answer: 0, weight: 1 },
    { question: "Quiz weight?", options: ["14%", "10%", "15%", "20%"], answer: 0, weight: 1 },
    { question: "Forum is used for?", options: ["Discussion", "Archiving", "Downloading", "Watching videos"], answer: 0, weight: 1 },
    { question: "Quiz shows live feedback?", options: ["Yes", "No"], answer: 0, weight: 1 },
    { question: "LocalStorage saves?", options: ["Password, Forum, Progress", "Videos", "PDF", "Emails"], answer: 0, weight: 1 },
    { question: "Max attempts allowed?", options: ["3", "1", "5", "Unlimited"], answer: 0, weight: 1 },
    { question: "Progress update type?", options: ["Linear, Stepped, Circular, Animated", "Linear only", "Circular only", "None"], answer: 0, weight: 1 },
    { question: "Who opens quiz?", options: ["Admin", "Student", "Guest", "TA"], answer: 0, weight: 1 },
    { question: "Forum posts saved in?", options: ["localStorage", "Server", "Database", "Cookies"], answer: 0, weight: 1 },
    { question: "Quiz questions correct answer?", options: ["Instantly visible", "After submission", "Never", "Optional"], answer: 0, weight: 1 },
    { question: "Left sidebar shows?", options: ["Navigation Links", "Answers", "Score", "Forum"], answer: 0, weight: 1 },
    { question: "Top menu shows?", options: ["After login", "Before login", "Always hidden", "Optional"], answer: 0, weight: 1 },
    { question: "Quiz total points count?", options: ["14", "10", "15", "12"], answer: 0, weight: 1 }
];

localStorage.setItem('1.2_handles_Manipulators', JSON.stringify(quiz1_2));
