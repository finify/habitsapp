// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  

export default defineNuxtPlugin(() => {
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCqNX93rX1b_rRwpLH56Qv7N-K1jo7THKI",
    authDomain: "habitsapp-1a246.firebaseapp.com",
    projectId: "habitsapp-1a246",
    storageBucket: "habitsapp-1a246.firebasestorage.app",
    messagingSenderId: "996189914140",
    appId: "1:996189914140:web:7e10033d1d192dafdf4bd9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  return { 
    provide: {
      firebaseApp : app,
      db,
    }
   }

})

