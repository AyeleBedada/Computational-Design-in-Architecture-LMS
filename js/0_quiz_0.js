const quiz0 = [
    { question: "What is the main objective of Unit 0?", options: ["Objective 1", "Objective 2", "Objective 3", "Objective 4"], answer: 0, weight: 1 },
    { question: "What is a forum used for?", options: ["Discussion", "Email", "Printing", "Homework"], answer: 0, weight: 1 },
    { question: "Who is the instructor of this course?", options: ["Ayele", "Admin", "Guest", "Professor X"], answer: 0, weight: 1 },
    { question: "How many hours are allocated for lectures?", options: ["2", "3", "4", "5"], answer: 2, weight: 1 },
    { question: "Which section covers course introduction?", options: ["Unit 0", "Unit 1", "Unit 2", "Unit 3"], answer: 0, weight: 1 },
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

localStorage.setItem('quiz0', JSON.stringify(quiz0));
