//This navigator will control the flow between the report issue screen and the screen which
//confirms that the issue has been reported. It will include the transition as well as the initial
//route.
import reportIssueScreen from './reportIssueScreen';
import issueReportedScreen from './issueReportedScreen';
import React from 'react';
import fadeOutTransition from 'config/transitions/fadeOutTransition';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';

//This route config will define the routes for this navigator which will only be the
//reportIssueScreen & the issueReportedScreen
const routeConfig = {
	//The route for the reportIssueScreen
	ReportIssueScreen: {
		screen: reportIssueScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<TopBanner
					title={strings.ReportAnIssue}
					leftIconName='angle-left'
					leftOnPress={() => {
						//Method will dismiss the current stack and then go back to
						//make sure the animation is to the left
						navigation.dismiss();
						navigation.goBack();
					}}
				/>
			),
			gesturesEnabled: false
		})
	},

	//The route for the issueReportedScreen
	IssueReportedScreen: {
		screen: issueReportedScreen,
		navigationOptions: ({ navigation }) => ({
			header: <TopBanner title={strings.ReportAnIssue} leftIconName='angle-left' />,
			gesturesEnabled: false
		})
	}
};

//The configuration for the navigator that controls all of the navigator's settings
//such as Initial Route
const navigatorConfig = {
	headerMode: 'none',
	//Makes the reportIssue screen defined above the default route when this navigator is accessed
	initialRouteName: 'ReportIssueScreen',
	//Makes the transition
	transitionConfig: fadeOutTransition
};
//Creates and exports the stack navigator
const reportScreensStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const reportScreensNavigator = createAppContainer(reportScreensStackNavigator);
export default reportScreensNavigator;
