// js/quiz.js
// Quiz engine with attempts, feedback, persistence

const MAX_ATTEMPTS = 3;

async function loadQuiz(quizId, questions, weight) {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  const attemptsKey = `quiz_attempts_${quizId}`;
  let attempts = parseInt(localStorage.getItem(attemptsKey) || "0");

  if (attempts >= MAX_ATTEMPTS) {
    container.innerHTML = "<p>You have reached the maximum attempts for this quiz.</p>";
    return;
  }

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "quiz-question";
    div.innerHTML = `
      <p>${i + 1}. ${q.question}</p>
      ${q.options
        .map(
          (opt, j) =>
            `<label><input type="radio" name="q${i}" value="${j}"> ${opt}</label><br>`
        )
        .join("")}
      <p class="feedback" id="fb${i}"></p>
    `;
    container.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.textContent = "Submit Quiz";
  btn.onclick = () => submitQuiz(quizId, questions, weight, attemptsKey);
  container.appendChild(btn);
}

async function submitQuiz(quizId, questions, weight, attemptsKey) {
  let score = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const fb = document.getElementById(`fb${i}`);
    if (selected && parseInt(selected.value) === q.answer) {
      score++;
      fb.textContent = "✅ Correct";
      fb.style.color = "green";
    } else {
      fb.textContent = "❌ Wrong";
      fb.style.color = "red";
    }
  });

  const percent = (score / questions.length) * 100;
  alert(`You scored ${percent.toFixed(1)}%`);

  // Save attempt
  let attempts = parseInt(localStorage.getItem(attemptsKey) || "0");
  attempts++;
  localStorage.setItem(attemptsKey, attempts);

  // Save progress
  setQuizScore(quizId, percent, weight);

  // Sync to Firestore
  const session = JSON.parse(localStorage.getItem("sessionUser") || "null");
  if (session) {
    await db.collection("attempts")
      .doc(session.username + "_" + quizId)
      .set({
        user: session.username,
        quizId,
        score: percent,
        attempts,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}
