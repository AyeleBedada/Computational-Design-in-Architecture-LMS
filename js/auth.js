// --- AUTH.JS ---
async function loginUser(email, password) {
  // Load users.json
  const res = await fetch("data/users.json");
  const users = await res.json();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid credentials!");
    return;
  }

  // EmailJS verification
  const code = Math.floor(100000 + Math.random() * 900000); // 6-digit
  localStorage.setItem("verificationCode", code);

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    to_email: email,
    code: code
  }).then(() => {
    const entered = prompt("A 6-digit code was sent to your email. Enter it:");
    if (parseInt(entered) === code) {
      // Save session in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Also store session in Firestore for cross-device persistence
      db.collection("sessions").doc(user.email).set({
        email: user.email,
        role: user.role,
        lastLogin: new Date()
      });

      if (user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "00_navigation_tutorial.html";
      }
    } else {
      alert("Invalid verification code!");
    }
  });
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function changePassword(email) {
  const code = Math.floor(100000 + Math.random() * 900000);
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    to_email: email,
    code: code
  }).then(() => {
    const entered = prompt("Enter the 6-digit code sent to your email:");
    if (parseInt(entered) === code) {
      const newPass = prompt("Enter your new password:");
      updatePassword(email, newPass);
    }
  });
}

async function updatePassword(email, newPass) {
  // Update in Firestore
  await db.collection("users").doc(email).set({ password: newPass }, { merge: true });
  alert("Password updated successfully!");
}
