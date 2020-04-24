//This screen is the screen after you fill out basic info and choose customer and it creates the customer and signs you in

import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard, Platform } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
 
import FastImage from 'react-native-fast-image';
import HelpButton from '../../components/HelpButton/HelpButton';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import HelpView from '../../components/HelpView';
import { screenWidth, screenHeight } from 'config/dimensions';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import screenStyle from '../../../config/styles/screenStyle';
import GoogleCityPicker from '../../components/GoogleCityPicker';
import HelpAlert from '../../components/HelpAlert';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import { BoxShadow } from 'react-native-shadow';
import ImagePicker from '../../components/ImagePicker';
import TopBanner from '../../components/TopBanner/TopBanner';
import LeftMenu from '../../leftMenuScreens/LeftMenu';
import SideMenu from 'react-native-side-menu';

class additionalCustomerInfoScreen extends Component {
	//If this screen is editing (editing an existing user), then it will fetch the user's profile picture and allow them to upload
	//another one
	async componentDidMount() {
		if (this.props.isEditing === true) {
			FirebaseFunctions.setCurrentScreen(
				'editAdditionalCustomerInfoScreen',
				'additionalCustomerInfoScreen'
			);
		} else {
			FirebaseFunctions.setCurrentScreen(
				'AdditionalCustomerInfoScreen',
				'additionalCustomerInfoScreen'
			);
		}

		if (this.props.navigation.state.params.isEditing === true) {
			const { customer } = this.props.navigation.state.params;
			const imageSource = await FirebaseFunctions.call('getProfilePictureByID', {
				ID: customer.customerID,
			});
			this.setState({
				name: customer.name,
				address: customer.address,
				state: customer.state,
				country: customer.country,
				city: customer.city,
				coordinates: customer.coordinates,
				phoneNumber: customer.phoneNumber,
				customer: customer,
				isEditing: true,
				isScreenLoading: false,
				imageSource,
			});
		} else {
			this.setState({
				isScreenLoading: false,
				isEditing: false,
			});
		}
	}

	state = {
		email: '',
		password: '',
		phoneNumber: '',
		address: '',
		isScreenLoading: true,
		name: '',
		city: '',
		state: '',
		country: '',
		coordinates: '',
		imageSource: '',
		isLoading: false,
		invalidPhoneNumberError: false,
		fieldsError: false,
		locationInfoVisible: false,
		isEditing: null,
		customer: null,
		isOpen: false,
		isShowing: false,
		accountSaved: false,
		allProducts: '',
		updatedCustomer: '',
	};

	//This method will edit customer information in Firebase depending on whether this customer
	//exists or is a new one
	async addCustomerInfo() {
		Keyboard.dismiss();
		const { phoneNumber, name, city, coordinates, address, country, state } = this.state;
		//Tests for empty fields
		if (phoneNumber === '' || name === '' || city === '' || coordinates === '') {
			//Displays empty field error
			this.setState({ fieldsError: true });
		} else if (phoneNumber.trim().length != 10) {
			this.setState({ invalidPhoneNumberError: true });
		} else {
			this.setState({ isLoading: true });
			if (this.state.isEditing === true) {
				const { customer } = this.state;
				try {
					//Updates the customer's info in firebase
					await FirebaseFunctions.call('updateCustomerInformation', {
						address,
						coordinates,
						customerID: customer.customerID,
						city,
						address,
						state,
						country,
						name,
						phoneNumber,
						currentRequests: customer.currentRequests,
					});

					//If the image has been updated, then it will update it in firebase
					if (this.state.response) {
						//Fetches the absolute path of the image (depending on android or ios)
						let absolutePath = '';
						if (Platform.OS === 'android') {
							absolutePath = 'file://' + this.state.response.path;
						} else {
							absolutePath = this.state.response.path;
						}
						//Creates the reference & uploads the image (async)
						await FirebaseFunctions.storage
							.ref('profilePictures/' + customer.customerID)
							.putFile(absolutePath);
					}
					const allServices = this.props.navigation.state.params.allServices;
					const updatedCustomer = await FirebaseFunctions.call('getCustomerByID', {
						customerID: customer.customerID,
					});
					this.setState({
						accountSaved: true,
						updatedCustomer,
						allServices,
						isLoading: false,
					});
				} catch (error) {
					this.setState({ isLoading: false, isErrorVisible: true });
					FirebaseFunctions.call('logIssue', {
						error,
						userID: 'EditAdditionalCustomerInfoScreen',
					});
				}
			} else {
				//If the account is new, then it will go through the normal process to create
				//the account
				try {
					//If this is a customer, then the account will be created here and
					//along with the new customer being added to the database then
					//the screen will shift to the new account's screen
					const {
						email,
						password,
						hasBusinessAccount,
					} = this.props.navigation.state.params;
					let userID = '';
					if (hasBusinessAccount === true) {
						//If a provider account already exists with this email, it doesn't add it twice into Firebase
						//authentication
						userID = await FirebaseFunctions.logIn(email, password);
						userID = userID.split(' ')[1];
						userID = userID.substring(2);
					} else {
						userID = await firebase
							.auth()
							.createUserWithEmailAndPassword(email, password);
						userID = userID.user.uid;
						await FirebaseFunctions.logIn(email, password);
					}
					await FirebaseFunctions.call('addCustomerToDatabase', {
						address,
						city,
						state,
						country,
						paymentInformation: '',
						blockedBusinesses: [],
						coordinates,
						currentRequests: [],
						customerID: userID,
						email,
						name,
						phoneNumber,
						isReviewDue: [],
					});
					const customer = await FirebaseFunctions.call('getCustomerByID', {
						customerID: userID,
					});
					const allServices = await FirebaseFunctions.call('getAllServices', {});
					this.setState({ isLoading: false });
					this.props.navigation.push('FeaturedScreen', {
						customer,
						allServices,
					});
				} catch (error) {
					this.setState({ isLoading: false, isErrorVisible: true });
					FirebaseFunctions.call('logIssue', {
						error,
						userID: 'AdditionalCustomerInfoScreen',
					});
				}
			}
		}
	}

