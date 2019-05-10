//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import FirstScreensNavigator from './firstScreens/FirstScreensNavigator';
import ProviderCreateProductScreen from './providerScreens/providerBusiness/createProductScreen';
import ProviderEditCompanyProfileScreen from './providerScreens/providerBusiness/editCompanyProfileScreen';
import ProviderProductScreen from './providerScreens/providerBusiness/productScreen';
import ProviderEditProductScreen from './providerScreens/providerBusiness/editProductScreen';
import ProviderProductHistoryScreen from './providerScreens/providerBusiness/productHistoryScreen';
import RequesterServiceScreen from './requesterScreens/requesterRequest/serviceScreen';
import RequesterCompanyProfileScreen from './requesterScreens/requesterRequest/companyProfileScreen';
import ChatScreen from './chatScreen';
import TopBanner from './components/TopBanner';
import React from 'react';
import Functions from 'config/Functions';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import providerScreensNavigator from './providerScreens/providerScreensNavigator';

//The route config for all of the screens
const routeConfig = {

    //The route leading to the first run screens
    FirstScreens: {
        screen: FirstScreensNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going to the create product screen
    ProviderCreateProductScreen: {
        screen: ProviderCreateProductScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going to the edit company profile screen
    ProviderEditCompanyProfileScreen: {
        screen: ProviderEditCompanyProfileScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going to the product screen
    ProviderProductScreen: {
        screen: ProviderProductScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going to the edit product screen
    ProviderEditProductScreen: {
        screen: ProviderEditProductScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going to the product history screen
    ProviderProductHistoryScreen: {
        screen: ProviderProductHistoryScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going to the requester service screen
    RequesterServiceScreen: {
        screen: RequesterServiceScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going to the requester company profile screen
    RequesterCompanyProfileScreen: {
        screen: RequesterCompanyProfileScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    //The route going the screen where users can chat
    ChatsScreen: {
        screen: ChatScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    title={navigation.state.params.provider.companyName}
                    leftIconName="angle-left"
                    leftOnPress={() => navigation.goBack()} />
            )
        })
    }

};

//The navigation config containing the initial route name
const navigatorConfig = {
    //To-do: Make sure if device has already been logged in, to navigate to the account directly
    initialRouteName: 'FirstScreens',
    gesturesEnabled: false
};

//Creates & exports the stack navigator
const MainStackStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const MainStackNavigator = createAppContainer(MainStackStackNavigator);
export default MainStackNavigator;
