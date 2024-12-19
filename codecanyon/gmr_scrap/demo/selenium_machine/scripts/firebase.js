function loadFirebaseScripts(callback) {
  const scripts = [
    "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore-compat.js",
  ];

  let loadedScripts = 0;

  function scriptLoaded() {
    loadedScripts++;
    if (loadedScripts === scripts.length) {
      callback(); // Call the callback once all scripts are loaded
    }
  }

  scripts.forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = scriptLoaded;
    document.head.appendChild(script);
  });
}

// Firebase initialization logic
function initializeFirebase() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAic1Mo91OQaofpFE8VISIAmvZ1azQ-lmc",
    authDomain: "fir-scrapp.firebaseapp.com",
    projectId: "fir-scrapp",
    storageBucket: "fir-scrapp.firebasestorage.app",
    messagingSenderId: "668777922282",
    appId: "1:668777922282:web:b0fedff7b583523b13a193",
    measurementId: "G-Y0Y82432TG",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Authentication and Firestore
  const auth = firebase.auth();
  window.db = firebase.firestore();

  // Connect to emulators (if needed)
  auth.useEmulator("http://localhost:9099");
  db.useEmulator("localhost", 9100);

  // Example: Sign in with email and password
  auth
    .signInWithEmailAndPassword("chicken.algae.841@example.com", "123456")
    .then((userCredential) => {
      console.log("Signed in successfully:", userCredential.user);
    })
    .catch((error) => {
      console.error("Error signing in:", error);
    });
}

// Load Firebase scripts and initialize Firebase
loadFirebaseScripts(initializeFirebase);
