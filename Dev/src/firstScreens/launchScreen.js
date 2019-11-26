//This screen will be the initial screen that will display the company logo for a second while either
//the screen is loaded, or just for the logo to be displayed like normal apps for a quick second
import React, { Component } from 'react';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import { View, Text, Dimensions } from 'react-native';
import strings from 'config/strings';
import NetInfo from '@react-native-community/netinfo';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorAlert from '../components/ErrorAlert';
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
				await update.download();
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
		isLoading: false
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
						const requester = await FirebaseFunctions.getRequesterByID(uid);
						if (requester === -1) {
							//Tests if this account is verified or not. If the account is not verified, then it will
							//go to a screen displaying a message saying wait for verification. If they are, it will
							//navigate to the normal screens
							const provider = await FirebaseFunctions.getProviderByID(uid);
							if (provider.isVerified === true) {
								//This means this account is a provider since a requester with this ID was not found. Also waits
								//for code push to install update if necessary
								this.timeoutHandle = setTimeout(() => {
									this.props.navigation.push('ProviderScreens', {
										providerID: uid
									});
								}, 500);
							} else {
								//Navigates to the account not verified screen. Also waits for CodePush
								//to install update if necessary
								this.timeoutHandle = setTimeout(() => {
									this.props.navigation.push('AccountNotVerifiedScreen');
								}, 250);
							}
						} else {
							const allProducts = await FirebaseFunctions.getAllProducts();
							//If this is a requester, then it will navigate to the screens & pass in the
							//correct params. Also waits for CodePush to install update if necessary
							this.timeoutHandle = setTimeout(() => {
								this.props.navigation.push('FeaturedScreen', {
									requester: requester,
									allProducts
								});
							}, 250);
						}
					} else {
						//Delays this for a third of a second so it doesn't seem instant and unnatural. Also
						//wait for code push to install update if necessary
						this.timeoutHandle = setTimeout(() => {
							this.setState({ isUserLoggedIn: false });
							//Navigates to the splash screen
							this.props.navigation.push('SplashScreen');
						}, 250);
					}
				}
			});
		} catch (error) {
			this.setState({ isErrorVisible: true });
			FirebaseFunctions.logIssue(error, 'LaunchScreen');
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
				<View style={{ marginTop: Dimensions.get('window').height * 0.35 }}>
					<Text style={fontStyles.bigTitleStyleWhite}>{strings.Help}</Text>
				</View>
				{this.state.isLoading === true ? (
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: Dimensions.get('window').height * 0.2
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: Dimensions.get('window').height * 0.05
							}}>
							<Text style={fontStyles.bigTextStyleWhite}>{strings.LoadingAppDotDotDot}</Text>
						</View>
						<LoadingSpinner isVisible={true} color={colors.white} />
					</View>
				) : (
					<View></View>
				)}
				<ErrorAlert
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
				<ErrorAlert
					isVisible={isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
			</View>
		);
	}
}
