//This page will display the credits that cite all resources help uses
//This will be navigated to from the settings screen.
import React, { Component } from 'react';
import { Text, ScrollView, Dimensions } from 'react-native';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpView from '../components/HelpView';
import strings from 'config/strings';
import { screenWidth, screenHeight } from 'config/dimensions';
import TopBanner from '../components/TopBanner/TopBanner';

//The screen crediting all of our usage
export default class creditsScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CreditsScreen', 'creditsScreen');
	}

	//Renders the screen
	render() {
		return (
			<HelpView>
				<TopBanner
					title={strings.Credits}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<ScrollView
					style={{
						flex: 1,
						backgroundColor: colors.lightGray
					}}
					contentContainerStyle={{
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: screenHeight * 0.02
					}}>
					<Text style={fontStyles.mainTextStyleBlack}>
						1) Icons made by "https://www.flaticon.com/authors/smashicons"{'\n\n'}
						2) Icons made by "https://www.flaticon.com/authors/kiranshastry"{'\n\n'}
						3) Icons made by "https://www.flaticon.com/authors/smalllikeart"{'\n\n'}
						4) Icons made by "https://www.flaticon.com/authors/freepik"{'\n\n'}
					</Text>
				</ScrollView>
			</HelpView>
		);
	}
}
