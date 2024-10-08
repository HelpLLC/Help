//This screen will be the initial screen that will display the company logo for a second while either
//the screen is loaded, or just for the logo to be displayed like normal apps for a quick second
import React, { Component } from 'react';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import { View, Text, Dimensions, Platform, Linking } from 'react-native';
import strings from 'config/strings';
import NetInfo from '@react-native-community/netinfo';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { screenWidth, screenHeight } from 'config/dimensions';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import HelpAlert from '../components/HelpAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import CodePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';

//Exports the class
export default class launchScreen extends Component {
  componentWillMount() {
    SplashScreen.hide();
  }
  //Tests the user's internet connection & then installs the most recent update from code push if there is one
  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen('LaunchScreen', 'launchScreen');
    await this.checkPermission();
    const isConnected = await NetInfo.fetch();
    if (isConnected.isConnected !== false && isConnected.isInternetReachable !== false) {
      //Checks for codePush update
      const update = await CodePush.checkForUpdate();
      if (update) {
        this.setState({
          isLoading: true
        });
        const status = await update.download();
        this.setState({
          willRestart: true,
          status
        });
        return;
      }
      const isUnderMaintenance = await FirebaseFunctions.call('isCustomerAppUnderMaintenance', {});
      if (isUnderMaintenance === true) {
        this.setState({ isUnderMaintenance });
        return;
      }
      await this.isUserLoggedIn();
    } else {
      this.setState({ internetConnection: false });
    }
  }

  //State controlling how the screen will behave
  state = {
    isErrorVisible: false,
    isUserLoggedIn: '',
    internetConnection: true,
    isLoading: false,
    willRestart: false,
    status: '',
    businessVersionMessageVisible: false,
    providerID: '',
    isUnderMaintenance: false
  };

  /*
   * The following are all methods for registering the user's device with notifications
   * services
   */
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      await this.getToken();
      return 0;
    } else {
      await this.requestPermission();
      return 0;
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        return 0;
      }
      return 0;
    }
    return 0;
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorized
      await this.getToken();
      return 0;
    } catch (error) {
      // User has rejected permissions
      return 0;
    }
  }

  //If no user is logged in, the function will return false. If there is one logged in, it will return the
  //right data to navigate to the correct screen
  async isUserLoggedIn() {
    try {
      let alreadyCalled = false;
      firebase.auth().onAuthStateChanged(async (user) => {
        if (alreadyCalled === false) {
          alreadyCalled = true;
          if (user) {
            const { uid } = user;
            //Starts with searching if this is a requester since that is more common
            const customer = await FirebaseFunctions.call('getCustomerByID', {
              customerID: uid
            });
            if (customer === -1) {
              const business = await FirebaseFunctions.call('getBusinessByID', { businessID: uid });
              if (business === -1) {
                this.setState({ isErrorVisible: true });
              } else {
                this.setState({
                  businessVersionMessageVisible: true,
                  businessID: business.businessID
                });
              }
              //This means that the logged in user is a provider from earlier versions, so a message
              //will display if they are a provider
            } else {
              const allServices = await FirebaseFunctions.call('getAllServices', {});
              //If this is a requester, then it will navigate to the screens & pass in the
              //correct params.
              this.props.navigation.push('FeaturedScreen', {
                customer,
                allServices
              });
            }
          } else {
            //Delays this for a third of a second so it doesn't seem instant and unnatural.
            this.setState({ isUserLoggedIn: false });
            //Navigates to the splash screen
            this.props.navigation.push('SplashScreen');
          }
        }
      });
    } catch (error) {
      this.setState({ isErrorVisible: true });
      FirebaseFunctions.call('logIssue', { error, userID: 'LaunchScreen' });
    }
    return 0;
  }

  render() {
    const { internetConnection, isErrorVisible } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.lightBlue,
          alignItems: 'center'
        }}>
        <View style={{ marginTop: screenHeight * 0.35 }}>
          <Text style={[fontStyles.bigTitleStyle, fontStyles.white]}>{strings.Help}</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: screenHeight * 0.2
          }}>
          <LoadingSpinner isVisible={true} color={colors.white} />
        </View>
        <HelpAlert
          isVisible={!internetConnection}
          onPress={() => {
            this.setState({
              isErrorVisible: false,
              isUserLoggedIn: '',
              internetConnection: true
            });
          }}
          title={strings.Whoops}
          message={strings.NoConnection}
        />
        <HelpAlert
          isVisible={isErrorVisible}
          onPress={() => {
            this.setState({ isErrorVisible: false });
          }}
          title={strings.Whoops}
          message={strings.SomethingWentWrong}
        />
        <HelpAlert
          isVisible={this.state.willRestart}
          closeOnTouchOutside={false}
          onPress={async () => {
            this.setState({ willRestart: false });
            await this.state.status.install();
            CodePush.restartApp();
          }}
          title={strings.Restart}
          message={strings.AppWillRestart}
        />
        <HelpAlert
          isVisible={false}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Linking.openURL('itms-apps://itunes.apple.com/app/apple-store/id1468626210?mt=8');
            } else if (Platform.OS === 'android') {
              Linking.openURL('market://details?id=com.Help.Help');
            }
          }}
          title={strings.UpdateAvailable}
          message={strings.UpdateAvailableMessage}
        />
        <HelpAlert
          isVisible={this.state.businessVersionMessageVisible}
          onPress={() => {
            firebase.auth().signOut();
            FirebaseFunctions.fcm.unsubscribeFromTopic('b-' + this.state.providerID);
            if (Platform.OS === 'ios') {
              //Links to the new business app for ios & logs this user out
              Linking.openURL('itms-apps://itunes.apple.com/app/apple-store/id1490767192?mt=8');
            } else if (Platform.OS === 'android') {
              //Links to the new business app for android & logs this user out
              Linking.openURL('market://details?id=com.Help.HelpBusiness');
            }
            this.setState({ businessVersionMessageVisible: false });
            this.props.navigation.push('SplashScreen');
          }}
          title={strings.NewBusinessApp}
          message={strings.NewBusinessAppMessage}
        />
        <HelpAlert
          isVisible={this.state.isUnderMaintenance}
          onPress={() => {
            CodePush.restartApp();
          }}
          title={strings.UnderMaintenance}
          message={strings.AppIsUnderMaintenance}
        />
      </View>
    );
  }
}