	chooseImage() {
		Keyboard.dismiss();
		//Shows the ImagePicker
		this.setState({ isShowing: true });
	}

	render() {
		//This is the main UI so that we only display the side menu if the customer exists and is
		//editing their information
		const mainUI = (
			<HelpView style={screenStyle.container}>
				{this.state.isEditing === true ? (
					<TopBanner
						leftIconName='navicon'
						leftOnPress={() => {
							FirebaseFunctions.analytics.logEvent(
								'sidemenu_opened_from_create_customer_profile'
							);
							this.setState({ isOpen: true });
						}}
						size={30}
						title={strings.MyProfile}
					/>
				) : (
					<TopBanner
						title={strings.CreateProfile}
						leftIconName='angle-left'
						leftOnPress={() => {
							//Method will go back to the splash screen
							this.props.navigation.goBack();
						}}
					/>
				)}
				{this.state.isEditing === true ? (
					<View
						style={{
							width: screenWidth,
							marginTop: screenHeight * 0.02,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-evenly',
						}}>
						<TouchableOpacity
							onPress={() => {
								Keyboard.dismiss();
								this.chooseImage();
							}}
							style={{ justifyContent: 'center', alignItems: 'center' }}>
							<View
								style={{
									marginBottom: screenHeight * 0.02,
									justifyContent: 'flex-start',
								}}>
								<BoxShadow
									setting={{
										width: screenWidth * 0.25,
										height: screenWidth * 0.25,
										color: colors.gray,
										border: 10,
										radius: (screenWidth * 0.25) / 2,
										opacity: 0.2,
										x: 0,
										y: 5,
									}}>
									<FastImage
										source={this.state.imageSource}
										style={{
											width: screenWidth * 0.25,
											height: screenWidth * 0.25,
											borderColor: colors.lightBlue,
											borderWidth: (screenWidth * 0.25) / 17,
											borderRadius: (screenWidth * 0.25) / 2,
										}}
									/>
								</BoxShadow>
							</View>
							<View style={{ justifyContent: 'flex-end' }}>
								<Text style={fontStyles.mainTextStyleBlue}>
									{strings.EditImage}
								</Text>
							</View>
						</TouchableOpacity>
						<View style={{ width: screenWidth * 0.1 }}></View>
						<View>
							<View
								style={{
									alignSelf: 'flex-start',
									justifyContent: 'flex-end',
									marginVertical: screenHeight * 0.02,
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>{strings.Name}</Text>
							</View>

							<View style={{ justifyContent: 'center' }}>
								<HelpTextInput
									isMultiline={false}
									height={screenHeight * 0.06}
									placeholder={strings.PleaseEnterName}
									onChangeText={(input) => this.setState({ name: input })}
									value={this.state.name}
									password={false}
									width={screenHeight * 0.2}
									maxLength={20}
								/>
							</View>
						</View>
					</View>
				) : (
					<View>
						<View
							style={{
								alignSelf: 'flex-start',
								justifyContent: 'flex-end',
								marginVertical: screenHeight * 0.02,
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Name}</Text>
						</View>

						<View style={{ justifyContent: 'center' }}>
							<HelpTextInput
								isMultiline={false}
								width={screenWidth * 0.6}
								height={screenHeight * 0.06}
								placeholder={strings.PleaseEnterName}
								onChangeText={(input) => this.setState({ name: input })}
								value={this.state.name}
								password={false}
								maxLength={20}
							/>
						</View>
					</View>
				)}
				<View
					style={{
						justifyContent: 'flex-end',
						alignItems: 'flex-start',
						width: screenWidth * 0.6,
						alignSelf: 'center',
						marginVertical: screenHeight * 0.02,
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.PhoneNumber}</Text>
				</View>

				<View style={{ justifyContent: 'center' }}>
					<HelpTextInput
						isMultiline={false}
						width={screenWidth * 0.6}
						height={screenHeight * 0.06}
						placeholder={strings.EnterPhoneNumber}
						onChangeText={(input) => {
							this.setState({ phoneNumber: input.replace(/[^0-9]/g, '') });
						}}
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
						alignItems: 'flex-start',
						width: screenWidth * 0.8,
						alignSelf: 'center',
						marginVertical: screenHeight * 0.02,
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.StreetAddress}</Text>
				</View>
				<View
					style={{
						height:
							this.state.isEditing === true
								? screenHeight * 0.25
								: screenHeight * 0.275,
					}}>
					<GoogleCityPicker
						initialText={this.state.address}
						returnType={'address'}
						onPress={(address, city, state, country, lat, lng) => {
							this.setState({
								address,
								state,
								country,
								city,
								coordinates: { lng, lat },
							});
						}}
					/>
				</View>
				<View
					style={{
						height: screenHeight * 0.1,
						justifyContent: 'flex-end',
						alignSelf: 'center',
					}}>
					<HelpButton
						isLoading={this.state.isLoading}
						title={this.state.customer ? strings.Done : strings.SignUp}
						width={screenWidth * 0.39}
						onPress={() => {
							this.addCustomerInfo();
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
					isVisible={this.state.invalidPhoneNumberError}
					onPress={() => {
						this.setState({ invalidPhoneNumberError: false });
					}}
					title={strings.Whoops}
					message={strings.InvalidPhoneNumberError}
				/>
				<HelpAlert
					isVisible={this.state.accountSaved}
					onPress={() => {
						this.setState({ accountSaved: false });
						this.props.navigation.push('FeaturedScreen', {
							customer: this.state.updatedCustomer,
							allServices: this.state.allServices,
						});
					}}
					title={strings.Success}
					message={strings.AccountSaved}
				/>
				<HelpAlert
					isVisible={this.state.locationInfoVisible}
					closeOnTouchOutside={false}
					onPress={() => {
						this.setState({ locationInfoVisible: false });
					}}
					title={strings.Location}
					message={strings.WhyWeUseLocation}
				/>
				<ImagePicker
					imageHeight={256}
					imageWidth={256}
					onImageCanceled={() => {
						this.setState({ isShowing: false });
					}}
					onImageSelected={(response) => {
						this.setState({ isShowing: false });
						const source = { uri: 'data:image/jpeg;base64,' + response.data };
						if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
							//Sets the source of the image if one has been selected
							this.setState({
								imageSource: source,
								response,
							});
						}
						this.setState({ isShowing: false });
					}}
					isShowing={this.state.isShowing}
				/>
			</HelpView>
		);

		if (this.state.isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner title={strings.MyProfile} />
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		return (
			<View style={{ flex: 1 }}>
				{this.state.isEditing === true ? (
					<SideMenu
						onChange={(isOpen) => {
							this.setState({ isOpen });
						}}
						isOpen={this.state.isOpen}
						menu={
							<LeftMenu
								navigation={this.props.navigation}
								allServices={this.props.navigation.state.params.allServices}
								customer={this.props.navigation.state.params.customer}
							/>
						}>
						{mainUI}
					</SideMenu>
				) : (
					mainUI
				)}
			</View>
		);
	}
}

export default additionalCustomerInfoScreen;
