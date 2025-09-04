// js/0_quiz_0.js
const quiz_0_questions = [
  { question: "What is the main objective of Unit 0?", options: ["To introduce computational tools", "To provide syllabus, rubrics, and pre-assessment", "To teach fabrication", "To assign teams"], answer: 1 },
  { question: "Which item is NOT typically part of Unit 0?", options: ["Syllabus", "Rubrics", "Pre-assessment", "Robotics programming"], answer: 3 },
  { question: "The pre-assessment aims to:", options: ["Grade students", "Measure baseline knowledge", "Replace midterm", "Assign final project topics"], answer: 1 },
  { question: "Who posts official announcements on the intro page?", options: ["Students", "Administrator", "Random visitors", "External guests"], answer: 1 },
  { question: "What does a rubric provide?", options: ["Assessment criteria and levels", "Software tutorials", "Fabrication instructions", "Site surveys"], answer: 0 },
  { question: "How many questions are in the Unit 0 quiz?", options: ["10", "12", "14", "16"], answer: 1 },
  { question: "Unit 0 content helps students to:", options: ["Skip coursework", "Understand course structure and expectations", "Learn advanced scripting", "Build robots"], answer: 1 },
  { question: "Where should students refer to find assignment deadlines?", options: ["Syllabus", "Forum posts only", "External websites only", "None of the above"], answer: 0 },
  { question: "Pre-course assessment data is used to:", options: ["Lock quizzes", "Inform teaching pacing", "Auto-grade projects", "Delete accounts"], answer: 1 },
  { question: "Which tool is used to collect pre-assessment responses (example)?", options: ["Google Forms", "Paper only", "Hand signals", "Whiteboard only"], answer: 0 },
  { question: "Who may edit the published rubrics?", options: ["Administrator only", "All students automatically", "Any visitor", "No one"], answer: 0 },
  { question: "What is the weight of this quiz toward the course total?", options: ["4%", "5%", "6%", "7%"], answer: 2 }
];

registerQuiz("0_quiz_0", quiz_0_questions, 6);
