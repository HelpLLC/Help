import React, { Component } from 'react';
import Header from './business/Header';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './business/LandingPage'

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<LandingPage/>
			</BrowserRouter>
		);
	}
}
