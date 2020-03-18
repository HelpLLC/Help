//This is going to be the screen where the business's payment information is displayed. This includes transaction history, stripe
//account management, etc.
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import TopBanner from '../components/TopBanner';
import { screenWidth, screenHeight } from 'config/dimensions';
import { View } from 'react-native';

//Creates and exports the class
export default class paymentsScreen extends Component {
	//Declares the screen name in Firebase
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('PaymentsScreen', 'paymentsScreen');
	}

	render() {
		return (
			//View that dismisses the keyboard when clicked anywhere else
			<HelpView style={screenStyle.container}>
				<View>
					<TopBanner size={30} title={strings.Payments} />
				</View>
			</HelpView>
		);
	}
}
