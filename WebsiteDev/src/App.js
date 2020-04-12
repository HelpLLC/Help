import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import LandingPageNavigator from "./business/StartingScreens/LandingPage/LandingPageNavigator";
import CreateProductScreen from './business/BusinessScreens/CreateProduct/CreateProductScreen'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <LandingPageNavigator/>
      </BrowserRouter>
    );
  }
}
