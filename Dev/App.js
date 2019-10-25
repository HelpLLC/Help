//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingSpinner from './src/components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import HelpView from './src/components/HelpView';
import firebase from 'react-native-firebase';
import FirebaseFunctions from './config/FirebaseFunctions';

//Launches the app with the persisted store
export default class App extends Component {
	state = {
		isLoading: true
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

	//2
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

	async createNotificationListeners() {
		/*
		 * Triggered when a particular notification has been received in foreground
		 * */
		this.notificationListener = firebase.notifications().onNotification((notification) => {});

		/*
		 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		 * */
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {});

		/*
		 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		 * */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
		}
		/*
		 * Triggered for data only payload in foreground
		 * */
		this.messageListener = firebase.messaging().onMessage((message) => {});
	}

	async componentWillUnmount() {
		await this.notificationListener();
		await this.notificationOpenedListener();
	}

	async componentDidMount() {
		await this.checkPermission();
		await this.createNotificationListeners();
		this.setState({ isLoading: false });
	}

	render() {
		//Ignores a specific warning
		YellowBox.ignoreWarnings(['ViewPagerAndroid', 'componentWillMount', 'componentWillReceiveProps']);
		if (this.state.isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={this.state.isLoading} />
					</View>
				</HelpView>
			);
		}
		return <MainStackNavigator />;
	}
}
