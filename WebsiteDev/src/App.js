import React, { Component } from 'react';
import Header from './business/Header';
import LandingPage from './business/StartingScreens/LandingPage/LandingPage.js'
import { BrowserRouter } from 'react-router-dom';

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<LandingPage/>
			</BrowserRouter>
		);
	}
}
