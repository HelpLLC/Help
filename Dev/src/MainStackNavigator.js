//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import FirstScreensNavigator from './firstScreens/FirstScreensNavigator';
import ProviderCreateProductScreen from './providerScreens/providerBusiness/createProductScreen';
import ProviderEditCompanyProfileScreen from './providerScreens/providerBusiness/editCompanyProfileScreen';
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
import TopBanner from './components/TopBanner';
import React from 'react';
import strings from 'config/strings';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import termsAndConditionsScreen from './firstScreens/termsAndConditionsScreen';


//The route config for all of the screens
const routeConfig = {

    //The route leading to the first run screens
    FirstScreens: {
        screen: FirstScreensNavigator,
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

    //The route going to the create product screen
    ProviderCreateProductScreen: {
        screen: ProviderCreateProductScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.Service}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />
            ),
            gesturesEnabled: false,
        })
    },

    //The route going to the edit company profile screen
    ProviderEditCompanyProfileScreen: {
        screen: ProviderEditCompanyProfileScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.EditCompany}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />
            ),
            gesturesEnabled: false,
        })
    },

    //The route going to the product screen
    ProviderProductScreen: {
        screen: ProviderProductScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.Service}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.push("ProviderScreens", {
                        providerID: navigation.state.params.providerID
                    })} />
            ),
            gesturesEnabled: false,
        })
    },

    //The route going to the product history screen
    ProviderProductHistoryScreen: {
        screen: ProviderProductHistoryScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.ServiceHistory}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />)
        }),
        gesturesEnabled: false,
    },

    //The route going to the requester service screen
    RequesterServiceScreen: {
        screen: RequesterServiceScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.Service}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />)
        }),
        gesturesEnabled: false,
    },

    //The route going to the requester company profile screen
    RequesterCompanyProfileScreen: {
        screen: RequesterCompanyProfileScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.CompanyProfile}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />
            )
        }),
        gesturesEnabled: false,
    },

    //The route going the screen where users can chat
    MessagingScreen: {
        screen: MessagingScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={navigation.state.params.title}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />
            )
        }),
        gesturesEnabled: false,
    },

    //Route connecting to the chats screen
    ChatsScreen: {
        //connects the object with the chats screen component
        screen: chatsScreen,
        //sets up what the tab will be titled
        navigationOptions: ({ navigation }) => ({
            header: null,
        })
    },

    //Route connecting to the featured screen
    FeaturedScreen: {
        //connects the object with the help screen component
        screen: featuredScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                null
            )
        }),
    },

    //Route connecting to the settings screen
    SettingsScreen: {
        //connects the object with the settings screen component
        screen: settingsScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    //Takes you to the about screen
    AboutScreen: {
        screen: aboutScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.About}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />)
        }),
        gesturesEnabled: false,
    },

    //Takes you to the report an issue screen
    ReportIssueScreen: {
        screen: reportIssueScreensNavigator,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.ReportAnIssue}
                    leftIconName="angle-left"
                    leftOnPress={() => {
                        //Method will dismiss the current stack and then go back to 
                        //make sure the animation is to the left
                        navigation.dismiss();
                        navigation.goBack();
                    }} />
            ),
            gesturesEnabled: false,
        })
    },

    //Takes you to the screen containing the privacy policy
    PrivacyScreen: {
        screen: privacyScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.Privacy}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />
            ),
            gesturesEnabled: false,
        })
    },

    //Takes you to the terms and conditions screen
    TermsAndConditionsScreen: {
        screen: termsAndConditionsScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={strings.TermsAndConditions}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />
            ),
            gesturesEnabled: false
        })
    }

};

//The navigation config containing the initial route name
const navigatorConfig = {
    initialRouteName: 'FirstScreens'
};

//Creates & exports the stack navigator
const MainStackStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const MainStackNavigator = createAppContainer(MainStackStackNavigator);
export default MainStackNavigator;
