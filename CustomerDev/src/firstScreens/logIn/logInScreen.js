//This screen will be the one where users can log into their accounts if they already have one
//created. Since there will be no payments or anything secure in the mvp, then users will only
//log in with their phone numbers. And that will be what is linked with their accoun
import React, { Component } from 'react';
import { View, Text, Keyboard, TouchableOpacity, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
 
import HelpButton from '../../components/HelpButton/HelpButton';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpAlert from '../../components/HelpAlert';
import { screenWidth, screenHeight } from 'config/dimensions';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';

//The class that will create the look of this screen
class logInScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('LogInScreen', 'logInScreen');
	}

	//This state will contain the current entered text, as well as the text underneeth the text
	//input that will appear if the entered phone number is incorrect
	state = {
		//The text being typed in by the user
		email: '',
		password: '',

		//The message which will display if the user types in a phone number which doesn't exist
		infoError: false,
		fieldsError: false,

		//This will determine whether the loading widget appears or not. Initially false
		isLoading: false,
		isErrorVisible: false,
		isPasswordVisible: false,
	};

	//This function will login based on the entered phone number... if the number is non existent,
	//Then the user will be instructed to go create an account or try again
	async logIn() {
		let { email, password } = this.state;
		email = email.trim();
		password = password.trim();
		Keyboard.dismiss();
		//If no username was entered, or all empty spaces, then an error message will pop up
		if (email.trim().length === 0 || password.trim().length === 0) {
			this.setState({ fieldsError: true });
		} else {
			//Turns on the loading indicator
			this.setState({ isLoading: true });
			try {
				//Uses the firebase functions method to log in, and based on the return, it determines if the
				//account belongs to a requester or not, and navigates to the correct screen
				const account = await FirebaseFunctions.logIn(email, password);
				if (account.includes('IS_ONLY_PROVIDER')) {
					FirebaseFunctions.logOut(account.split(' ')[1]);
					throw new Error(
						'There is no user record corresponding to this identifier. The user may have been deleted.'
					);
				}
				const allServices = await FirebaseFunctions.call('getAllServices', {});
				const customer = await FirebaseFunctions.call('getCustomerByID', {
					customerID: account.substring(2),
				});
				//If this is a requester, then it will navigate to the screens & pass in the
				//correct params
				this.setState({ isLoading: false });
				this.props.navigation.push('FeaturedScreen', {
					customer,
					allServices,
				});
			} catch (error) {
				if (
					error.message ===
						'The password is invalid or the user does not have a password.' ||
					error.message === 'The email address is badly formatted.' ||
					error.message ===
						'There is no user record corresponding to this identifier. The user may have been deleted.'
				) {
					this.setState({ infoError: true, isLoading: false });
				} else {
					this.setState({ isLoading: false, isErrorVisible: true });
					FirebaseFunctions.call('logIssue', {
						error,
						userID: {
							screen: 'LogInScreen',
							email,
						},
					});
				}
			}
		}
	}

	render() {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.LogIn}
					leftIconName='angle-left'
					leftOnPress={() => {
						//Method will go back to the splash screen
						this.props.navigation.goBack();
					}}
				/>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View style={{ flex: 1, justifyContent: 'flex-end' }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>{strings.Email}</Text>
					</View>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.6}
							height={screenHeight * 0.06}
							placeholder={strings.EnterYourEmail}
							onChangeText={(input) => this.setState({ email: input })}
							value={this.state.email}
							password={false}
							autoCompleteType={'email'}
							keyboardType={'email-address'}
						/>
					</View>
				</View>

				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View style={{ flex: 1, justifyContent: 'flex-end' }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>{strings.Password}</Text>
					</View>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.6}
							height={screenHeight * 0.06}
							placeholder={strings.EnterYourPassword}
							onChangeText={(input) => this.setState({ password: input })}
							value={this.state.password}
							additionalIcon={
								<TouchableOpacity
									onPress={() => {
										const { isPasswordVisible } = this.state;
										this.setState({
											isPasswordVisible: !isPasswordVisible,
										});
									}}
									style={{
										justifyContent: 'center',
										height: screenHeight * 0.06,
									}}>
									<Icon
										name={
											this.state.isPasswordVisible === true
												? 'eye'
												: 'eye-slash'
										}
										type='font-awesome'
										color={
											this.state.isPasswordVisible === true
												? colors.lightBlue
												: colors.gray
										}
									/>
								</TouchableOpacity>
							}
							password={!this.state.isPasswordVisible}
							autoCompleteType={'password'}
						/>
					</View>
				</View>
				<View style={{ flex: 0.5, justifyContent: 'center' }}>
					<TouchableOpacity
						onPress={() => {
							//Navigates to the Forgot Password screen
							this.props.navigation.push('ForgotPasswordScreen');
						}}>
						<Text style={[fontStyles.mainTextStyle, fontStyles.blue , { flexWrap: 'wrap' }]}>
							{strings.ForgotPassword}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
					<HelpButton
						title={strings.LogIn}
						width={screenWidth * 0.39}
						isLoading={this.state.isLoading}
						//Method logs the person in based on what is entered into the text
						//input
						onPress={() => {
							this.logIn();
						}}
						disabled={this.state.isLoading}
					/>
				</View>
				<HelpAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<HelpAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseFillOutAllFields}
				/>
				<HelpAlert
					isVisible={this.state.infoError}
					onPress={() => {
						this.setState({ infoError: false });
					}}
					title={strings.Whoops}
					message={strings.IncorrectInfo}
				/>
			</HelpView>
		);
	}
}

//exports the screen
export default logInScreen;
