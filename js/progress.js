// js/progress.js
// Progress tracking system

const PROGRESS_KEY = "user_progress";

function getProgress() {
  return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
}

function saveProgress(p) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

// Mark page as visited (1%)
function markPageComplete(pageId) {
  const p = getProgress();
  if (!p.pages) p.pages = {};
  if (!p.pages[pageId]) {
    p.pages[pageId] = true;
    updateTotalProgress(p);
  }
  saveProgress(p);
}

// Update quiz score (6% or 7%)
function setQuizScore(quizId, scorePercent, weight) {
  const p = getProgress();
  if (!p.quizzes) p.quizzes = {};
  p.quizzes[quizId] = { score: scorePercent, weight };
  updateTotalProgress(p);
  saveProgress(p);
}

// Calculate total progress
function updateTotalProgress(p) {
  let total = 0;

  // Pages (1% each)
  if (p.pages) total += Object.keys(p.pages).length;

  // Quizzes
  if (p.quizzes) {
    for (const q of Object.values(p.quizzes)) {
      total += (q.score / 100) * q.weight;
    }
  }

  p.total = Math.min(100, total);
}

// Render progress bar
function renderProgress() {
  const p = getProgress();
  const total = p.total || 0;

  const bar = document.querySelector("#progressBar");
  const circle = document.querySelector("#progressCircle");
  const stepper = document.querySelectorAll(".step");

  if (bar) bar.style.width = total + "%";
  if (circle) circle.style.strokeDashoffset = 440 - (440 * total) / 100;
  if (stepper.length) {
    stepper.forEach((s, i) => {
      if (i < total / (100 / stepper.length)) {
        s.classList.add("done");
      }
    });
  }
}
