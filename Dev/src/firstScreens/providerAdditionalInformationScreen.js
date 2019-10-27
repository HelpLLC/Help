//This will be the screen in which businesses will be able to provide addtional information about their business such as a location,
//phone number, and an optional website. It will fetch the business name and description from the previosu screen and create
//the actual business in this screen
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import strings from 'config/strings';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import { Text, View, Dimensions, Keyboard } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import fontStyles from 'config/styles/fontStyles';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import GoogleCityPicker from '../components/GoogleCityPicker';
import ErrorAlert from '../components/ErrorAlert';

export default class providerAdditionalInformationScreen extends Component {
	//Function sets the name of the current screen
	componentDidMount() {
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
		fieldsError: false
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
		if (this.state.isLoading === true) {
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
					<Text style={fontStyles.bigTextStyleBlack}>{strings.LocationYouServe}</Text>
				</View>
				<View style={{ height: Dimensions.get('window').height * 0.35 }}>
					<GoogleCityPicker
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
						title={strings.SignUp}
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
			</HelpView>
		);
	}
}
