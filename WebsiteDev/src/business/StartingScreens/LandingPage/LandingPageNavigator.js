import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './LandingPage.css';
import Login from '../Login/Login';
import SignUpScreen from '../Signup/SignUpScreen';
import fontStyles from '../../../config/fontStyles';
import LandingPage from './LandingPage';
import Dashboard from '../../../business/BusinessScreens/Dashboard/Dashboard';
import PrivacyPolicy from '../../PrivacyPolicy.js';
import Credits from '../../Credits.js';
import TermsAndConditions from '../../TermsAndConditions.js';

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
				<Route path='/dashboard'>
					<Dashboard />
				</Route>
				<Route path='/privacypolicy'>
					<PrivacyPolicy />
				</Route>
				<Route path='/terms'>
					<TermsAndConditions />
				</Route>
				<Route path='/credits'>
					<Credits />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
