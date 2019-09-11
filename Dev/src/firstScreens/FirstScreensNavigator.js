//This class creates the navigation for the first run screens, which will all be stack navigators
//Stack navigator means the screens push left when you go to next screen
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import splashScreen from './splashScreen';
import providerScreensNavigator from '../providerScreens/providerScreensNavigator';
import requesterScreensNavigator from '../requesterScreens/requesterScreensNavigator';
import accountNotVerifiedScreen from './accountNotVerifiedScreen';
import logInScreen from './logInScreen';
import forgotPasswordScreen from './forgotPasswordScreen';
import createProviderProfileScreen from './createProviderProfileScreen';
import signUpScreen from './signUpScreen';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';
import FirebaseFunctions from '../../config/FirebaseFunctions';

//Route config that leads to all the different possible screens
const routeConfig = {
    //Takes you to the splash screen of the app
    SplashScreen: {
        screen: splashScreen,
        navigationOptions: ({ navigation }) => ({
            header: null,
            gesturesEnabled: false,
        })
    },
    //Takes you to the provider screen navigator's default route
    ProviderScreens: {
        screen: providerScreensNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null,
            gesturesEnabled: false,
        })
    },
    //Takes you to the requester screen navigator's default route
    RequesterScreens: {
        screen: requesterScreensNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null,
            gesturesEnabled: false,
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
            ),
            gesturesEnabled: false,
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
            ),
            gesturesEnabled: false,
        })
    },
    //Takes you to the forgot password screen of the app
    ForgotPasswordScreen: {
        screen: forgotPasswordScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.ForgotPassword}
                    leftIconName="angle-left"
                    leftOnPress={() => {
                        //Method will go back to the splash screen
                        navigation.goBack();
                    }} />
            ),
            gesturesEnabled: false,
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
            ),
            gesturesEnabled: false,
        })
    },
    //Takes you to the screen which will display if a business account has not yet been approved
    AccountNotVerifiedScreen: {
        screen: accountNotVerifiedScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.Verification}
                    leftIconName="angle-left"
                    leftOnPress={async () => {
                        //Method will go back to the splash screen and log out
                        await FirebaseFunctions.logOut();
                        navigation.push('SplashScreen');
                    }} />
            ),
            gesturesEnabled: false,
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