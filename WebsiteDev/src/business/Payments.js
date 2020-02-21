import React, { Component } from "react";
import "./HomeScreen.css";
import { Link } from "react-router-dom";
import Header from "./Header";

export default class Payments extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <div>
          <h1>Payments</h1>
        </div>
      </div>
    );
  }
}
