const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');
require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyCmnquHaOz1rTMx5_gCK3R7-h2CZOGKPck",
    authDomain: "satta-group.firebaseapp.com",
    databaseURL: "https://satta-group.firebaseio.com",
    projectId: "satta-group",
    storageBucket: "satta-group.appspot.com",
    messagingSenderId: "883522861433",
    appId: "1:883522861433:web:676f89d63d3b11a1"
  };

firebase.initializeApp(firebaseConfig);

module.exports.firebaseAuth = firebase.auth();