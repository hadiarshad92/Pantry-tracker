// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import exp from "constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKZlyYtUgFttL_KpDeiUOzUacEYkFv62c",
  authDomain: "pantry-tracker-caeb7.firebaseapp.com",
  projectId: "pantry-tracker-caeb7",
  storageBucket: "pantry-tracker-caeb7.appspot.com",
  messagingSenderId: "662532051358",
  appId: "1:662532051358:web:9bf80853e582736453868f",
  measurementId: "G-C7GCL489G4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
