//This will be the screen in which businesses will be able to provide addtional information about their business such as a location,
//phone number, and an optional website. It will fetch the business name and description from the previosu screen and create
//the actual business in this screen
import React, { Component } from 'react';
import HelpView from '../../components/HelpView';
import OneLineRoundedBoxInput from '../../components/OneLineRoundedBoxInput';
import strings from 'config/strings';
import LoadingSpinner from '../../components/LoadingSpinner';
import { screenWidth, screenHeight } from 'config/dimensions';
import screenStyle from 'config/styles/screenStyle';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import fontStyles from 'config/styles/fontStyles';
import helpButtonStyles from 'config/styles/helpButtonStyles';
import HelpButton from '../../components/HelpButton';
import GoogleCityPicker from '../../components/GoogleCityPicker';
import HelpAlert from '../../components/HelpAlert';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import TopBanner from '../../components/TopBanner/TopBanner';

export default class additionalInformationScreen extends Component {
	//Function sets the name of the current screen & sets the correct state based on whether this is a screen to create a new business
	//or edit an existing one
	componentDidMount() {
		const { editing } = this.props.navigation.state.params;
		if (editing === true) {
			FirebaseFunctions.setCurrentScreen(
				'EditAdditionalInformationScreen',
				'additionalInformationScreen'
			);
			const { business, businessID } = this.props.navigation.state.params;
			this.setState({
				phoneNumber: business.phoneNumber,
				website: business.website ? business.website : '',
				location: business.location,
				coordinates: business.coordinates,
				isLoadingScreen: false,
				editing,
				business,
				businessID
			});
		} else {
			FirebaseFunctions.setCurrentScreen(
				'CreateAdditionalInformationScreen',
				'additionalInformationScreen'
			);
			this.setState({
				isLoadingScreen: false,
				editing
			});
		}
	}

	//Function checks that all of the fields have been filled out and goes to the next screen
	goToNextScreen() {
		const {
			businessName,
			businessInfo,
			email,
			requesterAccountExists,
			password,
			editing,
			business,
			businessID
		} = this.props.navigation.state.params;
		const { phoneNumber, website, location, coordinates } = this.state;
		if (phoneNumber !== '' && location !== '' && coordinates !== '') {
			this.props.navigation.push('CreateScheduleScreen', {
				businessName,
				businessInfo,
				email,
				password,
				requesterAccountExists,
				phoneNumber,
				website,
				location,
				coordinates,
				editing,
				business,
				businessID
			});
		} else {
			this.setState({
				fieldsError: true
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
							marginVertical: screenHeight * 0.02,
							marginLeft: screenWidth * 0.2
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
							marginVertical: screenHeight * 0.02,
							marginLeft: screenWidth * 0.2
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
							marginVertical: screenHeight * 0.02,
							marginLeft: screenWidth * 0.2
						}}>
						<TouchableOpacity
							onPress={() => {
								this.setState({ locationInfoVisible: true });
							}}
							style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.LocationYouServe}</Text>
							<View style={{ width: screenWidth * 0.01 }}></View>
							<Icon name={'info-circle'} type='font-awesome' size={25} color={colors.lightBlue} />
						</TouchableOpacity>
					</View>
					<View style={{ height: screenHeight * 0.35 }}>
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
							height: screenHeight * 0.1,
							justifyContent: 'flex-end',
							alignSelf: 'center'
						}}>
						<HelpButton
							title={strings.Next}
							style={helpButtonStyles.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							isLoading={this.state.isLoading}
							onPress={() => {
								//Function goes to the next screen
								this.goToNextScreen();
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
