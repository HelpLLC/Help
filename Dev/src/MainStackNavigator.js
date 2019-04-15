//This stack navigator will contain all of the screens & navigators that will be accessed with the
//default slide right transition
import FirstScreensNavigator from './firstScreens/FirstScreensNavigator';
import ProviderCreateProductScreen from './providerScreens/providerBusiness/createProductScreen';
import ProviderEditCompanyProfileScreen from './providerScreens/providerBusiness/editCompanyProfileScreen';
import ProviderProductScreen from './providerScreens/providerBusiness/productScreen';
import ProviderEditProductScreen from './providerScreens/providerBusiness/editProductScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';

//The route config for all of the screens
const routeConfig = {

    //The route leading to the first run screens
    FirstScreens: {
        screen: FirstScreensNavigator
    },

    //The route going to the create product screen
    ProviderCreateProductScreen: {
        screen: ProviderCreateProductScreen
    },

    //The route going to the edit company profile screen
    ProviderEditCompanyProfileScreen: {
        screen: ProviderEditCompanyProfileScreen
    },

    //The route going to the product screen
    ProviderProductScreen: {
        screen: ProviderProductScreen
    },

    //The route going to the edit product screen
    ProviderEditProductScreen: {
        screen: ProviderEditProductScreen
    }

};

//The navigation config containing the initial route name
const navigatorConfig = {
    //To-do: Make sure if device has already been logged in, to navigate to the account directly
    initialRouteName: 'FirstScreens',
    headerMode: 'none',
};

//Creates & exports the stack navigator
const MainStackStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const MainStackNavigator = createAppContainer(MainStackStackNavigator);
export default MainStackNavigator;
