
import React, { Component } from 'react';
import './Dashboard.css';
import Header from '../Header/Header';
import TitleComponent from '../../../components/TitleComponent';
import BusinessServiceCard from '../../../components/BusinessServiceCard';

export default class Home extends Component {
	render() {
		return (
			<div >
				<div>
					<TitleComponent text={'Current Services'} isCentered={true} textColor="#00B0F0" />
				</div>
				<BusinessServiceCard />
				<BusinessServiceCard />
				<BusinessServiceCard />
			</div>
		);
	}
}
