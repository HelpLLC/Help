import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Header.css"

export default class Header extends Component {
  render() {
    return (
        <div className="container">
        <header>
          <a href="">
            <h4 class="logo">Help LLC&nbsp;</h4>
          </a>
          <nav>
            <ul>
              <li>
                <Link to={"/home"}>Home</Link>
              </li>
              <li>
                <Link to={"/payments"}>Payments</Link>
              </li>
              <li>
                <a href="#about">Calenders</a>
              </li>
              <li>
                <a href="#contact">Analytics</a>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}
