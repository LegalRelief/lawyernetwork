const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyCG5by6yatRfG5Bae7J5NS8ZXaCvSlKaDM",
  authDomain: "legalrelief-lawyer.firebaseapp.com",
  databaseURL: "https://legalrelief-lawyer-default-rtdb.firebaseio.com",
  projectId: "legalrelief-lawyer",
  storageBucket: "legalrelief-lawyer.appspot.com",
  messagingSenderId: "55759515991",
  appId: "1:55759515991:web:16e5a1d55a4093b44bce12",
  measurementId: "G-0MC6CVWQL8"
};
fbApp = firebase.initializeApp(firebaseConfig);

module.exports = fbApp;