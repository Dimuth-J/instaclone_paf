import firebase from 'firebase';

// TODO: Replace the following with your app's Firebase project configuration
firebase.initializeApp({
  apiKey: "AIzaSyDlaCwjn0C4YKLaoZLb9IiuNcmFYPt9gQY",
  authDomain: "instaclone-98ffc.firebaseapp.com",
  projectId: "instaclone-98ffc",
  storageBucket: "instaclone-98ffc.appspot.com",
  messagingSenderId: "492228964607",
  appId: "1:492228964607:web:1e2e728ef7a60196121cca",
  measurementId: "G-G2SBQXKT63"
});

const auth = firebase.auth();
const storage = firebase.storage();

export{storage,auth};
