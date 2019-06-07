//This navigator represents the bottom tab in which the requester will be able to navigate from
//screen to screen. It will lead to the settings screen, request screen, and the chats screen.
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import chatsScreen from '../chats/chatsScreen';
import settingsScreens from '../settingsScreens/settingsScreen';
import requestScreen from './requesterRequest/requestScreen';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import colors from 'config/colors';

//will configure the routes of each screen title to go to the correct screen when clicked on.
const routeConfig = {

    //Route connecting to the chats screen
    ChatsScreen: {
        //connects the object with the chats screen component
        screen: chatsScreen,
        //sets up what the tab will be titled
        navigationOptions: {
            tabBarLabel: strings.Chats
        }
    },

    //Route connecting to the request screen
    RequestScreen: {
        //connects the object with the help screen component
        screen: requestScreen,
        //sets up what the tab will be titled
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: strings.Request,
        })
    },

    //Route connecting to the settings screen
    SettingsScreen: {
        //connects the object with the settings screen component
        screen: settingsScreens,
        //sets up what the tab will be titled
        navigationOptions: {
            tabBarLabel: strings.Settings
        }
    }

}

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const navigatorConfig = {
    //This will be the default destination whenever this entire navigator is called
    initialRouteName: 'RequestScreen',
    //Shows the header
    headerMode: 'float',
    //This makes swiping between tabs possible
    swipeEnabled: true,
    //This turns on the swiping animation
    animationEnabled: true,
    //Explicitly tells the tabBar to be positioned at the bottom of the screen
    tabBarPosition: 'bottom',
    //Styles and colors the tabBar
    tabBarOptions: {
        //Defines what color the label will be when is clicked or swiped to
        activeTintColor: colors.lightBlue,
        //Defines what color the label will be when it is not currently the screen that is being
        //viewed
        inactiveTintColor: colors.black,
        //This styles the tabBar itself; the color, height, etc.
        style: {
            backgroundColor: colors.white,
            height: 70,
            padding: 10,
        },
        //This styles the tabBarLabel
        labelStyle: fontStyles.tabLabelStyle
    }
}

//This links the route configurations and the navigator configurations together to create
//a single tab navigator object
const bottomTabNavigator = createMaterialTopTabNavigator(routeConfig, navigatorConfig);

//This creates and exports the final providerScreensNavigator
export default createAppContainer(bottomTabNavigator);
