//This will export the firebase object that can be used throughout the app to read and write to the 
//firestore database or other firebase actions
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
//The configurations telling our code how to connect to our firestore
const config = {
    apiKey: "AIzaSyDEno0bMnDNLWC6pvEiHz-K1QbT1_btRjc",
    authDomain: "services-40cf3.firebaseapp.com",
    databaseURL: "https://services-40cf3.firebaseio.com",
    projectId: "services-40cf3",
    storageBucket: "services-40cf3.appspot.com",
    messagingSenderId: "518672413750"
};

//Connects and sets up timestamps setting
firebase.initializeApp(config);

//exports the object
export default firebase;