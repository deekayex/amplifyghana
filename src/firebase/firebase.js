// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdOY0enT1p3Ao12Ed2Lkpij1gLjE0wpX0",
  authDomain: "amplify-gh.firebaseapp.com",
  projectId: "amplify-gh",
  storageBucket: "amplify-gh.appspot.com",
  messagingSenderId: "553417073189",
  appId: "1:553417073189:web:817035b8e969ab721dd5cc",
  measurementId: "G-LNG46DCGZD"
};


// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const database = getFirestore(app);
 const auth = getAuth(app);
 const storage = getStorage(app);

 export {app, database, auth,storage}

