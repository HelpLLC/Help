//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import ProviderCreateProductScreen from './providerScreens/createProductScreen';
import ProviderEditCompanyProfileScreen from './firstScreens/createProviderProfileScreen';
import providerAdditionalInformationScreen from './firstScreens/providerAdditionalInformationScreen';
import ProviderProductScreen from './providerScreens/productScreen';
import launchScreen from './firstScreens/launchScreen';
import splashScreen from './firstScreens/splashScreen';
import logInScreen from './firstScreens/logInScreen';
import signUpScreen from './firstScreens/signUpScreen';
import createProviderProfileScreen from './firstScreens/createProviderProfileScreen';
import accountNotVerifiedScreen from './firstScreens/accountNotVerifiedScreen';
import customerRequestScreen from './providerScreens/customerRequestScreen';
import ProviderProductHistoryScreen from './providerScreens/productHistoryScreen';
import MessagingScreen from './chats/messagingScreen';
import forgotPasswordScreen from './firstScreens/forgotPasswordScreen';
import aboutScreen from './settingsScreens/aboutScreen';
import privacyScreen from './settingsScreens/privacyScreen';
import reportIssueScreensNavigator from './settingsScreens/reportIssue/reportScreensNavigator';
import chatsScreen from './chats/chatsScreen';
import settingsScreen from './settingsScreens/settingsScreen';
import providerScreensNavigator from './providerScreens/providerScreensNavigator';
import { fadeIn, fromRight } from 'react-navigation-transitions';
import { createAppContainer } from 'react-navigation';
import termsAndConditionsScreen from './firstScreens/termsAndConditionsScreen';
import { createStackNavigator } from 'react-navigation-stack';
import creditsScreen from './settingsScreens/creditsScreen';
import createScheduleScreen from './providerScreens/createScheduleScreen';
import createQuestionsScreen from './providerScreens/createQuestionsScreen';

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

	//Takes you to the forgot password screen of the app
	ForgotPasswordScreen: {
		screen: forgotPasswordScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the screen where businesses will create their initial profile
	CreateProviderProfileScreen: {
		screen: createProviderProfileScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the screen which will allow providers to add more information about themselves
	ProviderAdditionalInformationScreen: {
		screen: providerAdditionalInformationScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//Takes you to the screen which will display if a business account has not yet been approved
	AccountNotVerifiedScreen: {
		screen: accountNotVerifiedScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//--------------------------- Business Screens ---------------------------

	//The route going to the create product screen
	ProviderCreateProductScreen: {
		screen: ProviderCreateProductScreen
	},

	//The route going to the edit company profile screen
	ProviderEditCompanyProfileScreen: {
		screen: ProviderEditCompanyProfileScreen
	},

	//Route leading to where businesses create their questions
	ProviderCreateQuestionsScreen: {
		screen: createQuestionsScreen
	},

	//Takes you to the provider screen navigator's default route
	ProviderScreens: {
		screen: providerScreensNavigator,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//The route going to the screen for a specific request
	CustomerRequestScreen: {
		screen: customerRequestScreen
	},

	//The route going to the product screen
	ProviderProductScreen: {
		screen: ProviderProductScreen
	},

	//The route going to the product history screen
	ProviderProductHistoryScreen: {
		screen: ProviderProductHistoryScreen
	},

	//route leading to where businesses create their schedules
	ProviderCreateScheduleScreen: {
		screen: createScheduleScreen
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
