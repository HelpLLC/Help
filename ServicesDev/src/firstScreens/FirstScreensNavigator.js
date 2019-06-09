//This class creates the navigation for the first run screens, which will all be stack navigators
//Stack navigator means the screens push left when you go to next screen
import { createStackNavigator, createAppContainer } from 'react-navigation';
import splashScreen from './splashScreen';
import providerScreensNavigator from '../providerScreens/providerScreensNavigator';
import requesterScreensNavigator from '../requesterScreens/requesterScreensNavigator';
import logInScreen from './logInScreen';
import createProviderProfileScreen from './createProviderProfileScreen';
import signUpScreen from './signUpScreen';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';

//Route config that leads to all the different possible screens
const routeConfig = {
    //Takes you to the splash screen of the app
    SplashScreen: {
        screen: splashScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    //Takes you to the provider screen navigator's default route
    ProviderScreens: {
        screen: providerScreensNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    //Takes you to the requester screen navigator's default route
    RequesterScreens: {
        screen: requesterScreensNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    //Takes you to the log in screen of the app
    LogInScreen: {
        screen: logInScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.LogIn}
                    leftIconName="angle-left"
                    leftOnPress={() => {
                        //Method will go back to the splash screen
                        navigation.goBack();
                    }} />
            )
        })
    },
    //Takes you to the sign up screen of the app
    SignUpScreen: {
        screen: signUpScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.SignUp}
                    leftIconName="angle-left"
                    leftOnPress={() => {
                        //Method will go back to the splash screen
                        navigation.goBack();
                    }} />
            )
        })
    },
    //Takes you to the screen where businesses will create their initial profile
    CreateProviderProfileScreen: {
        screen: createProviderProfileScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.CreateProfile}
                    leftIconName="angle-left"
                    leftOnPress={() => {
                        //Method will go back to the splash screen
                        navigation.goBack();
                    }} />
            )
        })
    }
};

//Makes it so there is no header in all the navigator's screens
const navigatorConfig = {
    initialRouteName: 'SplashScreen',
};

//Creates & exports the stack navigator
const FirstScreensStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const FirstScreensNavigator = createAppContainer(FirstScreensStackNavigator);
export default FirstScreensNavigator;