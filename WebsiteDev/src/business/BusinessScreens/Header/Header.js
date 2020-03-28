import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './Header.css';
import Dashboard from '../Dashboard/Dashboard';
import Analytics from '../Analytics/Analytics';
import Payments from '../Payments/Payments';

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
							</ul>
						</nav>
					</header>
				</div>
				<Switch>
					<Route path='/home'>
						<Dashboard />
					</Route>
					<Route path='/analytics'>
						<Analytics />
					</Route>
					<Route path='/payments'>
						<Payments />
					</Route>
				</Switch>
			</BrowserRouter>
		);
	}
}
