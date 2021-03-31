//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import CreateServiceScreen from './sideBusinessScreens/createServiceScreen/createServiceScreen';
import NameDescriptionScreen from './firstScreens/signUp/BusinessSignUp/nameDescriptionScreen';
import AdditionalInformationScreen from './firstScreens/signUp/BusinessSignUp/additionalInformationScreen';
import EditServiceScreensNavigator from './bottomTabScreens/dashboardScreens/mainDashboardScreens/editService/editServiceScreensNavigator';
import ServiceScreen from './sideBusinessScreens/serviceScreen';
import LaunchScreen from './firstScreens/launchScreen';
import SplashScreen from './firstScreens/SplashScreen/SplashScreen';
import React from 'react';
import LogInScreen from './firstScreens/logIn/logInScreen';
import EmailPasswordScreen from './firstScreens/signUp/EmailPasswordScreen/EmailPasswordScreen';
import AccountNotVerifiedScreen from './firstScreens/logIn/accountNotVerifiedScreen';
import CustomerRequestScreen from './sideBusinessScreens/customerRequestScreen';
import BillCustomerScreen from './sideBusinessScreens/billCustomerScreen';
import ServiceHistoryScreen from './sideBusinessScreens/serviceHistoryScreen';
import ForgotPasswordScreen from './firstScreens/logIn/forgotPasswordScreen';
import { screenWidth, screenHeight } from 'config/dimensions';
import AboutScreen from './settingsScreens/aboutScreen';
import PrivacyScreen from './settingsScreens/privacyScreen';
import ReportIssueScreensNavigator from './settingsScreens/reportIssue/reportScreensNavigator';
import BusinessScreensNavigator from './bottomTabScreens/businessScreensNavigator';
import CreditsScreen from './settingsScreens/creditsScreen';
import ServiceCurrentRequestsScreen from './sideBusinessScreens/serviceCurrentRequestsScreen';
import CreateScheduleScreen from './firstScreens/signUp/BusinessSignUp/createScheduleScreen';
import ConfirmPaymentScreen from './sideBusinessScreens/confirmPaymentScreen/confirmPaymentScreen';
import { fadeIn, fromRight } from 'react-navigation-transitions';
import PricingAndPaymentScreen from './sideBusinessScreens/pricingAndPaymentScreen/pricingAndPaymentScreen';
import { createAppContainer } from 'react-navigation';
import TermsAndConditionsScreen from './settingsScreens/termsAndConditionsScreen';
import CreatePaymentMethodScreen from './sideBusinessScreens/createPaymentMethodScreen';
import { createStackNavigator } from 'react-navigation-stack';
import CustomerInfoScreen from './sideBusinessScreens/customerInfoScreen/customerInfoScreen';
import ViewPaymentMethodScreen from './sideBusinessScreens/viewPaymentMethodScreen';
import CompanyInfoScreen from './bottomTabScreens/profile/companyInfoScreen/companyInfoScreen';
import CompanyScheduleScreen from './bottomTabScreens/profile/companyScheduleScreen/companyScheduleScreen';
import ChangePasswordScreen from './bottomTabScreens/profile/changePasswordScreen/changePasswordScreen';
import TermsPrivacyCreditsScreen from './bottomTabScreens/profile/termsPrivacyCreditsScreen/termsPrivacyCreditsScreen';
import BussinessOrEmployeeScreen from './firstScreens/signUp//BusinessOrEmployee/BusinessOrEmployee';
import waitingForVerification from './firstScreens/signUp/EmployeeSignUp/waitingForVerification';
import EmployeeVerification from './firstScreens/signUp/EmployeeSignUp/employeeVerification';
import WorkerManagement from './bottomTabScreens/dashboardScreens/mainDashboardScreens/services/workerManagement/workerManagement';
import EmployeeScreensNavigator from './employeeScreens/employeeBottomScreensNavigator';
//import AlertsScreen from './sideBusinessScreens/alertsScreen/alertsScreen';
import { View } from 'react-native';
import TopBanner from './components/TopBanner/TopBanner';
import strings from 'config/strings';

