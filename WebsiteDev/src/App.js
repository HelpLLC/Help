import React, { Component } from 'react';
import Header from './business/Header';
import LandingPage from './business/StartingScreens/LandingPage/LandingPage.js'
import { BrowserRouter } from 'react-router-dom';
import Login from './business/StartingScreens/Login/Login'

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<LandingPage/>
			</BrowserRouter>
		);
	}
}
