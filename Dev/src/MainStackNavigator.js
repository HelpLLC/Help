//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import FirstScreensNavigator from './firstScreens/FirstScreensNavigator';
import ProviderCreateProductScreen from './providerScreens/providerBusiness/createProductScreen';
import ProviderEditCompanyProfileScreen from './firstScreens/createProviderProfileScreen';
import ProviderAddtionalCompanyInfoScreen from './firstScreens/providerAdditionalInformationScreen';
import ProviderProductScreen from './providerScreens/providerBusiness/productScreen';
import ProviderProductHistoryScreen from './providerScreens/providerBusiness/productHistoryScreen';
import RequesterServiceScreen from './requesterScreens/serviceScreen';
import RequesterCompanyProfileScreen from './requesterScreens/companyProfileScreen';
import MessagingScreen from './chats/messagingScreen';
import aboutScreen from './settingsScreens/aboutScreen';
import privacyScreen from './settingsScreens/privacyScreen';
import reportIssueScreensNavigator from './settingsScreens/reportIssue/reportScreensNavigator';
import chatsScreen from './chats/chatsScreen';
import settingsScreen from './settingsScreens/settingsScreen';
import providerScreensNavigator from './providerScreens/providerScreensNavigator';
import featuredScreen from './requesterScreens/featuredScreen';
import RequesterOrderHistoryScreen from './requesterScreens/orderHistoryScreen';
import { fadeIn, fromRight } from 'react-navigation-transitions';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import termsAndConditionsScreen from './firstScreens/termsAndConditionsScreen';
import creditsScreen from './settingsScreens/creditsScreen';
import RequesterCategoriesScreen from './requesterScreens/categoriesScreen';
import categoryScreen from './requesterScreens/categoryScreen';
import createRequesterProfileScreen from './firstScreens/createRequesterProfileScreen';

//The route config for all of the screens
const routeConfig = {
	//The route leading to the first run screens
	FirstScreens: {
		screen: FirstScreensNavigator,
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

	//The route going to the create product screen
	ProviderCreateProductScreen: {
		screen: ProviderCreateProductScreen
	},

	//The route going to the edit company profile screen
	ProviderEditCompanyProfileScreen: {
		screen: ProviderEditCompanyProfileScreen
	},

	//Takes you to the screen which will allow providers to add more information about themselves
	ProviderAdditionalInformationScreen: {
		screen: ProviderAddtionalCompanyInfoScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

	//The route going to the product screen
	ProviderProductScreen: {
		screen: ProviderProductScreen
	},

	//The route going to the product history screen
	ProviderProductHistoryScreen: {
		screen: ProviderProductHistoryScreen
	},

	//The route going to the requester service screen
	RequesterServiceScreen: {
		screen: RequesterServiceScreen
	},

	RequesterCategoriesScreen: {
		screen: RequesterCategoriesScreen
	},
	CategoryScreen: {
		screen: categoryScreen
	},

	//The route going to the requester company profile screen
	RequesterCompanyProfileScreen: {
		screen: RequesterCompanyProfileScreen
	},

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

	//Route connecting to the featured screen
	FeaturedScreen: {
		//connects the object with the help screen component
		screen: featuredScreen,
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
	EditRequesterProfileScreen: {
		screen: createRequesterProfileScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false
		})
	},

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

	CreditsScreen: {
		screen: creditsScreen
	}
};

//Makes the zoom in transition for the initial LaunchScreen that opens
const handleCustomTransition = ({ scenes }) => {
	const prevScene = scenes[scenes.length - 2];

	if (
		prevScene &&
		prevScene.route.routeName === 'FirstScreens' &&
		prevScene.route.routes &&
		prevScene.route.routes[0].routeName === 'LaunchScreen'
	) {
		return fadeIn(700);
	} else {
		return fromRight();
	}
};
//The navigation config containing the initial route name
const navigatorConfig = {
	initialRouteName: 'FirstScreens',
	headerMode: 'none',
	transitionConfig: (nav) => handleCustomTransition(nav)
};

//Creates & exports the stack navigator
const MainStackStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const MainStackNavigator = createAppContainer(MainStackStackNavigator);
export default MainStackNavigator;
