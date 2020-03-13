import React, { Component } from "react";
import Header from "./business/BusinessScreens/Header/Header";
import LandingPage from "./business/StartingScreens/LandingPage/LandingPage.js";
import { BrowserRouter } from "react-router-dom";
import Login from "./business/StartingScreens/Login/Login";
import { Switch, Route } from "react-router-dom";
import LandingPageNavigator from "./business/StartingScreens/LandingPage/LandingPageNavigator";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <LandingPageNavigator />
      </BrowserRouter>
    );
  }
}
