import React, { Component } from "react";
import Header from "./business/BusinessScreens/Header/Header";
import { BrowserRouter } from "react-router-dom";
import LandingPageNavigator from "./business/StartingScreens/LandingPage/LandingPageNavigator";
import * as firebase from 'firebase'

export default class App extends Component {
  
componentDidMount(){
  const firebaseConfig = {
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
}

  render() {
    return (
      <BrowserRouter>
        <LandingPageNavigator />
      </BrowserRouter>
    );
  }
}
