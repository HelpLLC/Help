// This is the screen that will pop up when users first come to sign up for the app, it will
// ask for an email and a password and some other basic information
import React, { Component, useEffect, useState } from 'react';
import {
	View,
	Text,
	Dimensions,
	Keyboard,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import CheckBox from 'react-native-check-box';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import HelpButton from '../../../components/HelpButton/HelpButton';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from '../../../../config/FirebaseFunctions';
import TopBanner from '../../../components/TopBanner/TopBanner';
import { Icon } from 'react-native-elements';
import HelpAlert from '../../../components/HelpAlert';

//The class that will create the look of this screen
class emailPasswordScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen(
			'EmailPasswordScreen',
			'emailPasswordScreen'
		);
	}

	//The state which will contain whatever the user typed in, along with the selected account type
	//Only one account can be selected at a time.
	//The state will also include warning message that will display different messages to the user
	//if they have done something wrong, such as the username given already exists, or no buttons
	//were selected, etc.
	state = {
		email: '',
		password: '',
		confirmPassword: '',
		name: '',
		nameError: false,
		phoneNumber: '',
		fieldsError: false,
		emailError: false,
		passwordError: false,
		emailExistsError: false,
		isLoading: false,
		isErrorVisible: false,
		isChecked: false,
		termsAndConditionsError: false,
		isPasswordVisible: false,
	};

	//This method signs up the user & creates an account for them based on what they chose and their
	//username
	async signUp() {
		Keyboard.dismiss();
		//fetches the entered email and password
		let { email, password, buttonSelected, isChecked } = this.state;
		email = email.trim();
		password = password.trim();

		//If no username was entered, or all empty spaces, then an error message will pop up

		if (email.trim().length === 0 || password.trim().length === 0) {
			this.setState({ inputText: '', fieldsError: true });

			//If no button was selected a different error message would appear
		} else if (this.state.name.trim() === '') {
			this.setState({ nameError: true });
		} else if (!email.includes('@')) {
			this.setState({ emailError: true });
		} else if (password.length < 6) {
			this.setState({ passwordError: true });
		} else if (buttonSelected === '') {
			this.setState({ buttonError: true });
		} else if (isChecked === false) {
			this.setState({ termsAndConditionsError: true });
		} else {
			this.setState({ isLoading: true });
			//If the accout already exists, then an error will appear
			//If the account is new, then it will go through the normal process to create
			//the account
			try {
				const account = await FirebaseFunctions.logIn(email, password);
				if (account.includes('IS_ONLY_CUSTOMER')) {
					this.setState({ requesterAccountExists: true });
					throw new Error(
						'There is no user record corresponding to this identifier. The user may have been deleted.'
					);
				} else {
					this.setState({ emailExistsError: true });
					this.setState({ isLoading: false });
				}
			} catch (error) {
				if (
					error.message ===
					'There is no user record corresponding to this identifier. The user may have been deleted.'
				) {
					//If this is a new business account, then it will navigate to the create provider
					//profile screen to finish creating the account there
					this.setState({ isLoading: false });
					this.props.navigation.push('EmployeeVerification', {
						email,
						password,
						name: this.state.name,
						phoneNumber: this.state.phoneNumber,
						editing: false,
						requesterAccountExists:
							this.state.requesterAccountExists === true ? true : false,
					});
				} else {
					this.setState({ isLoading: false, isErrorVisible: true });
					FirebaseFunctions.call('logIssue', {
						error,
						userID: 'EmailPasswordScreen',
					});
				}
			}
		}
	}

	render() {
		return (
			//View that dismisses the keyboard when clicked anywhere else
			<HelpView style={screenStyle.container}>
				<View>
					<View style={{ marginTop: screenHeight * 0.03 }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.Email}
						</Text>
					</View>
					<View style={{ marginTop: screenHeight * 0.01 }}>
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.7}
							height={screenHeight * 0.06}
							placeholder={strings.EnterAnEmail}
							onChangeText={(input) => this.setState({ email: input })}
							value={this.state.email}
							password={false}
							autoCompleteType={'email'}
							keyboardType={'email-address'}
						/>
					</View>
				</View>
				<View>
					<View style={{ marginTop: screenHeight * 0.03 }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.Password}
						</Text>
					</View>
					<View style={{ marginTop: screenHeight * 0.02 }}>
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.7}
							height={screenHeight * 0.06}
							placeholder={strings.ChooseAPassword}
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
									}}
								>
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
				<View>
					<View style={{ marginTop: screenHeight * 0.03 }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.ConfirmPassword}
						</Text>
					</View>
					<View style={{ marginTop: screenHeight * 0.02 }}>
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.7}
							height={screenHeight * 0.06}
							placeholder={strings.ChooseAPassword}
							onChangeText={(input) =>
								this.setState({ confirmPassword: input })
							}
							value={this.state.confirmPassword}
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
									}}
								>
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
				<View>
					<View style={{ marginTop: screenHeight * 0.03 }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.Name}
						</Text>
					</View>
					<View style={{ marginTop: screenHeight * 0.02 }}>
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.7}
							height={screenHeight * 0.06}
							placeholder={strings.PleaseEnterName}
							onChangeText={(input) => this.setState({ name: input })}
							value={this.state.name}
							autoCompleteType={'name'}
						/>
					</View>
				</View>
				<View>
					<View style={{ marginTop: screenHeight * 0.03 }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.PhoneNumber}
						</Text>
					</View>
					<View style={{ marginTop: screenHeight * 0.02 }}>
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.7}
							height={screenHeight * 0.06}
							placeholder={strings.PleaseEnterPhoneNumber}
							onChangeText={(input) => this.setState({ phoneNumber: input })}
							value={this.state.PhoneNumber}
							autoCompleteType={'tel'}
						/>
					</View>
				</View>
				<View
					style={{
						marginVertical: screenHeight * 0.03,
						justifyContent: 'flex-start',
						alignItems: 'center',
						flexDirection: 'column',
					}}
				>
					<CheckBox
						onClick={() => {
							this.setState({ isChecked: !this.state.isChecked });
						}}
						isChecked={this.state.isChecked}
						checkedCheckBoxColor={colors.lightBlue}
						checkBoxColor={colors.lightBlue}
					/>
					<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>
						{strings.IAcceptThe}
					</Text>
					<TouchableOpacity
						onPress={() => {
							//Navigates to the Terms and Conditions screen
							this.props.navigation.push('TermsAndConditionsScreen');
						}}
					>
						<Text
							style={[
								fontStyles.mainTextStyle,
								fontStyles.blue,
								{ flexWrap: 'wrap' },
							]}
						>
							{strings.TermsAndConditions}
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						justifyContent: 'flex-end',
						alignSelf: 'center',
						marginLeft: screenWidth * 0.477,
						marginTop: screenHeight * 0.02,
					}}
				>
					<HelpButton
						title={strings.Next}
						isLoading={this.state.isLoading}
						width={screenWidth * 0.283}
						height={screenHeight * 0.0566}
						onPress={() => {
							this.signUp();
						}}
						disabled={this.state.isLoading}
					/>
				</View>
				<View style={{ height: screenHeight * 0.03 }} />
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
					isVisible={this.state.emailError}
					onPress={() => {
						this.setState({ emailError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseEnterAValidEmail}
				/>
				<HelpAlert
					isVisible={this.state.passwordError}
					onPress={() => {
						this.setState({ passwordError: false });
					}}
					title={strings.Whoops}
					message={strings.ShortPassword}
				/>
				<HelpAlert
					isVisible={this.state.emailExistsError}
					onPress={() => {
						this.setState({ emailExistsError: false });
					}}
					title={strings.Whoops}
					message={strings.EmailExists}
				/>
				<HelpAlert
					isVisible={this.state.termsAndConditionsError}
					onPress={() => {
						this.setState({ termsAndConditionsError: false });
					}}
					title={strings.Whoops}
					message={strings.CheckTermsAndConditions}
				/>
				<HelpAlert
					isVisible={this.state.nameError}
					onPress={() => {
						this.setState({ nameError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseEnterACompanyName}
				/>
			</HelpView>
		);
	}
}

//Exports the screen
export default emailPasswordScreen;
