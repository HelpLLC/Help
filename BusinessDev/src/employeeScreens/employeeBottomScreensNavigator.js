//This navigator represents the bottom tab in which the provider will be able to navigate from
//screen to screen. The tabs will be "Dashboard", "Notifications", "Calendar", "Profile"
import { createAppContainer } from 'react-navigation';
import employeeDashboardScreen from './employeeBottomTabScreens/employeeDashboard/employeeDashboardScreen';
import notificationScreen from './employeeBottomTabScreens/employeeNotifications/employeeNotificationsScreen';
import calendarScreen from './employeeBottomTabScreens/employeeCalendar/employeeCalendarScreen';
import profileScreen from './employeeBottomTabScreens/employeeProfile/employeeProfileScreen';
import EmployeeRequestDisplay from './employeeScreens/employeeRequestDisplay/employeeRequestDisplay';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import strings from 'config/strings';

import { screenWidth, screenHeight } from 'config/dimensions';
import { Icon } from 'react-native-elements';
import React from 'react';
import colors from 'config/colors';

//will configure the routes of each screen title to go to the correct screen when clicked on.
const routeConfig = {
  //Route connecting to Dashboard Screen
  DashboardScreen: {
    //connects the object with the help screen component
    screen: employeeDashboardScreen,
    //sets up what the tab will be titled
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: strings.Dashboard,
      tabBarIcon: ({ tinColor, focused }) => (
        <Icon name='home' size={40} type='font-awesome' color={tinColor} />
      ),
    }),
  },

  //Route connecting to the Calendar Screen
  CalendarScreen: {
    //connects the object with the help screen component
    screen: calendarScreen,
    //sets up what the tab will be titled
    navigationOptions: ({navigation}) => ({
        tabBarIcon: ({tinColor, focused}) => (
            <Icon name='table' size={40} type='font-awesome' color={tinColor} />
        )
    })
  },

    //Route connecting to the Calendar Screen
    NotificationsScreen: {
        //connects the object with the help screen component
        screen: notificationScreen,
        //sets up what the tab will be titled
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({tinColor, focused}) => (
                <Icon name='bell' size={40} type='font-awesome' color={tinColor} />
            )
        })
      },

      //Route connecting to the Calendar Screen
    ProfileScreen: {
       //connects the object with the help screen component
       screen: profileScreen,
       //sets up what the tab will be titled
       navigationOptions: ({navigation}) => ({
           tabBarIcon: ({tinColor, focused}) => (
               <Icon name='user-circle' size={40} type='font-awesome' color={tinColor} />
           )
       })
     },

    //Route connecting to the Calendar Screen
    EmployeeRequestDisplay: {
      //connects the object with the help screen component
      screen: EmployeeRequestDisplay,
      //sets up what the tab will be titled
      navigationOptions: ({navigation}) => ({
          tabBarIcon: ({tinColor, focused}) => (
              <Icon name='user-circle' size={40} type='font-awesome' color={tinColor} />
          )
      })
    },
};

//This sets up the configurations for the tabNavigator colors, initial route, etc.
const navigatorConfig = {
	//This will be the default destination whenever this entire navigator is called
    initialRouteName: 'DashboardScreen',
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
			height: screenHeight * 0.1
		},
		showLabel: false,
		showIcon: true
	}
};

//This links the route configurations and the navigator configurations together to create
//a single tab navigator object
const bottomTabNavigator = createBottomTabNavigator(routeConfig, navigatorConfig);

//This creates and exports the final providerScreensNavigator
export default createAppContainer(bottomTabNavigator);
