//This screen is the screen after you fill out basic info and choose customer and it creates the requester and signs you in

import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import { CachedImage } from 'react-native-img-cache';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpView from '../components/HelpView';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import screenStyle from '../../config/styles/screenStyle';
import GoogleCityPicker from '../components/GoogleCityPicker';
import ErrorAlert from '../components/ErrorAlert';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import OptionPicker from '../components/OptionPicker';
import { BoxShadow } from 'react-native-shadow';
import ImagePicker from '../components/ImagePicker';
import TopBanner from '../components/TopBanner';
import LeftMenu from '../requesterScreens/LeftMenu';
import SideMenu from 'react-native-side-menu';

class createRequesterProfileScreen extends Component {
	//If this screen is editing (editing an existing user), then it will fetch the user's profile picture and allow them to upload
	//another one
	async componentDidMount() {
		if (this.props.isEditing === true) {
			FirebaseFunctions.setCurrentScreen(
				'EditRequesterProfileScreen',
				'editRequesterProfileScreen'
			);
		} else {
			FirebaseFunctions.setCurrentScreen(
				'CreateRequesterProfileScreen',
				'createRequesterProfileScreen'
			);
		}

		if (this.props.navigation.state.params.isEditing === true) {
			const { requester } = this.props.navigation.state.params;
			const imageSource = await FirebaseFunctions.getProfilePictureByID(requester.requesterID);
			this.setState({
				name: requester.username,
				city: requester.city,
				coordinates: requester.coordinates,
				phoneNumber: requester.phoneNumber,
				requester: requester,
				isEditing: true,
				isScreenLoading: false,
				imageSource
			});
		} else {
			this.setState({
				isScreenLoading: false,
				isEditing: false
			});
		}
	}

	state = {
		email: '',
		password: '',
		phoneNumber: '',
		isScreenLoading: true,
		name: '',
		city: '',
		coordinates: '',
		imageSource: '',
		isLoading: false,
		invalidPhoneNumberError: false,
		fieldsError: false,
		locationInfoVisible: false,
		isEditing: null,
		requester: null,
		isOpen: false,
		isShowing: false
	};

