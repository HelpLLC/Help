//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import launchScreen from './firstScreens/launchScreen';
import splashScreen from './firstScreens/splashScreen';
import logInScreen from './firstScreens/logInScreen';
import signUpScreen from './firstScreens/signUpScreen';
import RequesterServiceScreen from './requesterScreens/serviceScreen';
import RequesterCompanyProfileScreen from './requesterScreens/companyProfileScreen';
import MessagingScreen from './chats/messagingScreen';
import forgotPasswordScreen from './firstScreens/forgotPasswordScreen';
import aboutScreen from './settingsScreens/aboutScreen';
import privacyScreen from './settingsScreens/privacyScreen';
import reportIssueScreensNavigator from './settingsScreens/reportIssue/reportScreensNavigator';
import chatsScreen from './chats/chatsScreen';
import settingsScreen from './settingsScreens/settingsScreen';
import FeaturedScreen from './requesterScreens/featuredScreen';
import RequesterOrderHistoryScreen from './requesterScreens/orderHistoryScreen';
import { fadeIn, fromRight } from 'react-navigation-transitions';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import termsAndConditionsScreen from './firstScreens/termsAndConditionsScreen';
import creditsScreen from './settingsScreens/creditsScreen';
import RequesterCategoriesScreen from './requesterScreens/categoriesScreen';
import categoryScreen from './requesterScreens/categoryScreen';
import createRequesterProfileScreen from './firstScreens/createRequesterProfileScreen';
import requesterScheduleScreen from './requesterScreens/requestScheduleScreen';
import requesterQuestionsScreen from './requesterScreens/requesterQuestionsScreen';
import blockedBusinessesScreen from './requesterScreens/blockedBusinessesScreen';
import RequesterServiceRequestedScreen from './requesterScreens/serviceRequestedScreen';

//The route config for all of the screens
const routeConfig = {
	//--------------------------- First Screens ---------------------------

	//Takes you to the launch screen which is the blue logo
	LaunchScreen: {
		screen: launchScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the splash screen of the app
	SplashScreen: {
		screen: splashScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the log in screen of the app
	LogInScreen: {
		screen: logInScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the sign up screen of the app
	SignUpScreen: {
		screen: signUpScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Route to screen where you create an initial requester
	CreateRequesterProfileScreen: {
		screen: createRequesterProfileScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the forgot password screen of the app
	ForgotPasswordScreen: {
		screen: forgotPasswordScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//--------------------------- Requester Screens ---------------------------

	//The route going to the requester service screen
	RequesterServiceScreen: {
		screen: RequesterServiceScreen
	},

	//The route going to the requester scheduling screen
	RequesterScheduleScreen: {
		screen: requesterScheduleScreen
	},

	//Route to screen with list of all categories
	RequesterCategoriesScreen: {
		screen: RequesterCategoriesScreen
	},

	//Route leading to the screen with the array of blocked businesses
	RequesterBlockedBusinessesScreen: {
		screen: blockedBusinessesScreen
	},

	RequesterServiceRequestedScreen: {
		screen: RequesterServiceRequestedScreen
	},

	//Route leading to where the customer answers questions for the product
	RequesterQuestionsScreen: {
		screen: requesterQuestionsScreen
	},
	//Route leading to the screen that displays a specific category
	CategoryScreen: {
		screen: categoryScreen
	},

	//The route going to the requester company profile screen
	RequesterCompanyProfileScreen: {
		screen: RequesterCompanyProfileScreen
	},

	//Route connecting to the featured screen
	FeaturedScreen: {
		//connects the object with the help screen component
		screen: FeaturedScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Route connecting to the order history screen
	RequesterOrderHistoryScreen: {
		//connects the object with the help screen component
		screen: RequesterOrderHistoryScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Route to edit a requester's profile
	EditRequesterProfileScreen: {
		screen: createRequesterProfileScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//--------------------------- Messaging Screens ---------------------------

	//The route going the screen where users can chat
	MessagingScreen: {
		screen: MessagingScreen
	},

	//Route connecting to the chats screen
	ChatsScreen: {
		//connects the object with the chats screen component
		screen: chatsScreen,
		//sets up what the tab will be titled
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//--------------------------- Settings Screen ---------------------------

	//Route connecting to the settings screen
	SettingsScreen: {
		//connects the object with the settings screen component
		screen: settingsScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the about screen
	AboutScreen: {
		screen: aboutScreen
	},

	//Takes you to the report an issue screen
	ReportIssueScreen: {
		screen: reportIssueScreensNavigator
	},

	//Takes you to the screen containing the privacy policy
	PrivacyScreen: {
		screen: privacyScreen
	},

	//Takes you to the terms and conditions screen
	TermsAndConditionsScreen: {
		screen: termsAndConditionsScreen
	},

	//Takes you to the credits screen
	CreditsScreen: {
		screen: creditsScreen
	}
};

//Makes the zoom in transition for the initial LaunchScreen that opens
const handleCustomTransition = ({ scenes }) => {
	const prevScene = scenes[scenes.length - 2];

	if (prevScene && prevScene.route.routeName === 'LaunchScreen') {
		return fadeIn(750);
	} else {
		return fromRight();
	}
};

//The navigation config containing the initial route name
const navigatorConfig = {
	initialRouteName: 'LaunchScreen',
	headerMode: 'none',
	transitionConfig: (nav) => handleCustomTransition(nav)
};

//Creates & exports the stack navigator
const MainStackStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const MainStackNavigator = createAppContainer(MainStackStackNavigator);
export default MainStackNavigator;