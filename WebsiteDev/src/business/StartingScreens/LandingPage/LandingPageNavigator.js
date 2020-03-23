import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './LandingPage.css';
import SignUpScreen from '../Signup/SignUpScreen';
import fontStyles from '../../../config/fontStyles';
import LandingPage from './LandingPage';
import LoginRegister from '../Login/LoginRegister'

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
					<LoginRegister />
				</Route>
				<Route path='/signUp'>
					<SignUpScreen />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