//The route config for all of the screens
const routeConfig = {
	//--------------------------- First Screens ---------------------------

	//Takes you to the launch screen which is the blue logo
	LaunchScreen: {
		screen: LaunchScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false,
		}),
	},

	//Takes you to the splash screen of the app
	SplashScreen: {
		screen: SplashScreen,
		navigationOptions: ({ navigation }) => ({
			header: (props) => <View></View>,
			gesturesEnabled: false,
		}),
	},

	//Takes you to the log in screen of the app
	LogInScreen: {
		screen: LogInScreen,
		navigationOptions: ({ navigation }) => ({
			header: (props) => (
				<View>
					<TopBanner
						title={strings.LogIn}
						leftIconName='angle-left'
						size={30}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
			gesturesEnabled: false,
		}),
	},

	BussinessOrEmployeeScreen: {
		screen: BussinessOrEmployeeScreen,
		navigationOptions: ({ navigation }) => ({
			header: (props) => (
				<View>
					<TopBanner leftIconName='angle-left' size={30} leftOnPress={() => navigation.goBack()} />
				</View>
			),
			gesturesEnabled: false,
		}),
	},
	//Takes you to the sign up screen of the app
	EmailPasswordScreen: {
		screen: EmailPasswordScreen,
		navigationOptions: ({ navigation }) => ({
			header: (props) => (
				<View>
					<TopBanner
						title={strings.SignUp}
						leftIconName='angle-left'
						size={30}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
			gesturesEnabled: false,
		}),
	},


	//Takes you to the forgot password screen of the app
	ForgotPasswordScreen: {
		screen: ForgotPasswordScreen,
		navigationOptions: ({ navigation }) => ({
			header: (props) => (
				<View>
					<TopBanner
						title={strings.ForgotPasswordNoQuestionMark}
						leftIconName='angle-left'
						size={30}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
			gesturesEnabled: false,
		}),
	},
	EmployeeVerification: {
		screen: EmployeeVerification,
		navigationOptions: ({ navigation }) => ({
			header: (props) => (
				<View>
					<TopBanner leftIconName='angle-left' size={30} leftOnPress={() => navigation.goBack()} />
				</View>
			),
			gesturesEnabled: false,
		}),
	},

	//Takes you to the screen where businesses will create their initial profile
	NameDescriptionScreen: {
		screen: NameDescriptionScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false,
		}),
	},

	//Takes you to the screen which will allow businesses to add more information about themselves
	AdditionalInformationScreen: {
		screen: AdditionalInformationScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false,
		}),
	},

	//Takes you to the screen which will allow providers to add their schedule
	CreateScheduleScreen: {
		screen: CreateScheduleScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false,
		}),
	},

	//Takes you to the screen which will display if a business account has not yet been approved
	AccountNotVerifiedScreen: {
		screen: AccountNotVerifiedScreen,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false,
		}),
	},

	waitingForVerification: {
		screen: waitingForVerification,
		navigationOptions: ({ navigation }) => ({
			gesturesEnabled: false,
		}),
	},

	//--------------------------- Side Business Screens ---------------------------

	// TODO EDIT HOME
	//The provider screen's default route (The bottom tab navigator)
	BusinessScreens: {
		screen: BusinessScreensNavigator,
		navigationOptions: ({ navigation }) => ({
			header: (props) => (
				<View>
					<TopBanner
						title={"Home"}
						leftIconName='bell'
						size={27}
						leftOnPress={() => props.navigation.push('AlertsScreen', {})}
					/>
				</View>
			),
			gesturesEnabled: false,
		}),
		path: 'BusinessScreens/:businessID/:stripeConnectStatus',
	},

	// TODO EDIT PHOTOGRAPHY
	EditServiceSreens: {
		screen: EditServiceScreensNavigator,
		navigationOptions: ({ navigation }) => ({
			header: props => (
				<View>
					<TopBanner
						title={"Photography"} //props.navigation.params
						leftIconName='angle-left'
						size={30}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
			gesturesEnabled: false,
		}),
	},

	/*AlertsScreen: {
		screen: AlertsScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.Notifications}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},*/

	//The route going to the create product screen
	CreateServiceScreen: {
		screen: CreateServiceScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.AddNewService}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//This is where businesses will view their existing payment method
	ViewPaymentMethodScreen: {
		screen: ViewPaymentMethodScreen,
	},

	//This is where a business will go to add number of simultaneous requests
	WorkerManagement: {
		screen: WorkerManagement,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.WorkerManagement}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//This is the screen where a business will add the payment information for customers
	PricingAndPaymentScreen: {
		screen: PricingAndPaymentScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.PricingAndPayment}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//This is the screen where businesses will create questions to collect cuustomer info on request
	CustomerInfoScreen: {
		screen: CustomerInfoScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.CustomerInfo}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	CreatePaymentMethodScreen: {
		screen: CreatePaymentMethodScreen,
	},

	//Takes you to the screen where businesses see current requests for a specific service
	ServiceCurrentRequestsScreen: {
		screen: ServiceCurrentRequestsScreen,
	},

	//The route going to the screen for a specific request
	CustomerRequestScreen: {
		screen: CustomerRequestScreen,
	},

	//The route going to the bill customer screen
	BillCustomerScreen: {
		screen: BillCustomerScreen,
	},

	// The route going to the confirm payment screen
	ConfirmPaymentScreen: {
		screen: ConfirmPaymentScreen,
	},

	//The route going to the product screen
	ServiceScreen: {
		screen: ServiceScreen,
	},

	//The route going to the product history screen
	ServiceHistoryScreen: {
		screen: ServiceHistoryScreen,
	},

	//--------------------------- Settings Screen ---------------------------

	//Takes you to the company info screen
	CompanyInfoScreen: {
		screen: CompanyInfoScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.ProfileEditCompanyInfo}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//Takes you to the company schedule screen
	CompanyScheduleScreen: {
		screen: CompanyScheduleScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.ProfileBusinessSchedule}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//Takes you to the change password screen
	ChangePasswordScreen: {
		screen: ChangePasswordScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.ProfilePassword}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//Takes you to the terms/privacy/credits screen
	TermsPrivacyCreditsScreen: {
		screen: TermsPrivacyCreditsScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.TermsPrivacyCredits}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//Takes you to the about screen
	AboutScreen: {
		screen: AboutScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.About}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//Takes you to the report an issue screen
	ReportIssueScreen: {
		screen: ReportIssueScreensNavigator,
	},

	//Takes you to the screen containing the privacy policy
	PrivacyScreen: {
		screen: PrivacyScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.PrivacyPolicy}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//Takes you to the terms and conditions screen
	TermsAndConditionsScreen: {
		screen: TermsAndConditionsScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.TermsAndConditions}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

	//Takes you to the credits screen
	CreditsScreen: {
		screen: CreditsScreen,
		navigationOptions: ({ navigation }) => ({
			header: (
				<View>
					<TopBanner
						title={strings.Credits}
						leftIconName='arrow-left'
						size={25}
						leftOnPress={() => navigation.goBack()}
					/>
				</View>
			),
		}),
	},

  //--------------------------- Employee Screens ---------------------------
  //The provider screen's default route (The bottom tab navigator)
  EmployeeScreens: {
    screen: EmployeeScreensNavigator,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
    }),
  },
}



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
	headerMode: 'float',
	transitionConfig: (nav) => handleCustomTransition(nav),
};

//Creates & exports the stack navigator
const MainStackStackNavigator = createStackNavigator(
  routeConfig,
  navigatorConfig
);
const MainStackNavigator = createAppContainer(MainStackStackNavigator);
export default () => <MainStackNavigator uriPrefix={'helpbusiness://'} />;
