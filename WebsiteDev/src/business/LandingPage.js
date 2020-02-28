import React, { Component } from "react";
import "./Analytics.css";
import Header from "./Header";
import "./LandingPage.css";
import "./LoginButton.css";
import placeHolder from "../images/placeholder.jpg";

export default class Analytics extends Component {
  render() {
    return (
      <section>
        <section class="hero" id="hero">
          <h1 class="hero_header">Help</h1>
          <h2 class="tagline">Enhance Your Business</h2>
          <div class="left">
            <a href="login.html" class="btn btn1">
              Login
            </a>
          </div>
          <div class="right">
            <a href="" class="btn btn2">
              Signup
            </a>
          </div>
        </section>
        <section class="about" id="about">
          <h2 class="hidden">About</h2>
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
          <p class="text_column">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </section>
        <div class="gallery">
          <div class="thumbnail">
            <h1 class="stats">1500</h1>
            <h4>TITLE</h4>
            <p>One line description</p>
          </div>
          <div class="thumbnail">
            <h1 class="stats">2300</h1>
            <h4>TITLE</h4>
            <p>One line description</p>
          </div>
          <div class="thumbnail">
            <h1 class="stats">7500</h1>
            <h4>TITLE</h4>
            <p>One line description</p>
          </div>
          <div class="thumbnail">
            <h1 class="stats">9870</h1>
            <h4>TITLE</h4>
            <p>One line description</p>
          </div>
        </div>
        <section class="banner">
          <h2 class="parallax">PARALLAX HERO</h2>
          <p class="parallax_description">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
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
        <section class="footer_banner" id="contact">
          <h2 class="hidden">Footer Banner Section</h2>
          <p class="hero_header">FOR THE LATEST NEWS &amp; UPDATES</p>
          <div class="button">subscribe</div>
        </section>

        <div class="copyright">
          &copy;2019- <strong>Help</strong>
        </div>
      </section>
    );
  }
}
