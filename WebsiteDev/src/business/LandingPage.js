import React, { Component, Image } from "react";
import "./Analytics.css";
import Header from "./Header";
import "./LandingPage.css";
import "./LoginButton.css";
<<<<<<< Updated upstream
import placeHolder from "../images/placeholder.jpg";
=======
import "./Header.css";
import { Link } from "react-router-dom";
>>>>>>> Stashed changes

export default class Analytics extends Component {
  render() {
    return (
<<<<<<< Updated upstream
      <section>
        <section class="hero" id="hero">
          <h1 class="hero_header">Help</h1>
          <h2 class="tagline">Enhance Your Business</h2>
          <div class="left">
=======
      <div className="container">
        <section>
          <header>
            <h4 class="logo">Help LLC&nbsp;</h4>
            <nav>
              <ul>
                <li>
                  <Link to={"/home"}>Login</Link>
                </li>
                <li>
                  <Link to={"/analytics"}>Sign Up</Link>
                </li>
              </ul>
            </nav>
          </header>
        </section>
        <section className="hero" id="hero">
          <h1 className="hero_header">Help</h1>
          <h2 className="tagline">Enhance Your Business</h2>
          <div className="left">
>>>>>>> Stashed changes
            <a href="login.html" class="btn btn1">
              Login
            </a>
          </div>
<<<<<<< Updated upstream
          <div class="right">
=======
          <div className="right">
>>>>>>> Stashed changes
            <a href="" class="btn btn2">
              Signup
            </a>
          </div>
        </section>
<<<<<<< Updated upstream
        <section class="about" id="about">
          <h2 class="hidden">About</h2>
=======
        <section className="about" id="about">
          <h2 style={{ textAlign: "center", color: "gray" }}>Features</h2>
>>>>>>> Stashed changes
          <p class="text_column">
            As one of the leading local businesses in the Woodinville area, we
            attribute our reputation to the lasting customer relationships we’ve
            developed throughout the years. We believe that all of our customers
            deserve the highest level of service, and we are committed to
            providing just that. Get in touch today to learn more.
          </p>
          <p class="text_column">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
          <p class="text_column">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </section>
        <section class="banner">
<<<<<<< Updated upstream
          <h2 class="parallax">About</h2>
          <p class="parallax_description">
            As one of the leading local businesses in the Woodinville area, we
            attribute our reputation to the lasting customer relationships we’ve
            developed throughout the years. We believe that all of our customers
            deserve the highest level of service, and we are committed to
            providing just that. Get in touch today to learn more.
          </p>
        </section>
        <footer>
          <article class="footer_column">
            <h3>ABOUT</h3>
            <img
              src={placeHolder}
              alt=""
              width="400"
              height="200"
              class="cards"
            />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla
            </p>
          </article>
          <article class="footer_column">
            <h3>LOCATION</h3>
            <img
              src={placeHolder}
              alt=""
              width="400"
              height="200"
              class="cards"
            />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla
            </p>
          </article>
        </footer>
=======
          <section>
            <h2 class="parallax">About</h2>
            <p class="parallax_description" style={{ textAlign: "center" }}>
              As one of the leading local businesses in the Woodinville area, we
              attribute our reputation to the lasting customer relationships
              we’ve developed throughout the years. We believe that all of our
              customers deserve the highest level of service, and we are
              committed to providing just that. Get in touch today to learn
              more.
            </p>
          </section>
        </section>
>>>>>>> Stashed changes
        <section class="footer_banner" id="contact">
          <h2 class="hidden">Footer Banner Section</h2>
          <p class="hero_header">FOR THE LATEST NEWS &amp; UPDATES</p>
          <div class="button">subscribe</div>
        </section>
<<<<<<< Updated upstream

        <div class="copyright">
          &copy;2019- <strong>Help</strong>
        </div>
      </section>
=======
        <div class="copyright">
          &copy;2020- <strong>Help</strong>
        </div>
      </div>
>>>>>>> Stashed changes
    );
  }
}
