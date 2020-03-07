//This navigator represents the bottom tab in which the provider will be able to navigate from
//screen to screen. The tabs will be "Analytics", "Payments", "Home", "Schedule", "Settings"
import { createAppContainer } from 'react-navigation';
import settingsScreen from './settingsScreen';
import analyticsScreen from './analyticsScreen';
import paymentsScreen from './paymentsScreen';
import scheduleScreen from './scheduleScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import homeScreen from './homeScreen';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import React from 'react';
import colors from 'config/colors';

//will configure the routes of each screen title to go to the correct screen when clicked on.
const routeConfig = {
	//Route connecting to the analytics screen
	AnalyticsScreen: {
		//connects the object with the help screen component
		screen: analyticsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Analytics,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='chart-line' size={25} type='material-community' color={tintColor} />
			)
		})
	},

	//Route connecting to the payments screen
	PaymentsScreen: {
		//connects the object with the help screen component
		screen: paymentsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Payments,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='dollar' size={25} type='font-awesome' color={tintColor} />
			)
		})
	},

	//Route connecting to the home screen
	HomeScreen: {
		//connects the object with the help screen component
		screen: homeScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Home,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='home' size={25} type='font-awesome' color={tintColor} />
			)
		})
	},

	//Route connecting to the home screen
	ScheduleScreen: {
		//connects the object with the help screen component
		screen: scheduleScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Schedule,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='table' size={25} type='font-awesome' color={tintColor} />
			)
		})
	},

	//Route connecting to the settings screen
	SettingsScreen: {
		//connects the object with the settings screen component
		screen: settingsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Settings,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='cogs' size={25} type='font-awesome' color={tintColor} />
			)
		})
	}
};

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const navigatorConfig = {
	//This will be the default destination whenever this entire navigator is called
	initialRouteName: 'HomeScreen',
	//This turns on the swiping animation
	animationEnabled: true,
	//Explicitly tells the tabBar to be positioned at the bottom of the screen
	tabBarPosition: 'bottom',
	//Styles and colors the tabBar
	tabBarOptions: {
		//Defines what color the label will be when is clicked or swiped to
		activeTintColor: colors.lightBlue,
		//Defines what color the label will be when it is not currently the screen that is being
		//viewed
		inactiveTintColor: colors.black,
		//This styles the tabBar itself; the color, height, etc.
		style: {
			backgroundColor: colors.white,
			height: Dimensions.get('window').height * 0.1,
		},
		//This styles the tabBarLabel
		labelStyle: fontStyles.tabLabelStyle,
		showIcon: true
	}
};

//This links the route configurations and the navigator configurations together to create
//a single tab navigator object
const bottomTabNavigator = createBottomTabNavigator(routeConfig, navigatorConfig);

//This creates and exports the final providerScreensNavigator
export default createAppContainer(bottomTabNavigator);