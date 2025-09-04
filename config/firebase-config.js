<!-- Place this file at: config/firebase-config.js -->
<script type="module">
  // Firebase v10+ modular SDK
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyA-czU60LVydTz9XvhswZgkmJX9fwR_N_U",
    authDomain: "computational-design-454bb.firebaseapp.com",
    projectId: "computational-design-454bb",
    storageBucket: "computational-design-454bb.firebasestorage.app",
    messagingSenderId: "708017149553",
    appId: "1:708017149553:web:f37a930bb369eb01a02dd0"
  };


  // Initialize once, expose on window for other modules

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/*
  const app = initializeApp(firebaseConfig);
  window.$db = getFirestore(app);
  window.$auth = getAuth(app);
*/

</script>
