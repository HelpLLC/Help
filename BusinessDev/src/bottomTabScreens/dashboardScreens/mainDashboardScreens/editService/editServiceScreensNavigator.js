import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import serviceInfoScreen from './serviceInfoScreen/serviceInfoScreen';
import requestsScreen from './requestsScreen/serviceRequestsScreen';
import requestsHistoryScreen from './requestHistoryScreen/serviceRequestHistoryScreen';
import unconfirmedRequestsScreen from './unconfirmedRequestsScreen/serviceUnconfirmedRequestsScreen';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import { screenWidth, screenHeight } from 'config/dimensions';
import { Icon } from 'react-native-elements';
import React from 'react';
import { View } from 'react-native';
import colors from 'config/colors';

//will configure the routes of each top tab to go to the correct screen when clicked on.
const editServiceRouteConfig = {
	//Route connecting to the view services screen
	ServiceInfoScreen: {
		//connects the object with the help screen component
		screen: serviceInfoScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Services
		})
	},

	//Route connecting to the unconfirmed requests screen
	RequestsScreen: {
		//connects the object with the help screen component
		screen: requestsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.UnconfirmedReqs
		})
    },
    
    //Route connecting to the view services screen
	RequestsHistoryScreen: {
		//connects the object with the help screen component
		screen: requestsHistoryScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Services
		})
    },
    
    //Route connecting to the view services screen
	UnconfirmedRequestsScreen: {
		//connects the object with the help screen component
		screen: unconfirmedRequestsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Services
		})
	}
};

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const editServiceNavigatorConfig = {
	//This will be the default destination whenever this entire navigator is called
	initialRouteName: 'ServiceInfoScreen',
	//This turns on the swiping animation
	animationEnabled: true,
	//Explicitly tells the tabBar to be positioned at the top of the screen
	tabBarPosition: 'top',
	//Styles and colors the tabBar
	tabBarOptions: {
		//Defines what color the label will be when is clicked or swiped to
		activeTintColor: colors.white,
		//Defines what color the label will be when it is not currently the screen that is being
		//viewed
		inactiveTintColor: colors.white,
		//This styles the line at the bottom of the tab
		indicatorStyle: {
			backgroundColor: colors.white
		},
		//This styles the object for the tab label
		labelStyle: {
			fontFamily: 'Lucida Grande'
		},
		//This styles the tabBar itself; the color, height, etc.
		style: {
			backgroundColor: colors.blue,
			height: screenHeight * 0.06
		},
		showLabel: true,
		showIcon: false
	}
};

const editServiceTopTabNavigator = createMaterialTopTabNavigator(editServiceRouteConfig, editServiceNavigatorConfig);

//This creates and exports the final providerScreensNavigator
export default createAppContainer(editServiceTopTabNavigator);
