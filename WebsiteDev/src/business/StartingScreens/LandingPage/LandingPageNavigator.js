import React from "react";
import { Route, Switch, BrowserRouter, Link} from "react-router-dom";
import Login from "../Login/Login";
import SignUpScreen from "../Signup/SignUpScreen";
import LandingPage from "./LandingPage";

export default function LandingPageNavigator() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <h4 class="logo">Help LLC&nbsp;</h4>
          <nav>
            <ul>
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/login"}>Login</Link>
              </li>
              <li>
                <Link to={"/signup"}>Signup</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Switch>
        <Route path="/">
          <LandingPage />
        </Route>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/signup">
          <SignUpScreen />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
