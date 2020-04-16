//This screen is the settings screen that will availalbe from both providers and requesters' home
//screens. It will contain multiple options the businessID can choose from that will take them to seperate
//screens using a StackNavigator
import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';

class settingsScreen extends Component {
	state = {
		isOpen: false
	};

	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('SettingsScreen', 'settingsScreen');
	}

	render() {
		//This constant holds the value for the right angle icon which appears frequently
		//in this class
		const angleRightIcon = (
			<Icon name={'angle-right'} type='font-awesome' color={colors.lightBlue} />
		);
		//Retrieves the current businessID from the params
		const { businessID } = this.props.navigation.state.params;
		return (
			<HelpView style={screenStyle.container}>
				<View>
					<TopBanner size={30} title={strings.Settings} />
					<View style={{ flex: 0.1 }}></View>
					<View style={{ flex: 2 }}>
						<View style={{ flex: 1 }}>
							<WhiteCard
								 
								text={strings.ReportAnIssue}
								mainTextStyle={fontStyles.mainTextStyleBlack}
								comp={angleRightIcon}
								//Pressing this leads to the report an issue screen
								onPress={() =>
									this.props.navigation.push('ReportIssueScreen', {
										businessID
									})
								}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<WhiteCard
								 
								text={strings.Notifications}
								mainTextStyle={fontStyles.mainTextStyleBlack}
								comp={angleRightIcon}
								//Pressing this leads to the about screen page
								onPress={() => {
									Linking.openURL('app-settings:');
								}}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<WhiteCard
								 
								text={strings.About}
								mainTextStyle={fontStyles.mainTextStyleBlack}
								comp={angleRightIcon}
								//Pressing this leads to the about screen page
								onPress={() => this.props.navigation.push('AboutScreen')}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<WhiteCard
								 
								text={strings.Privacy}
								mainTextStyle={fontStyles.mainTextStyleBlack}
								comp={angleRightIcon}
								//Pressing this leads to the about screen page
								onPress={() => this.props.navigation.push('PrivacyScreen')}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<WhiteCard
								 
								text={strings.TermsAndConditions}
								mainTextStyle={fontStyles.mainTextStyleBlack}
								comp={angleRightIcon}
								//Pressing this leads to the about screen page
								onPress={() => this.props.navigation.push('TermsAndConditionsScreen')}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<WhiteCard
								 
								text={strings.Credits}
								mainTextStyle={fontStyles.mainTextStyleBlack}
								comp={angleRightIcon}
								//Pressing this leads to the about screen page
								onPress={() => this.props.navigation.push('CreditsScreen')}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<WhiteCard
								 
								text={strings.LogOut}
								mainTextStyle={fontStyles.mainTextStyleRed}
								//To-Do: Needs to call a logout function
								onPress={async () => {
									await FirebaseFunctions.logOut(businessID);
									this.props.navigation.push('SplashScreen');
								}}
							/>
						</View>
						<View style={{ flex: 1.5 }}></View>
					</View>
				</View>
			</HelpView>
		);
	}
}

export default settingsScreen;
