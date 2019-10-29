//This screen is the screen after you fill out basic info and choose customer and it creates the requester and signs you in

import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard, Image } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
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
import images from 'config/images/images';
import ImagePicker from 'react-native-image-picker';


class createRequesterProfileScreen extends Component {

	componentDidMount() {
		FirebaseFunctions.setCurrentScreen(
			'CreateRequesterProfileScreen',
			'createRequesterProfileScreen'
		);


		if (this.props.navigation.state.params && this.props.navigation.state.params.requester) {

			const { requester } = this.props.navigation.state.params;

			this.setState({
				name: requester.username,
				city: requester.city,
				coordinates: requester.coordinates,
				phoneNumber: requester.phoneNumber,
				requester: requester
			})

			
		}
	}

	state = {
		email: '',
		password: '',
		phoneNumber: '',
		name: '',
		city: '',
		coordinates: '',
		imageSource: images.DefaultProfilePic,
		isLoading: false,
		invalidPhoneNumberError: false,
		fieldsError: false,
		locationInfoVisible: false,
		requester: null
	};

	async signUp() {
		Keyboard.dismiss();
		if (this.state.requester) {
			const { phoneNumber, name, city, coordinates, imageSource } = this.state;
			const { requester } = this.props.navigation.state.params;

			if (phoneNumber === '' || name === '' || city === '' || coordinates === '') {
				//Displays empty field error
				this.setState({ fieldsError: true });
			} else if (phoneNumber.trim().length != 10) {
				this.setState({ invalidPhoneNumberError: true });
			} else {
				this.setState({ isLoading: true })
				try {
					await FirebaseFunctions.updateRequesterByID(requester.requesterID, {
						username: name,
						phoneNumber: phoneNumber,
						city: city,
						coordinates: coordinates
					})
					await FirebaseFunctions.uploadRequesterImage(requester.requesterID, imageSource)
					const allProducts = this.props.navigation.state.params.allProducts;
					this.props.navigation.push('FeaturedScreen', {
						requester,
						allProducts
					})
				} catch (error) {
					this.setState({ isLoading: false, isErrorVisible: true });
					FirebaseFunctions.logIssue(error, 'SignUpScreen');
				}
			}
		}
		else {
			//f{etches the entered email and password
			const { email, password } = this.props.navigation.state.params;
			const { phoneNumber, name, city, coordinates } = this.state;
			//Tests for empty fields
			if (phoneNumber === '' || name === '' || city === '' || coordinates === '') {
				//Displays empty field error
				this.setState({ fieldsError: true });
			} else if (phoneNumber.trim().length != 10) {
				this.setState({ invalidPhoneNumberError: true });
			} else {
				this.setState({ isLoading: true });
				//If the accout already exists, then an error will appear
				//If the account is new, then it will go through the normal process to create
				//the account
				try {
					//If this is a customer, then the account will be created here and
					//along with the new requester being added to the database then
					//the screen will shift to the new account's screen
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
					FirebaseFunctions.logIssue(error, 'SignUpScreen');
				}
			}
		}
	}

	chooseImage() {
		Keyboard.dismiss();
		//Shows the image picker with the default options
		ImagePicker.showImagePicker(
			{
				maxHeight: 200,
				maxWidth: 180
			},
			(response) => {
				const source = { uri: 'data:image/jpeg;base64,' + response.data };
				if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
					//Sets the source of the image if one has been selected
					this.setState({
						imageSource: source,
						response
					});
				}
			}
		);
	}

	render() {
		return (
			<HelpView style={screenStyle.container}>
				<View
					style={{
						width: Dimensions.get('window').width - 40,
						marginTop: Dimensions.get('window').height *.01
					}}>


					<View style={{ flexDirection: 'column', alignItems: 'center' }}>
						<TouchableOpacity
							onPress={() => {
								Keyboard.dismiss();
								this.chooseImage();
							}}
							style={{ justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ justifyContent: 'flex-start' }}>
								{this.state.serviceID ? (
									<ImageWithBorder
										width={Dimensions.get('window').width * 0.25}
										height={Dimensions.get('window').width * 0.25}
										imageFunction={async () => {
											//Passes in the function to retrieve the image of this product
											return await FirebaseFunctions.getRequesterImageByID(this.props.navigation.state.params.requester.requesterID);
										}}
									/>
								) : (
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
											<Image
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
									)}
							</View>
							<Text> </Text>
							<View style={{ justifyContent: 'flex-end' }}>
								<Text style={fontStyles.mainTextStyleBlue}>{strings.EditImage}</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View
					style={{
						alignSelf: 'flex-start',
						justifyContent: 'flex-end',
						marginVertical: Dimensions.get('window').height * 0.02
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.Name}</Text>
				</View>

				<View style={{ justifyContent: 'center', }}>
					<OneLineRoundedBoxInput
						placeholder={strings.PleaseEnterName}
						onChangeText={(input) => this.setState({ name: input })}
						value={this.state.name}
						password={false}
						maxLength={20}
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
						value={this.props.navigation.state.params.requester.phoneNumber}
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
						<Text style={fontStyles.bigTextStyleBlack}>{strings.City}</Text>
						<View style={{ width: Dimensions.get('window').width * 0.01 }}></View>
						<Icon name={'info-circle'} type='font-awesome' size={25} color={colors.lightBlue} />
					</TouchableOpacity>
				</View>
				<View style={{ height: Dimensions.get('window').height * 0.35 }}>
					<GoogleCityPicker
						initialText={this.props.navigation.state.params.requester.city}
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
						height: Dimensions.get('window').height *.001,
						justifyContent: 'flex-end',
						alignSelf: 'center',
						marginBottom: Dimensions.get('window').height * 1
					}}>
					<RoundBlueButton
						title={this.state.requester ? strings.Done : strings.SignUp}
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

export default createRequesterProfileScreen;
