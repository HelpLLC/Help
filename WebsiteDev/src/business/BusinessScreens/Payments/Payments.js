import React, { Component } from 'react';
import './Payments.css';
import Header from '../Header/Header';
import strings from '../../../config/strings';

export default class Payments extends Component {
	render() {
		return <h1>{strings.Payments}</h1>;
	}
}
