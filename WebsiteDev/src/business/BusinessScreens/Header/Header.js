import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import strings from '../../../config/strings';
import './Header.css';
import '../../../config/fontStyles';

export default class Header extends Component {
	render() {
		return (
			<div className='container'>
				<header>
					<h4 class='logo'>Help LLC&nbsp;</h4>
					<nav>
						<ul>
							<li>
								<Link className='mainTextStyle white' to={'/home'}>{strings.Home}</Link>
							</li>
							<li>
								<Link className='mainTextStyle white' to={'/analytics'}>{strings.Analytics}</Link>
							</li>
							<li>
								<Link className='mainTextStyle white' to={'/payments'}>{strings.Payments}</Link>
							</li>
						</ul>
					</nav>
				</header>
			</div>
		);
	}
}
