import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './Header.css';
import Home from './Home';
import Analytics from './Analytics';
import Payments from './Payments';
import SignUpScreen from './SignUpScreen';

export default class Header extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className='container'>
					<header>
							<h4 class='logo'>Help LLC&nbsp;</h4>
						<nav>
							<ul>
								<li>
									<Link to={'/home'}>Home</Link>
								</li>
                			<li>
									<Link to={'/analytics'}>Analytics</Link>
								</li>
								<li>
									<Link to={'/payments'}>Payments</Link>
								</li>
								<li>
									<Link to={'/SignUpScreen'}>Business Sign Up</Link>
								</li>
							</ul>
						</nav>
					</header>
				</div>
				<Switch>
					<Route path='/home'>
						<Home />
					</Route>
					<Route path='/analytics'>
						<Analytics />
					</Route>
					<Route path='/payments'>
						<Payments />
					</Route>
					<Route path='/SignUpScreen'>
						<SignUpScreen />
					</Route>
				</Switch>
			</BrowserRouter>
		);
	}
}
