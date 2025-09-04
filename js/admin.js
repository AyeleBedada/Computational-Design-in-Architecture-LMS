// js/admin.js
// Admin features: reports, announcements, quiz availability

const adminDb = firebase.firestore();

// Toggle quiz availability
async function setQuizAvailability(quizId, isAvailable) {
  await adminDb.collection("settings").doc("quizzes").set(
    { [quizId]: isAvailable },
    { merge: true }
  );
  alert(`Quiz ${quizId} is now ${isAvailable ? "available" : "locked"}`);
}

// Check quiz availability
async function getQuizAvailability(quizId) {
  const doc = await adminDb.collection("settings").doc("quizzes").get();
  return doc.exists ? doc.data()[quizId] !== false : true; // default true
}

// Generate student progress report
async function generateReport() {
  const snap = await adminDb.collection("attempts").get();
  const data = snap.docs.map(d => d.data());

  // Display table
  const table = document.getElementById("reportTable");
  table.innerHTML = `
    <tr><th>User</th><th>Quiz</th><th>Score</th><th>Attempts</th><th>Time</th></tr>
  `;
  data.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.user}</td>
      <td>${r.quizId}</td>
      <td>${r.score.toFixed(1)}%</td>
      <td>${r.attempts}</td>
      <td>${r.timestamp?.toDate().toLocaleString() || ""}</td>
    `;
    table.appendChild(row);
  });

  // Render chart
  const ctx = document.getElementById("reportChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(r => r.user + " - " + r.quizId),
      datasets: [{
        label: "Scores",
        data: data.map(r => r.score),
      }]
    }
  });
}

// Export CSV
function exportCSV() {
  const rows = [["User", "Quiz", "Score", "Attempts", "Time"]];
  document.querySelectorAll("#reportTable tr").forEach((tr, i) => {
    if (i === 0) return; // skip header
    const cols = Array.from(tr.querySelectorAll("td")).map(td => td.textContent);
    rows.push(cols);
  });

  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "report.csv";
  a.click();
}

// Post announcement
async function postAnnouncement() {
  const msg = document.getElementById("announcementMessage").value.trim();
  if (!msg) return;
  await adminDb.collection("announcements").add({
    message: msg,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("Announcement posted!");
}

// Load announcements (intro page)
async function loadAnnouncements() {
  const snap = await adminDb.collection("announcements").orderBy("timestamp", "desc").limit(5).get();
  const container = document.getElementById("announcementContainer");
  container.innerHTML = "";
  snap.forEach(doc => {
    const a = doc.data();
    const div = document.createElement("div");
    div.className = "announcement";
    div.innerHTML = `<p><b>Announcement:</b> ${a.message}</p>`;
    container.appendChild(div);
  });
}
