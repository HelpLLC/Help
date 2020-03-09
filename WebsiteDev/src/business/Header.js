import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import "./Header.css";
<<<<<<< Updated upstream
import Home from "./Dashboar";
=======
import Home from "./Home";
>>>>>>> Stashed changes
import Analytics from "./Analytics";
import Payments from "./Payments";

export default class Header extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <header>
            <h4 class="logo">Help LLC&nbsp;</h4>
            <nav>
              <ul>
                <li>
                  <Link to={"/home"}>Home</Link>
                </li>
<<<<<<< Updated upstream
				<li>
					<Link to={'/calender'}>Calender</Link>
				</li>
=======
>>>>>>> Stashed changes
                <li>
                  <Link to={"/analytics"}>Analytics</Link>
                </li>
                <li>
                  <Link to={"/payments"}>Payments</Link>
                </li>
              </ul>
            </nav>
          </header>
        </div>
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/analytics">
            <Analytics />
          </Route>
          <Route path="/payments">
            <Payments />
          </Route>
<<<<<<< Updated upstream
		  <Route path='/calender'>
			
		  </Route>
=======
>>>>>>> Stashed changes
        </Switch>
      </BrowserRouter>
    );
  }
}
