import React, { Component } from "react";
import Header from "../Header/Header";
import Calendar from "react-calendar";
import "./Calendar.css";

export default class Analytics extends Component {
  render() {
    return (
      <section>
        <h1>Calender</h1>
        <div>
          <Calendar className="class1" tileClassName="class2" />
        </div>
      </section>
    );
  }
}
