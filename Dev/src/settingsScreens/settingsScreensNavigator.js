//This navigator will be a stack navigator that will control the navigation of the settings
//screens. It will lead to the screens based on the selected option from the initial settings
//screen.
import settingsScreen from './settingsScreen';
import aboutScreen from './aboutScreen';
import reportIssueScreensNavigator from './reportIssue/reportScreensNavigator';
import { createStackNavigator, createAppContainer } from 'react-navigation';

//This will be the route config that goes to all the different screens
const routeConfig = {
    //Takes you to the settings screen (Initial route)
    SettingsScreen: {
        screen: settingsScreen
    },
    //Takes you to the about screen
    AboutScreen: {
        screen: aboutScreen
    },
    //Takes you to the report an issue screen
    ReportIssueScreen: {
        screen: reportIssueScreensNavigator
    },
};

//Navigation configurations that set the default routes and other configs
const navigatorConfig = {
    headerMode: 'none',
    //Makes the settings screen defined above the default route when this navigator is accessed
    initialRouteName: 'SettingsScreen',
};

//Creates and exports the stack navigator
const settingsScreensStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const settingsScreensNavigator = createAppContainer(settingsScreensStackNavigator);
export default settingsScreensNavigator;