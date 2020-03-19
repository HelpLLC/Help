import React, { Component } from 'react';
import Header from './business/BusinessScreens/Header/Header';
import { BrowserRouter } from 'react-router-dom';
import LandingPageNavigator from './business/StartingScreens/LandingPage/LandingPageNavigator';

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<LandingPageNavigator />
			</BrowserRouter>
		);
	}
}
