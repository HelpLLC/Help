//This screen is going to be where the analytics for the business is displayed. It will contain graphs, charts, and other
//insights & indicators
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';
import { View } from 'react-native';

//Creates and exports the class
export default class analyticsScreen extends Component {
	//Declares the screen name in Firebase
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('AnalyticsScreen', 'analyticsScreen');
	}

	render() {
		return (
			//View that dismisses the keyboard when clicked anywhere else
			<HelpView style={screenStyle.container}>
				<View>
					<TopBanner size={30} title={strings.Analytics} />
				</View>
			</HelpView>
		);
	}
}
