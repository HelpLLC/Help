//This screen is the settings screen that will availalbe from both providers and customer's home
//screens. It will contain multiple options the user can choose from that will take them to seperate
//screens using a StackNavigator
import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';

class settingsScreen extends Component {
	state = {
		isOpen: false,
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
		//Retrieves the current user from the params
		let { customer, allServices } = this.props.navigation.state.params;

		return (
			<SideMenu
				onChange={(isOpen) => {
					this.setState({ isOpen });
				}}
				isOpen={this.state.isOpen}
				menu={
					<LeftMenu
						navigation={this.props.navigation}
						allServices={allServices}
						customer={customer}
					/>
				}>
				<HelpView style={screenStyle.container}>
					<View>
						<TopBanner
							leftIconName='navicon'
							leftOnPress={() => {
								FirebaseFunctions.analytics.logEvent(
									'sidemenu_opened_from_settings'
								);
								this.setState({ isOpen: true });
							}}
							size={30}
							title={strings.Settings}
						/>
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
											customerID: customer.customerID,
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
									onPress={() =>
										this.props.navigation.push('TermsAndConditionsScreen')
									}
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
									text={strings.BlockedBusinesses}
									mainTextStyle={fontStyles.mainTextStyleBlack}
									comp={angleRightIcon}
									//Pressing this leads to the blocked users screen
									onPress={() =>
										this.props.navigation.push('BlockedBusinessesScreen', {
											customer,
										})
									}
								/>
							</View>
							<View style={{ flex: 3 }}></View>
						</View>
					</View>
				</HelpView>
			</SideMenu>
		);
	}
}

export default settingsScreen;
