import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './LandingPage.css';
import Login from '../Login/Login';
import SignUpScreen from '../Signup/SignUpScreen';
import fontStyles from '../../../config/fontStyles';
import LandingPage from './LandingPage';

export default function LandingPageNavigator() {
	return (
		<BrowserRouter>
			<div>
				<header className="header">
					<h4 style={fontStyles.mainTextStyleWhite} class='logo'>
						Help For Business
					</h4>
					<nav>
						<ul>
							<li>
								<Link style={fontStyles.mainTextStyleWhite} to={'/login'}>
									Log In
								</Link>
							</li>
							<li>
								<Link style={fontStyles.mainTextStyleWhite} to={'/signUp'}>
									Sign Up
								</Link>
							</li>
						</ul>
					</nav>
				</header>
			</div>
			<Switch>
				<Route exact path='/'>
					<LandingPage />
				</Route>
				<Route path='/login'>
					<Login />
				</Route>
				<Route path='/signUp'>
					<SignUpScreen />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
