// js/auth.js
// Authentication, EmailJS verification, role detection, sessions

// Firebase + Firestore already initialized in firebase-config.js
const db = firebase.firestore();

// --- EmailJS init ---
(function() {
  emailjs.init("zpLGGHu-3-PeFLptL"); // your public key
})();

// --- Helper: send verification email ---
async function sendVerificationCode(email) {
  const code = Math.floor(100000 + Math.random() * 900000); // 6-digit
  localStorage.setItem(`verify_${email}`, JSON.stringify({ code, ts: Date.now() }));

  await emailjs.send("service_ozngnh9", "template_c6pl9c9", {
    to_email: email,
    code: code
  });

  return code;
}

// --- Login handler ---
async function login(username, password) {
  const res = await fetch("data/users.json");
  const users = await res.json();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) throw new Error("Invalid credentials");

  // Send verification email
  await sendVerificationCode(user.email);
  return user;
}

// --- Verify code ---
function verifyCode(email, inputCode) {
  const saved = JSON.parse(localStorage.getItem(`verify_${email}`) || "null");
  if (!saved) return false;
  if (Date.now() - saved.ts > 10 * 60 * 1000) return false; // 10 min expiry
  return saved.code == inputCode;
}

// --- Store session in Firestore ---
async function createSession(user) {
  const session = {
    username: user.username,
    email: user.email,
    role: user.role,
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
  };

  localStorage.setItem("sessionUser", JSON.stringify(session));
  await db.collection("sessions").doc(user.username).set(session, { merge: true });

  return session;
}

// --- Logout ---
async function logout() {
  localStorage.removeItem("sessionUser");
  location.href = "index.html";
}

// --- Password reset ---
async function resetPassword(username, newPass) {
  // Update in Firestore
  await db.collection("users").doc(username).set({ password: newPass }, { merge: true });
  alert("Password updated successfully");
}
