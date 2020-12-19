//This navigator represents the bottom tab in which the provider will be able to navigate from
//screen to screen. The tabs will be "Analytics", "Payments", "Home", "Schedule", "Settings"
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import profileScreen from './profile/profileScreen/profileScreen';
import viewEmployeesScreen from './dispatchScreens/viewEmployeesScreen/viewEmployeesScreen';
import timeOffReqsScreen from './dispatchScreens/timeOffReqsScreen/timeOffReqsScreen';
import viewServicesScreen from './dashboardScreens/mainDashboardScreens/services/serviceScreen';
import unconfirmedReqsScreen from './dashboardScreens/mainDashboardScreens/unconfirmedRequests/unconfirmedRequestsScreen';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import { screenWidth, screenHeight } from 'config/dimensions';
import { Icon } from 'react-native-elements';
import React from 'react';
import colors from 'config/colors';
import viewRevenueScreen from './analyticsScreens/viewRevenueScreen/viewRevenueScreen';
import viewTopServicesScreen from './analyticsScreens/viewTopServicesScreen/viewTopServicesScreen';
import viewTopLocationsScreen from './analyticsScreens/viewTopLocationsScreen/viewTopLocationsScreen';

//will configure the routes of each top tab to go to the correct screen when clicked on.
const dashboardRouteConfig = {
	//Route connecting to the view services screen
	ViewServicesScreen: {
		//connects the object with the help screen component
		screen: viewServicesScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Services,
		}),
	},

	//Route connecting to the unconfirmed requests screen
	UnconfirmedReqsScreen: {
		//connects the object with the help screen component
		screen: unconfirmedReqsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.UnconfirmedReqs,
		}),
	},
};

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const dashboardNavigatorConfig = {
	//This will be the default destination whenever this entire navigator is called
	initialRouteName: 'ViewServicesScreen',
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
			backgroundColor: colors.white,
		},
		//This styles the object for the tab label
		labelStyle: {
			fontFamily: 'Lucida Grande',
		},
		//This styles the tabBar itself; the color, height, etc.
		style: {
			backgroundColor: colors.blue,
			height: screenHeight * 0.06,
		},
		showLabel: true,
		showIcon: false,
	},
};

const dashboardTopTabNavigator = createMaterialTopTabNavigator(
	dashboardRouteConfig,
	dashboardNavigatorConfig
);

//will configure the routes of each top tab to go to the correct screen when clicked on.
const analyticsRouteConfig = {
	//Route connecting to the monthly revenue screen
	MonthlyRevenueScreen: {
		//connects the object with the help screen component
		screen: viewRevenueScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Revenue,
		}),
	},

	//Route connecting to the top services screen
	TopServicesScreen: {
		//connects the object with the help screen component
		screen: viewTopServicesScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.TopServices,
		}),
	},

	//Route connecting to the top locations screen
	TopLocationsScreen: {
		//connects the object with the help screen component
		screen: viewTopLocationsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.CustomerLocations,
		}),
	},
};

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const analyticsNavigatorConfig = {
	//This will be the default destination whenever this entire navigator is called
	initialRouteName: 'MonthlyRevenueScreen',
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
			backgroundColor: colors.white,
		},
		//This styles the object for the tab label
		labelStyle: {
			fontFamily: 'Lucida Grande',
		},
		//This styles the tabBar itself; the color, height, etc.
		style: {
			backgroundColor: colors.blue,
			height: screenHeight * 0.08,
		},
		showLabel: true,
		showIcon: false,
	},
};

const analyticsTopTabNavigator = createMaterialTopTabNavigator(
	analyticsRouteConfig,
	analyticsNavigatorConfig
);

//will configure the routes of each top tab to go to the correct screen when clicked on.
const dispatchRouteConfig = {
	//Route connecting to the view employees screen
	ViewEmployeesScreen: {
		//connects the object with the help screen component
		screen: viewEmployeesScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Employees,
		}),
	},

	//Route connecting to the time off requests screen
	TimeOffReqsScreen: {
		//connects the object with the help screen component
		screen: timeOffReqsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.TimeOffReqs,
		}),
	},
};

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const dispatchNavigatorConfig = {
	//This will be the default destination whenever this entire navigator is called
	initialRouteName: 'ViewEmployeesScreen',
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
			backgroundColor: colors.white,
		},
		//This styles the object for the tab label
		labelStyle: {
			fontFamily: 'Lucida Grande',
		},
		//This styles the tabBar itself; the color, height, etc.
		style: {
			backgroundColor: colors.blue,
			height: screenHeight * 0.06,
		},
		showLabel: true,
		showIcon: false,
	},
};

const dispatchTopTabNavigator = createMaterialTopTabNavigator(
	dispatchRouteConfig,
	dispatchNavigatorConfig
);

//will configure the routes of each screen title to go to the correct screen when clicked on.
const routeConfig = {
	//Route connecting to the dashboard screen
	DashboardScreen: {
		//connects the object with the help screen component
		screen: dashboardTopTabNavigator,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Dashboard,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='home' size={45} type='entypo' color={tintColor} />
			),
		}),
	},

	//Route connecting to the calendar screen
	CalendarScreen: {
		//connects the object with the help screen component
		screen: profileScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Calendar,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='calendar' size={40} type='font-awesome' color={tintColor} />
			),
		}),
	},

	//Route connecting to the analytics screen
	AnalyticsScreen: {
		//connects the object with the help screen component
		screen: analyticsTopTabNavigator,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Analytics,
			tabBarIcon: ({ tintColor, focused }) => (
				// <Icon name='chart-line' size={45} type='material-community' color={tintColor} />
				<Icon name='line-chart' size={45} type='font-awesome' color={tintColor} />
			),
		}),
	},

	//Route connecting to the dispatch screen
	DispatchScreen: {
		//connects the object with the help screen component
		screen: dispatchTopTabNavigator,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Dispatch,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='users' size={40} type='font-awesome' color={tintColor} />
			),
		}),
	},

	//Route connecting to the payments screen
	PaymentsScreen: {
		//connects the object with the help screen component
		screen: profileScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Payments,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='dollar' size={40} type='font-awesome' color={tintColor} />
			),
		}),
	},

	//Route connecting to the settings screen
	SettingsScreen: {
		//connects the object with the settings screen component
		screen: profileScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			tabBarLabel: strings.Settings,
			tabBarIcon: ({ tintColor, focused }) => (
				<Icon name='cogs' size={40} type='font-awesome' color={tintColor} />
			),
		}),
	},
};

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const navigatorConfig = {
	//This will be the default destination whenever this entire navigator is called
	initialRouteName: 'DashboardScreen',
	//This turns on the swiping animation
	animationEnabled: true,
	//Explicitly tells the tabBar to be positioned at the bottom of the screen
	tabBarPosition: 'bottom',
	//Styles and colors the tabBar
	tabBarOptions: {
		//Defines what color the label will be when is clicked or swiped to
		activeTintColor: colors.blue,
		//Defines what color the label will be when it is not currently the screen that is being
		//viewed
		inactiveTintColor: colors.darkBlue,
		//This styles the tabBar itself; the color, height, etc.
		style: {
			backgroundColor: colors.white,
			height: screenHeight * 0.1,
		},
		showLabel: true,
		showIcon: true,
	},
};

//This links the route configurations and the navigator configurations together to create
//a single tab navigator object
const bottomTabNavigator = createBottomTabNavigator(routeConfig, navigatorConfig);

//This creates and exports the final providerScreensNavigator
export default createAppContainer(bottomTabNavigator);
