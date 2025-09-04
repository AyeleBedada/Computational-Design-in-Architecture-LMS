// js/forum.js
// Forum system (per page, synced with Firestore)

const forumDb = firebase.firestore();

// Load forum posts for the current page
async function loadForum(pageId) {
  const container = document.getElementById("forumContainer");
  container.innerHTML = "<p>Loading forum...</p>";

  const snap = await forumDb.collection("forum").where("pageId", "==", pageId).orderBy("timestamp").get();
  container.innerHTML = "";

  snap.forEach(doc => {
    const post = doc.data();
    const div = document.createElement("div");
    div.className = "forum-post";
    div.innerHTML = `
      <div class="forum-avatar">${post.user[0].toUpperCase()}</div>
      <div class="forum-content">
        <b>${post.user}</b> <small>${post.timestamp.toDate().toLocaleString()}</small>
        <p>${post.message}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

// Post a new message
async function postMessage(pageId) {
  const msgInput = document.getElementById("forumMessage");
  const msg = msgInput.value.trim();
  if (!msg) return;

  const session = JSON.parse(localStorage.getItem("sessionUser") || "null");
  if (!session) {
    alert("You must be logged in to post.");
    return;
  }

  await forumDb.collection("forum").add({
    pageId,
    user: session.username,
    message: msg,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  msgInput.value = "";
  loadForum(pageId);
}
