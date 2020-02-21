import React, { Component } from "react";
import HomeScreen from "./business/Home";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <HomeScreen />
      </BrowserRouter>
    );
  }
}
