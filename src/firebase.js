import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCdxV6Hk4Yr_UO139RUd5nAJut5J_tb43o",
    authDomain: "instagram-clone-45bf5.firebaseapp.com",
    databaseURL: "https://instagram-clone-45bf5.firebaseio.com",
    projectId: "instagram-clone-45bf5",
    storageBucket: "instagram-clone-45bf5.appspot.com",
    messagingSenderId: "444455667087",
    appId: "1:444455667087:web:e9f4cd0fce39e271b3f7fa",
    measurementId: "G-H98LWG3LVY"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};



