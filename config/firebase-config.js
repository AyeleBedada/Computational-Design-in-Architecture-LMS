// Firebase config...
//Replace YOUR_API_KEY etc. with your Firebase config

const firebaseConfig = {
  apiKey: "AIzaSyA-czU60LVydTz9XvhswZgkmJX9fwR_N_U",
  authDomain: "computational-design-454bb.firebaseapp.com",
  projectId: "computational-design-454bb",
  storageBucket: "computational-design-454bb.firebasestorage.app",
  messagingSenderId: "708017149553",
  appId: "1:708017149553:web:f37a930bb369eb01a02dd0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
