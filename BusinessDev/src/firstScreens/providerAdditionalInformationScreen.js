//This will be the screen in which businesses will be able to provide addtional information about their business such as a location,
//phone number, and an optional website. It will fetch the business name and description from the previosu screen and create
//the actual business in this screen
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import strings from 'config/strings';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import {
	Text,
	View,
	Dimensions,
	Keyboard,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import fontStyles from 'config/styles/fontStyles';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import GoogleCityPicker from '../components/GoogleCityPicker';
import HelpAlert from '../components/HelpAlert';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import TopBanner from '../components/TopBanner';

export default class providerAdditionalInformationScreen extends Component {
	//Function sets the name of the current screen & sets the correct state based on whether this is a screen to create a new provider
	//or edit an existing one
	componentDidMount() {
		const { editing } = this.props.navigation.state.params;
		if (editing === true) {
			FirebaseFunctions.setCurrentScreen(
				'EditProviderAdditionalInformationScreen',
				'providerAdditionalInformationScreen'
			);
			const { provider, providerID } = this.props.navigation.state.params;
			this.setState({
				phoneNumber: provider.phoneNumber ? provider.phoneNumber : '',
				website: provider.website ? provider.website : '',
				location: provider.location ? provider.location : '',
				coordinates: provider.coordinates ? provider.coordinates : '',
				isLoadingScreen: false,
				editing,
				provider,
				providerID
			});
		} else {
			FirebaseFunctions.setCurrentScreen(
				'ProviderAdditionalInformationScreen',
				'providerAdditionalInformationScreen'
			);
			this.setState({
				isLoadingScreen: false,
				editing
			});
		}
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
		locationInfoVisible: false,
		accountSaved: false
	};

	//This function takes all of the information that has been collected for the business and registers them  into the database
	//while also making sure all required fields have been adequetly filled out. That is if this is the non-editing version of the
	//screen. If this is an existing business editing their information, then it will overwrite their existing information in the data
	//base.
	async addProviderInfo() {
		Keyboard.dismiss();

		if (this.state.location === '' || this.state.phoneNumber === '') {
			this.setState({ fieldsError: true });
		} else {
			this.setState({ isLoading: true });
			try {
				const {
					businessName,
					businessInfo,
					email,
					requesterAccountExists
				} = this.props.navigation.state.params;
				const { phoneNumber, website, location, coordinates } = this.state;

				//If this is a new profile, then it will add them to Firebase Authentication in addition to adding them to the database
				if (this.state.editing === false) {
					firebase.auth().signInAnonymously();
					const { password } = this.props.navigation.state.params;

					let account = '';
					if (requesterAccountExists === false) {
						account = await firebase.auth().createUserWithEmailAndPassword(email, password);
						await FirebaseFunctions.logIn(email, password);
					} else {
						account = await FirebaseFunctions.logIn(email, password);
						account = account.split(' ');
						account = account[1];
					}
					//Creates the base provider object
					const provider = {
						companyName: businessName,
						companyDescription: businessInfo,
						email,
						isVerified: false,
						serviceIDs: [],
						phoneNumber,
						website,
						location,
						coordinates,
						providerID: account.user ? account.user.uid : account.substring(2)
					};
					await FirebaseFunctions.addProviderToDatabase(provider);
					//Navigates to the screen where it tells the business to wait until their account has been verified
					this.props.navigation.push('AccountNotVerifiedScreen');
				} else {
					//Creates the base provider object
					const provider = {
						companyName: businessName,
						companyDescription: businessInfo,
						phoneNumber,
						website,
						location,
						coordinates
					};
					await FirebaseFunctions.updateProviderInfo(this.state.providerID, provider);
					this.setState({ isLoading: false, accountSaved: true });
				}
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
					<TopBanner
						title={
							this.props.navigation.state.params.editing === true
								? strings.EditCompany
								: strings.CreateProfile
						}
						leftIconName='angle-left'
						leftOnPress={() => {
							//Method will go back to the splash screen
							this.props.navigation.goBack();
						}}
					/>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={screenStyle.container}>
					<TopBanner
						title={this.state.editing === true ? strings.EditCompany : strings.CreateProfile}
						leftIconName='angle-left'
						leftOnPress={() => {
							//Method will go back to the splash screen
							this.props.navigation.goBack();
						}}
					/>
					<View
						style={{
							alignSelf: 'flex-start',
							justifyContent: 'flex-end',
							marginVertical: Dimensions.get('window').height * 0.02,
							marginLeft: Dimensions.get('window').width * 0.2
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
							marginVertical: Dimensions.get('window').height * 0.02,
							marginLeft: Dimensions.get('window').width * 0.2
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
							marginVertical: Dimensions.get('window').height * 0.02,
							marginLeft: Dimensions.get('window').width * 0.2
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
							initialText={this.state.location !== '' ? this.state.location : ''}
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
							isLoading={this.state.isLoading}
							onPress={() => {
								this.addProviderInfo();
							}}
							disabled={this.state.isLoading}
						/>
					</View>
					<HelpAlert
						isVisible={this.state.fieldsError}
						onPress={() => {
							this.setState({ fieldsError: false });
						}}
						title={strings.Whoops}
						message={strings.PleaseFillOutAllFields}
					/>
					<HelpAlert
						isVisible={this.state.accountSaved}
						onPress={() => {
							this.setState({ accountSaved: false });

							this.props.navigation.push('ProviderScreens', {
								providerID: this.state.providerID
							});
						}}
						title={strings.Success}
						message={strings.AccountSaved}
					/>
					<HelpAlert
						isVisible={this.state.locationInfoVisible}
						onPress={() => {
							this.setState({ locationInfoVisible: false });
						}}
						title={strings.Location}
						message={strings.WhyWeUseLocation}
					/>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}
