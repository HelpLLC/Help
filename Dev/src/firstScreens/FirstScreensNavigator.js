//This class creates the navigation for the first run screens, which will all be stack navigators
//Stack navigator means the screens push left when you go to next screen
import { createStackNavigator, createAppContainer } from 'react-navigation';
import splashScreen from './splashScreen';
import providerScreensNavigator from '../providerScreens/providerScreensNavigator';
import featuredScreen from '../requesterScreens/featuredScreen';
import accountNotVerifiedScreen from './accountNotVerifiedScreen';
import logInScreen from './logInScreen';
import forgotPasswordScreen from './forgotPasswordScreen';
import createProviderProfileScreen from './createProviderProfileScreen';
import signUpScreen from './signUpScreen';
import createRequesterProfileScreen from './createRequesterProfileScreen';
import providerAdditionalInformationScreen from './providerAdditionalInformationScreen';
import launchScreen from './launchScreen';
import { fadeIn, fromRight } from 'react-navigation-transitions';

//Route config that leads to all the different possible screens
const routeConfig = {

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
	//Takes you to the provider screen navigator's default route
	ProviderScreens: {
		screen: providerScreensNavigator,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},
	//Takes you to the requester screen navigator's default route
	RequesterScreens: {
		screen: featuredScreen,
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
	}
};

//Makes the zoom in transition for the initial LaunchScreen that opens
const handleCustomTransition = ({ scenes }) => {
	const prevScene = scenes[scenes.length - 2];

	if (
		prevScene &&
		prevScene.route.routeName === 'LaunchScreen'
	) {
		return fadeIn(1000);
	} else {
		return fromRight()
	}
};

//Makes it so there is no header in all the navigator's screens
const navigatorConfig = {
	headerMode: 'none',
	initialRouteName: 'LaunchScreen',
	transitionConfig: (nav) => handleCustomTransition(nav)
};

//Creates & exports the stack navigator
const FirstScreensStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const FirstScreensNavigator = createAppContainer(FirstScreensStackNavigator);
export default FirstScreensNavigator;
