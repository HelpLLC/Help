import React, { Component } from 'react';
import Header from './business/Header';
import { BrowserRouter } from 'react-router-dom';

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Header />
			</BrowserRouter>
		);
	}
}
