import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import LandingPageNavigator from './business/StartingScreens/LandingPage/LandingPageNavigator';
import ContactUs from './business/StartingScreens/ContactUs/ContactUs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Login } from './business/StartingScreens/Authentication/Login';
import Dashboard from './business/BusinessScreens/Dashboard/Dashboard';
import { Register } from './business/StartingScreens/Authentication/Register';
import TermsAndConditions  from './business/TermsAndConditions';

library.add(fab, fas);

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<LandingPageNavigator />
			</BrowserRouter>
		);
	}
}
