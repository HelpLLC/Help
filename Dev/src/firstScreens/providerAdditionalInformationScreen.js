//This will be the screen in which businesses will be able to provide addtional information about their business such as a location,
//phone number, and an optional website. It will fetch the business name and description from the previosu screen and create
//the actual business in this screen
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import strings from 'config/strings';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import { Text, View, Dimensions, Keyboard, TouchableOpacity } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import fontStyles from 'config/styles/fontStyles';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import GoogleCityPicker from '../components/GoogleCityPicker';
import ErrorAlert from '../components/ErrorAlert';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import OptionPicker from '../components/OptionPicker';

export default class providerAdditionalInformationScreen extends Component {
	//Function sets the name of the current screen & sets the correct state based on whether this is a screen to create a new provider
	//or edit an existing one
	componentDidMount() {
		const { editing } = this.props.navigation.state.params;
		if (editing === true) {
			const { provider, providerID } = this.props.navigation.state.params;
			this.setState({
				phoneNumber: provider.phoneNumber ? provider.phoneNumber : "",
				website: provider.website ? provider.website : "",
				location: provider.location ? provider.location : "",
				coordinates: provider.coordinates ? provider.coordinates : "",
				isLoadingScreen: false,
				editing,
				provider,
				providerID
			})
		} else {
			this.setState({
				isLoadingScreen: false,
				editing
			})
		}
		FirebaseFunctions.setCurrentScreen(
			'ProviderAdditionalInformationScreen',
			'providerAdditionalInformationScreen'
		);
	}

	//The state which will control the value of the text inputs and the locations
	state = {
		phoneNumber: '',
		website: '',
		location: '',
		coordinates: '',
		isLoading: false,
		isLoadingScreen: true,
		fieldsError: false,
		locationInfoVisible: false
	};

	//This function takes all of the information that has been collected for the business and registers them  into the database
	//while also making sure all required fields have been adequetly filled out
	async signUp() {
		Keyboard.dismiss();

		if (this.state.location === '' || this.state.phoneNumber === '') {
			this.setState({ fieldsError: true });
		} else {
			this.setState({ isLoading: true });
			try {
				firebase.auth().signInAnonymously();
				//Creates the account and then navigates to the correct screens while passing in
				//the correct params and logs in
				const { email, password, businessName, businessInfo } = this.props.navigation.state.params;
				const { phoneNumber, website, location, coordinates } = this.state;
				const account = await firebase.auth().createUserWithEmailAndPassword(email, password);
				//Creates the object of the new provider
				const newProvider = {
					companyName: businessName,
					companyDescription: businessInfo,
					providerID: account.user.uid,
					serviceIDs: [],
					isVerified: false,
					phoneNumber,
					website,
					location,
					coordinates
				};
				await FirebaseFunctions.addProviderToDatabase(account, newProvider);
				await FirebaseFunctions.logIn(email, password);
				//Navigates to the screen where it tells the business to wait until their account has been verified
				this.props.navigation.push('AccountNotVerifiedScreen');
			} catch (error) {
				this.setState({ isLoading: false, isErrorVisible: true });
				FirebaseFunctions.logIssue(error, 'ProviderAdditionalInformationScreen');
			}
		}
	}

	//This function renders the screen
	render() {
		if (this.state.isLoadingScreen === true) {
			return (
				<HelpView style={screenStyle.container}>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		return (
			<HelpView style={screenStyle.container}>
				<View
					style={{
						alignSelf: 'flex-start',
						justifyContent: 'flex-end',
						marginVertical: Dimensions.get('window').height * 0.02
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.Website}</Text>
				</View>

				<View style={{ justifyContent: 'center' }}>
					<OneLineRoundedBoxInput
						placeholder={strings.EnterWebsiteLink}
						onChangeText={(input) => this.setState({ website: input })}
						value={this.state.website}
						password={false}
						autoCapitalize={'none'}
					/>
				</View>
				<View
					style={{
						alignSelf: 'flex-start',
						justifyContent: 'flex-end',
						marginVertical: Dimensions.get('window').height * 0.02
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.PhoneNumber}</Text>
				</View>

				<View style={{ justifyContent: 'center' }}>
					<OneLineRoundedBoxInput
						placeholder={strings.EnterPhoneNumber}
						onChangeText={(input) => this.setState({ phoneNumber: input.replace(/[^0-9]/g, '') })}
						value={this.state.phoneNumber}
						password={false}
						keyboardType='numeric'
						autoCompleteType={'tel'}
						maxLength={10}
					/>
				</View>
				<View
					style={{
						justifyContent: 'flex-end',
						alignSelf: 'flex-start',
						marginVertical: Dimensions.get('window').height * 0.02
					}}>
					<TouchableOpacity
						onPress={() => {
							this.setState({ locationInfoVisible: true });
						}}
						style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={fontStyles.bigTextStyleBlack}>{strings.LocationYouServe}</Text>
						<View style={{ width: Dimensions.get('window').width * 0.01 }}></View>
						<Icon name={'info-circle'} type='font-awesome' size={25} color={colors.lightBlue} />
					</TouchableOpacity>
				</View>
				<View style={{ height: Dimensions.get('window').height * 0.35 }}>
					<GoogleCityPicker
						initialText={this.state.location !== "" ? this.state.location : ""}
						placeholderText={strings.EnterLocation}
						onPress={(locationName, long, lat) => {
							this.setState({
								location: locationName,
								coordinates: { long, lat }
							});
						}}
					/>
				</View>
				<View
					style={{
						height: Dimensions.get('window').height * 0.1,
						justifyContent: 'flex-end',
						alignSelf: 'center'
					}}>
					<RoundBlueButton
						title={this.state.editing === true ? strings.Done : strings.SignUp}
						style={roundBlueButtonStyle.MediumSizeButton}
						textStyle={fontStyles.bigTextStyleWhite}
						onPress={() => {
							this.signUp();
						}}
						disabled={this.state.isLoading}
					/>
				</View>
				<View style={{ height: Dimensions.get('window').height * 0.04, alignItems: 'center' }}>
					<LoadingSpinner isVisible={this.state.isLoading} />
				</View>
				<ErrorAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseFillOutAllFields}
				/>
				<OptionPicker
					isVisible={this.state.locationInfoVisible}
					title={strings.Location}
					oneOption={true}
					message={strings.WhyWeUseLocation}
					confirmText={strings.Ok}
					confirmOnPress={() => {
						this.setState({ locationInfoVisible: false });
					}}
				/>
			</HelpView>
		);
	}
}
