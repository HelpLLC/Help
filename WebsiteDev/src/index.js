import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase'

 var firebaseConfig = {
    apiKey: "AIzaSyDOgt8k63g6SUWvrP-dvu4LEUIbGAwsWDc",
    authDomain: "help-technologies-e4e1c.firebaseapp.com",
    databaseURL: "https://help-technologies-e4e1c.firebaseio.com",
    projectId: "help-technologies-e4e1c",
    storageBucket: "help-technologies-e4e1c.appspot.com",
    messagingSenderId: "127668734841",
    appId: "1:127668734841:web:2e9114165d61025d653da8",
    measurementId: "G-DPVW5284H2"
  };

  firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
