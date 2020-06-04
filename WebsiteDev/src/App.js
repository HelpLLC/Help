import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import LandingPageNavigator from './business/StartingScreens/LandingPage/LandingPageNavigator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import FirebaseFunctions from './config/FirebaseFunctions';
import ServiceScreen from './business/BusinessScreens/ServiceScreen/ServiceScreen';

library.add(fab, fas);

export default class App extends Component {
	render() {
		return (
			<ServiceScreen/>
		// 	<BrowserRouter>
		// 	<LandingPageNavigator />
		// </BrowserRouter>
		);
	}
}
