// config/firebase-config.js
// Initialize Firebase (compat for simple static hosting)
// Make sure you've enabled Firestore in the Firebase console.
// Suggested Firestore security rules during development (set appropriate rules before production):
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }

const firebaseConfig = {
  apiKey: "AIzaSyA-czU60LVydTz9XvhswZgkmJX9fwR_N_U",
  authDomain: "computational-design-454bb.firebaseapp.com",
  projectId: "computational-design-454bb",
  storageBucket: "computational-design-454bb.firebasestorage.app",
  messagingSenderId: "708017149553",
  appId: "1:708017149553:web:f37a930bb369eb01a02dd0"
};

if (!window.firebase || !firebase.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}
window.db = firebase.firestore();
