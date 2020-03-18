//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import LaunchScreen from './firstScreens/launchScreen';
import SplashScreen from './firstScreens/splashScreen';
import LogInScreen from './firstScreens/logIn/logInScreen';
import EmailPasswordScreen from './firstScreens/signUp/emailPasswordScreen';
import ServiceScreen from './customerScreens/serviceScreen';
import BusinessProfileScreen from './customerScreens/businessProfileScreen';
import ForgotPasswordScreen from './firstScreens/logIn/forgotPasswordScreen';
import AboutScreen from './settingsScreens/aboutScreen';
import PrivacyScreen from './settingsScreens/privacyScreen';
import ReportIssueScreensNavigator from './settingsScreens/reportIssue/reportScreensNavigator';
import { screenWidth, screenHeight } from 'config/dimensions';
import SettingsScreen from './settingsScreens/settingsScreen';
import FeaturedScreen from './customerScreens/featuredScreen';
import OrderHistoryScreen from './customerScreens/orderHistoryScreen';
import { fadeIn, fromRight } from 'react-navigation-transitions';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import TermsAndConditionsScreen from './settingsScreens/termsAndConditionsScreen';
import CreditsScreen from './settingsScreens/creditsScreen';
import CategoriesScreen from './customerScreens/categoriesScreen';
import CategoryScreen from './customerScreens/categoryScreen';
import AdditionalCustomerInfoScreen from './firstScreens/signUp/additionalCustomerInfoScreen';
import BusinessScheduleScreen from './customerScreens/businessScheduleScreen';
import ServiceQuestionsScreen from './customerScreens/serviceQuestionsScreen';
import BlockedBusinessesScreen from './settingsScreens/blockedBusinessesScreen';
import ServiceRequestedScreen from './customerScreens/serviceRequestedScreen';

//The route config for all of the screens
const routeConfig = {
	//--------------------------- First Screens ---------------------------

	//Takes you to the launch screen which is the blue logo
	LaunchScreen: {
		screen: LaunchScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the splash screen of the app
	SplashScreen: {
		screen: SplashScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the log in screen of the app
	LogInScreen: {
		screen: LogInScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the sign up screen of the app
	EmailPasswordScreen: {
		screen: EmailPasswordScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Route to screen where you create an initial customer account
	AdditionalCustomerInfoScreen: {
		screen: AdditionalCustomerInfoScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the forgot password screen of the app
	ForgotPasswordScreen: {
		screen: ForgotPasswordScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//--------------------------- Customer Screens ---------------------------

	//The route going to the customer service screen
	ServiceScreen: {
		screen: ServiceScreen
	},

	//The route going to the customer scheduling screen
	BusinessScheduleScreen: {
		screen: BusinessScheduleScreen
	},

	//Route to screen with list of all categories
	CategoriesScreen: {
		screen: CategoriesScreen
	},

	//Route leading to the screen with the array of blocked businesses
	BlockedBusinessesScreen: {
		screen: BlockedBusinessesScreen
	},

	ServiceRequestedScreen: {
		screen: ServiceRequestedScreen
	},

	//Route leading to where the customer answers questions for the product
	ServiceQuestionsScreen: {
		screen: ServiceQuestionsScreen
	},
	//Route leading to the screen that displays a specific category
	CategoryScreen: {
		screen: CategoryScreen
	},

	//The route going to the customer company profile screen
	BusinessProfileScreen: {
		screen: BusinessProfileScreen
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
	OrderHistoryScreen: {
		//connects the object with the help screen component
		screen: OrderHistoryScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},
	//--------------------------- Settings Screen ---------------------------

	//Route connecting to the settings screen
	SettingsScreen: {
		//connects the object with the settings screen component
		screen: SettingsScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the about screen
	AboutScreen: {
		screen: AboutScreen
	},

	//Takes you to the report an issue screen
	ReportIssueScreen: {
		screen: ReportIssueScreensNavigator
	},

	//Takes you to the screen containing the privacy policy
	PrivacyScreen: {
		screen: PrivacyScreen
	},

	//Takes you to the terms and conditions screen
	TermsAndConditionsScreen: {
		screen: TermsAndConditionsScreen
	},

	//Takes you to the credits screen
	CreditsScreen: {
		screen: CreditsScreen
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
