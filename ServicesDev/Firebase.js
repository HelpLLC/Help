//The configurations for firebase
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

//The configurations containing all of the information
const config = {
    apiKey: "AIzaSyDyRzgCbOAQo2_Le9I_xYPcqnV22UqieFk",
    authDomain: "help-b0b4d.firebaseapp.com",
    databaseURL: "https://help-b0b4d.firebaseio.com",
    projectId: "help-b0b4d",
    storageBucket: "help-b0b4d.appspot.com",
    messagingSenderId: "1053430109556"
}

firebase.initializeApp(config);

export default firebase;
