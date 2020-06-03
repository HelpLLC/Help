import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import LandingPageNavigator from './business/StartingScreens/LandingPage/LandingPageNavigator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import FirebaseFunctions from './config/FirebaseFunctions';

library.add(fab, fas);

export default class App extends Component {
	async componentDidMount() {
		let confirmedRequests = await FirebaseFunctions.call('getConfirmedRequestsByServiceID', {
			serviceID: 'S0bj90OvpgzjxQDUStYo',
			limit: 3,
		});
		let unconfirmedRequests = await FirebaseFunctions.call('getUnconfirmedRequestsByServiceID', {
			serviceID: 'S0bj90OvpgzjxQDUStYo',
			limit: 3,
		});
		console.log(confirmedRequests);
		console.log(unconfirmedRequests);
	}

	render() {
		return (
			<BrowserRouter>
				<LandingPageNavigator />
			</BrowserRouter>
		);
	}
}
