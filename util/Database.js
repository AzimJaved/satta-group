const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');
require('firebase/firestore');

var DatabaseConfig = require('../config.json').firebase;
DatabaseConfig['apiKey'] = require('../config.json').firebaseServerAPIKey;

if (firebase.apps.length===0)
    firebase.initializeApp(DatabaseConfig)

exports.firebase = firebase

const database = firebase.database()
exports.database = database

const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })
exports.firestore = firestore
