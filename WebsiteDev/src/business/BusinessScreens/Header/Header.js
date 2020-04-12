import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default class Header extends Component {
	render() {
		return (
				<div className='container'>
					<header>
						<h4 class='logo'>Help LLC&nbsp;</h4>
						<nav>
							<ul>
								<li>
									<Link to={'/home'}>Home</Link>
								</li>
								<li>
									<Link to={'/analytics'}>Analytics</Link>
								</li>
								<li>
									<Link to={'/payments'}>Payments</Link>
								</li>
							</ul>
						</nav>
					</header>
				</div>
		);
	}
}
