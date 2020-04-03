import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import LandingPageNavigator from "./business/StartingScreens/LandingPage/LandingPageNavigator";
import Calendar from "./business/BusinessScreens/Calender/Calender";
import BusinessServiceCard from "./components/BusinessServiceCard";

export default class App extends Component {
  render() {
    return <BusinessServiceCard />;
  }
}
