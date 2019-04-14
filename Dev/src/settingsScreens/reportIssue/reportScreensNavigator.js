//This navigator will control the flow between the report issue screen and the screen which 
//confirms that the issue has been reported. It will include the transition as well as the initial
//route. 
import reportIssueScreen from './reportIssueScreen';
import issueReportedScreen from './issueReportedScreen';
import fadeOutTransition from 'config/transitions/fadeOutTransition';
import { createStackNavigator, createAppContainer } from 'react-navigation';

//This route config will define the routes for this navigator which will only be the 
//reportIssueScreen & the issueReportedScreen
const routeConfig = {
    //The route for the reportIssueScreen
    ReportIssueScreen: {
        screen: reportIssueScreen
    },

    //The route for the issueReportedScreen
    IssueReportedScreen: {
        screen: issueReportedScreen
    }
};

//The configuration for the navigator that controls all of the navigator's settings
//such as Initial Route
const navigatorConfig = {
    headerMode: 'none',
    //Makes the reportIssue screen defined above the default route when this navigator is accessed
    initialRouteName: 'ReportIssueScreen',
    //Makes the transition
    transitionConfig: fadeOutTransition
};
//Creates and exports the stack navigator
const reportScreensStackNavigator = createStackNavigator(routeConfig, navigatorConfig);
const reportScreensNavigator = createAppContainer(reportScreensStackNavigator);
export default reportScreensNavigator;