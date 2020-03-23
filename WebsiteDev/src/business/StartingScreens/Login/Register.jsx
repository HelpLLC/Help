import React from "react";
import loginImg from "../../../images/Login.svg";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import SignUpScreen from "../Signup/SignUpScreen.js";
import LoginRegister from './LoginRegister'
import RegisterNavigator from './RegisterNavigator'

export function Register() {
  return (
    <BrowserRouter>
      <div className="base-container">
        <div className="header1">Register</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="" />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="username" placeholder="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Confirm Password</label>
              <input
                type="password"
                name="confirm password"
                placeholder="password"
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <button className="btn" type="button">
           Login
          </button>
        </div>
      </div>
    </BrowserRouter>
  );
}
