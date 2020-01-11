import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends Component {
	render() {
		return (
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<p>
						Yooo guys. I deployed this React app using Firebase Hosting. It's so easy lmao.
						Basically react native but just changed the names of the components lmao.
					</p>
          <p>
            I put everything under the directory "Help/WebsiteDev". The instructions for how to deploy the website
            are under Help/WebsiteDev/Instructions.txt
          </p>
          <p>
            To edit the site, just go to Help/WebsiteDev/src/App.js & play around
          </p>
				</header>
			</div>
		);
	}
}
