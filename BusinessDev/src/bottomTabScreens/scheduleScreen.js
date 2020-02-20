//This is going to be the screen where the business's schedule is going to be displayed in a calendar format, allowing for
//customization, and interactions.
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View } from 'react-native';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';

//Creates and exports the class
export default class scheduleScreen extends Component {
	//Declares the screen name in Firebase
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ScheduleScreen', 'scheduleScreen');
	}

	render() {
		return (
			//View that dismisses the keyboard when clicked anywhere else
			<HelpView style={screenStyle.container}>
				<View>
					<TopBanner size={30} title={strings.Schedule} />
				</View>
			</HelpView>
		);
	}
}
