// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi8kTDTkeUI5_YkQmM14jfk6jP8ZLXea8",
  authDomain: "budgettracker-8f9d7.firebaseapp.com",
  databaseURL: "https://budgettracker-8f9d7-default-rtdb.firebaseio.com",
  projectId: "budgettracker-8f9d7",
  storageBucket: "budgettracker-8f9d7.appspot.com",
  messagingSenderId: "7301608252",
  appId: "1:7301608252:web:089ba748ad4e1934c96439",
  measurementId: "G-J7KJR0B88J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);