//This class creates the navigation for the first run screens, which will all be stack navigators
//Stack navigator means the screens push left when you go to next screen
import { createStackNavigator, createAppContainer } from 'react-navigation';
import splashScreen from './splashScreen';
import providerScreensNavigator from '../providerScreens/providerScreensNavigator';
import requesterScreensNavigator from '../requesterScreens/requesterScreensNavigator';
import logInScreen from './logInScreen';
import createProviderProfileScreen from './createProviderProfileScreen';
import signUpScreen from './signUpScreen';

//Route config that leads to all the different possible screens
const routeConfig = {
    //Takes you to the splash screen of the app
    SplashScreen: {
        screen: splashScreen
    }, 
    //Takes you to the provider screen navigator's default route
    ProviderScreens: {
        screen: providerScreensNavigator
    },
    //Takes you to the requester screen navigator's default route
    RequesterScreens: {
        screen: requesterScreensNavigator
    },
    //Takes you to the log in screen of the app
    LogInScreen: {
        screen: logInScreen
    },
    //Takes you to the sign up screen of the app
    SignUpScreen: {
        screen: signUpScreen
    },
    //Takes you to the screen where businesses will create their initial profile
    CreateProviderProfileScreen: {
        screen: createProviderProfileScreen
    }
};

//Makes it so there is no header in all the navigator's screens
const navigatorConfig = {
    initialRouteName: 'SplashScreen',
    headerMode: 'none',
};

//Creates & exports the stack navigator
const FirstScreensStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const FirstScreensNavigator = createAppContainer(FirstScreensStackNavigator);
export default FirstScreensNavigator;