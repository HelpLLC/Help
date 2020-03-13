import React, { Component, Image } from "react";
import "./LandingPage.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Login from "../Login/Login.js";
import "../../BusinessScreens/Header/Header.css";

export default function LandingPage() {
  return (
      <section>
        <section class="hero" id="hero">
          <h1 class="hero_header">Help</h1>
          <h2 class="tagline">Enhance Your Business</h2>
        </section>
        <section class="about" id="about">
          <h2 class="hidden">About</h2>
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
          <h2 class="parallax">About</h2>
          <p class="parallax_description">
            As one of the leading local businesses in the Woodinville area, we
            attribute our reputation to the lasting customer relationships we’ve
            developed throughout the years. We believe that all of our customers
            deserve the highest level of service, and we are committed to
            providing just that. Get in touch today to learn more.
          </p>
        </section>

        <section class="footer_banner" id="contact">
          <h2 class="hidden">Footer Banner Section</h2>
          <p class="hero_header">FOR THE LATEST NEWS &amp; UPDATES</p>
          <div class="button">subscribe</div>
        </section>

        <div class="copyright">
          &copy;2020- <strong>Help</strong>
        </div>
      </section>
  );
}