	//This method will edit requester information in Firebase depending on whether this requester
	//exists or is a new one
	async addRequesterInfo() {
		Keyboard.dismiss();
		const { phoneNumber, name, city, coordinates } = this.state;
		//Tests for empty fields
		if (phoneNumber === '' || name === '' || city === '' || coordinates === '') {
			//Displays empty field error
			this.setState({ fieldsError: true });
		} else if (phoneNumber.trim().length != 10) {
			this.setState({ invalidPhoneNumberError: true });
		} else {
			this.setState({ isLoading: true });
			if (this.state.isEditing === true) {
				const { requester } = this.props.navigation.state.params;
				try {
					await FirebaseFunctions.updateRequesterByID(requester.requesterID, {
						username: name,
						phoneNumber: phoneNumber,
						city: city,
						coordinates: coordinates
          });
					//If the image has been updated, then it will update it in firebase
					if (this.state.response) {
						await FirebaseFunctions.uploadRequesterImage(
							requester.requesterID,
							this.state.response
						);
          }
					const allProducts = this.props.navigation.state.params.allProducts;
          const updatedRequeter = await FirebaseFunctions.getRequesterByID(requester.requesterID);
					this.props.navigation.push('FeaturedScreen', {
						requester: updatedRequeter,
						allProducts
          });
				} catch (error) {
					this.setState({ isLoading: false, isErrorVisible: true });
					FirebaseFunctions.logIssue(error, 'CreateRequesterProfileScreen');
				}
			} else {
				//If the account is new, then it will go through the normal process to create
				//the account
				try {
					//If this is a customer, then the account will be created here and
					//along with the new requester being added to the database then
					//the screen will shift to the new account's screen
					const { email, password } = this.props.navigation.state.params;
					const account = await firebase.auth().createUserWithEmailAndPassword(email, password);
					const requester = await FirebaseFunctions.addRequesterToDatabase(
						account,
						phoneNumber,
						coordinates,
						city,
						name
					);
					await FirebaseFunctions.logIn(email, password);
					const allProducts = await FirebaseFunctions.getAllProducts();
					this.setState({ isLoading: false });
					this.props.navigation.push('FeaturedScreen', {
						requester,
						allProducts
					});
				} catch (error) {
					this.setState({ isLoading: false, isErrorVisible: true });
					FirebaseFunctions.logIssue(error, 'CreateRequesterProfileScreen');
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
		//This is the main UI so that we only display the side menu if the requester exists and is
		//editing their information
		const mainUI = (
			<HelpView style={screenStyle.container}>
				{this.state.isEditing === true ? (
					<TopBanner
						leftIconName='navicon'
						leftOnPress={() => {
							FirebaseFunctions.analytics.logEvent('sidemenu_opened_from_home');
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
							width: Dimensions.get('window').width,
							marginTop: Dimensions.get('window').height * 0.02,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-evenly'
						}}>
						<TouchableOpacity
							onPress={() => {
								Keyboard.dismiss();
								this.chooseImage();
							}}
							style={{ justifyContent: 'center', alignItems: 'center' }}>
							<View
								style={{
									marginBottom: Dimensions.get('window').height * 0.02,
									justifyContent: 'flex-start'
								}}>
								<BoxShadow
									setting={{
										width: Dimensions.get('window').width * 0.25,
										height: Dimensions.get('window').width * 0.25,
										color: colors.gray,
										border: 10,
										radius: (Dimensions.get('window').width * 0.25) / 2,
										opacity: 0.2,
										x: 0,
										y: 5
									}}>
									<CachedImage
										source={this.state.imageSource}
										style={{
											width: Dimensions.get('window').width * 0.25,
											height: Dimensions.get('window').width * 0.25,
											borderColor: colors.lightBlue,
											borderWidth: (Dimensions.get('window').width * 0.25) / 17,
											borderRadius: (Dimensions.get('window').width * 0.25) / 2
										}}
									/>
								</BoxShadow>
							</View>
							<View style={{ justifyContent: 'flex-end' }}>
								<Text style={fontStyles.mainTextStyleBlue}>{strings.EditImage}</Text>
							</View>
						</TouchableOpacity>
						<View style={{ width: Dimensions.get('window').width * 0.1 }}></View>
						<View>
							<View
								style={{
									alignSelf: 'flex-start',
									justifyContent: 'flex-end',
									marginVertical: Dimensions.get('window').height * 0.02
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>{strings.Name}</Text>
							</View>

							<View style={{ justifyContent: 'center' }}>
								<OneLineRoundedBoxInput
									placeholder={strings.PleaseEnterName}
									onChangeText={(input) => this.setState({ name: input })}
									value={this.state.name}
									password={false}
									width={Dimensions.get('window').height * 0.2}
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
								marginVertical: Dimensions.get('window').height * 0.02
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Name}</Text>
						</View>

						<View style={{ justifyContent: 'center' }}>
							<OneLineRoundedBoxInput
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
						width: Dimensions.get('window').width * 0.6,
						alignSelf: 'center',
						marginVertical: Dimensions.get('window').height * 0.02
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.PhoneNumber}</Text>
				</View>

				<View style={{ justifyContent: 'center' }}>
					<OneLineRoundedBoxInput
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
						width: Dimensions.get('window').width * 0.6,
						alignSelf: 'center',
						marginVertical: Dimensions.get('window').height * 0.02
					}}>
					<TouchableOpacity
						onPress={() => {
							this.setState({ locationInfoVisible: true });
						}}
						style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={fontStyles.bigTextStyleBlack}>{strings.City}</Text>
						<View style={{ width: Dimensions.get('window').width * 0.01 }}></View>
						<Icon name={'info-circle'} type='font-awesome' size={25} color={colors.lightBlue} />
					</TouchableOpacity>
				</View>
				<View style={{ height: Dimensions.get('window').height * 0.35 }}>
					<GoogleCityPicker
						initialText={this.state.city}
						onPress={(locationName, long, lat) => {
							this.setState({
								city: locationName,
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
						title={this.state.requester ? strings.Done : strings.SignUp}
						style={roundBlueButtonStyle.MediumSizeButton}
						textStyle={fontStyles.bigTextStyleWhite}
						onPress={() => {
							this.addRequesterInfo();
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
				<ErrorAlert
					isVisible={this.state.invalidPhoneNumberError}
					onPress={() => {
						this.setState({ invalidPhoneNumberError: false });
					}}
					title={strings.Whoops}
					message={strings.InvalidPhoneNumberError}
				/>
				<OptionPicker
					isVisible={this.state.locationInfoVisible}
					title={strings.Location}
					oneOption={true}
					clickOutside={true}
					message={strings.WhyWeUseLocation}
					confirmText={strings.Ok}
					confirmOnPress={() => {
						this.setState({ locationInfoVisible: false });
					}}
				/>
				<ImagePicker
					imageHeight={256}
					imageWidth={256}
					onImageSelected={(response) => {
						this.setState({ isShowing: false });
						const source = { uri: 'data:image/jpeg;base64,' + response.data };
						if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
							//Sets the source of the image if one has been selected
							this.setState({
								imageSource: source,
								response
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
								allProducts={this.props.navigation.state.params.allProducts}
								requester={this.props.navigation.state.params.requester}
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

export default createRequesterProfileScreen;
