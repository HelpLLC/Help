//This is the screen where the business will enter all the required information to create a Stripe Custom Connect Account
import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Linking,
	Keyboard,
	TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HelpButton from '../components/HelpButton/HelpButton';
import screenStyle from 'config/styles/screenStyle';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import TopBanner from '../components/TopBanner/TopBanner';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';

import HelpView from '../components/HelpView';
import HelpAlert from '../components/HelpAlert';
import NetInfo from '@react-native-community/netinfo';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpTextInput from '../components/HelpTextInput/HelpTextInput';
import CheckBox from 'react-native-check-box';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { screenHeight, screenWidth } from 'config/dimensions';
import stripe from 'tipsi-stripe';
stripe.setOptions({
	publishableKey: 'pk_test_RP4GxbKwMWbM3NN5XMo3qzKz00lEiD2Fe1',
});

//Creates and exports the class
export default class createPaymentMethodScreen extends Component {
	//The state of the screen
	state = {
		businessID: '',
		isScreenLoading: true,
		isChecked: false,
		isEditing: '',
		isCheckedErrorVisible: false,
		paymentInfoToken: '',
		bankAccountSelected: false,
		debitCardSelected: false,
		fieldsError: false,
		invalidCardTypeVisible: false,
		enterStripeInfoVisible: false,
		bankInformation: {
			accountNumber: '',
			countryCode: 'us',
			currency: 'usd',
			routingNumber: '',
			accountHolderName: '',
			accountHolderType: 'individual',
		},
		paymentMethodErrorVisible: false,
		isLoading: false,
	};

	//Fetches the correctly passed in data and sets it to the state
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CreatePaymentMethodScreen', 'createPaymentMethodScreen');
		const { businessID, isEditing } = this.props.navigation.state.params;
		this.setState({ isScreenLoading: false, businessID, isEditing });
	}

	//Starts the process for creating a Stripe Connected Account
	async createStripeConnectedAccount() {
		this.setState({ isLoading: true });
		let {
			businessID,
			isChecked,
			paymentInfoToken,
			bankAccountSelected,
			debitCardSelected,
			bankInformation,
		} = this.state;

		//Makes sure the agreements have been accepted
		if (isChecked === false) {
			this.setState({ isCheckedErrorVisible: true });
		}
		//Makes sure a payment field has been filled out
		else if (bankAccountSelected === false && debitCardSelected === false) {
			this.setState({ paymentMethodErrorVisible: true });
		} else {
			//If bank account is selected, creates the token associated with the bank account using Tipsi-Stripe
			if (bankAccountSelected === true) {
				//Double checks that all input has been filled out
				for (const key of Object.keys(bankInformation)) {
					if (bankInformation[key] === '') {
						this.setState({ fieldsError: true, isLoading: false });
						return;
					}
				}
				paymentInfoToken = await stripe.createTokenWithBankAccount(bankInformation);
			}

			//Constructs the token acceptance object for Stripe to know the user has accepted their agreement
			const dateAccepted = Math.floor(Date.now() / 1000);
			const IPAddress = (await NetInfo.fetch()).details.ipAddress;
			const tos_acceptance = {
				date: dateAccepted,
				ip: IPAddress,
			};

			const connectAccount = await FirebaseFunctions.call('createStripeConnectAccountForBusiness', {
				businessID,
				tos_acceptance,
				paymentToken: paymentInfoToken.tokenId,
			});

			//Handles the case  if the card is invalid
			if (connectAccount === 'invalid_card_type') {
				this.setState({
					debitCardSelected: false,
					invalidCardTypeVisible: true,
					paymentInfoToken: '',
					paymentInformation: '',
				});
			} else {
				Linking.openURL(connectAccount.accountLinks.url);
				this.setState({ enterStripeInfoVisible: true });
			}
		}
		this.setState({ isLoading: false });
	}

	//Edits an exising business's default source if this screen is for editing
	async updateStripeConnectedAccount() {
		this.setState({ isLoading: true });
		let {
			businessID,
			paymentInfoToken,
			bankAccountSelected,
			debitCardSelected,
			bankInformation,
		} = this.state;

		//Makes sure a payment field has been filled out
		if (bankAccountSelected === false && debitCardSelected === false) {
			this.setState({ paymentMethodErrorVisible: true });
		} else {
			//If bank account is selected, creates the token associated with the bank account using Tipsi-Stripe
			if (bankAccountSelected === true) {
				//Double checks that all input has been filled out
				for (const key of Object.keys(bankInformation)) {
					if (bankInformation[key] === '') {
						this.setState({ fieldsError: true, isLoading: false });
						return;
					}
				}
				paymentInfoToken = await stripe.createTokenWithBankAccount(bankInformation);
			}

			const connectAccount = await FirebaseFunctions.call('updateStripeConnectAccountPayment', {
				businessID,
				paymentToken: paymentInfoToken.tokenId,
			});

			//Handles the case  if the card is invalid
			if (connectAccount === 'invalid_card_type') {
				this.setState({
					debitCardSelected: false,
					invalidCardTypeVisible: true,
					paymentInfoToken: '',
					paymentInformation: '',
				});
			} else {
				this.props.navigation.push('BusinessScreens', {
					businessID,
				});
			}
		}
		this.setState({ isLoading: false });
	}

	//Renders the actual screen
	render() {
		const {
			businessID,
			isScreenLoading,
			isChecked,
			debitCardSelected,
			enterStripeInfoVisible,
			bankAccountSelected,
			isLoading,
			paymentInfoToken,
			isCheckedErrorVisible,
			isEditing,
			invalidCardTypeVisible,
			bankInformation,
			paymentMethodErrorVisible,
			fieldsError,
		} = this.state;

		//If the  screen is loading, displays the spinner
		if (isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.AddPayments}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'center',
						}}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}

		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<KeyboardAwareScrollView
					style={{
						backgroundColor: colors.lightGray,
					}}>
					<View style={screenStyle.container}>
						<TopBanner
							title={strings.AddPayments}
							leftIconName='angle-left'
							leftOnPress={() => this.props.navigation.goBack()}
						/>
						<View
							style={{
								alignItems: 'flex-start',
								marginLeft: screenWidth * 0.025,
								marginTop: screenHeight * 0.025,
							}}>
							<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>
								{strings.WhereDoYouWantToAcceptPaymentsQuestion}
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-evenly',
								width: screenWidth,
								marginTop: screenHeight * 0.025,
							}}>
							<HelpButton
								title={strings.BankAccount}
								width={screenWidth * 0.39}
								isLightButton={bankAccountSelected}
								//Method selects the business button and deselects the other
								onPress={() => {
									this.setState({
										bankAccountSelected: true,
										debitCardSelected: false,
									});
								}}
								disabled={isLoading}
							/>
							<HelpButton
								title={strings.DebitCard}
								width={screenWidth * 0.39}
								//Tests if this button is selected, if it is, then the border color will
								//be blue
								isLightButtton={debitCardSelected}
								//Method selects the business button and deselects the other
								onPress={async () => {
									try {
										this.setState({
											debitCardSelected: true,
											bankAccountSelected: false,
										});
										const paymentInfoToken = await stripe.paymentRequestWithCardForm({
											requiredBillingAddressFields: 'full',
											theme: {
												accentColor: colors.lightBlue,
												errorColor: colors.red,
											},
											managedAccountCurrency: 'usd',
										});
										this.setState({
											paymentInfoToken,
										});
									} catch (error) {
										if (error.message !== 'Cancelled by user') {
											FirebaseFunctions.call('logIssue', {
												error,
												userID: 'BusinessScheduleScreen',
											});
										}
										this.setState({
											debitCardSelected: false,
											bankAccountSelected: false,
										});
									}
								}}
								disabled={isLoading}
							/>
						</View>
						{//Displays the bank account form
						bankAccountSelected === true ? (
							<View>
								<View
									style={{
										justifyContent: 'flex-end',
										alignItems: 'flex-start',
										width: screenWidth * 0.8,
										marginVertical: screenHeight * 0.05,
									}}>
									<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
										{strings.AccountHolderName}
									</Text>
								</View>
								<View style={{ justifyContent: 'center' }}>
									<HelpTextInput
										isMultiline={false}
										height={screenHeight * 0.06}
										width={screenWidth * 0.8}
										placeholder={strings.EnterTheAccountHolderNameDotDotDot}
										onChangeText={(input) =>
											this.setState({
												bankInformation: {
													...bankInformation,
													accountHolderName: input,
												},
											})
										}
										value={bankInformation.accountHolderName}
										password={false}
									/>
								</View>
								<View
									style={{
										justifyContent: 'flex-end',
										alignItems: 'flex-start',
										width: screenWidth * 0.8,
										marginVertical: screenHeight * 0.05,
									}}>
									<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
										{strings.AccountNumber}
									</Text>
								</View>
								<View style={{ justifyContent: 'center' }}>
									<HelpTextInput
										isMultiline={false}
										height={screenHeight * 0.06}
										width={screenWidth * 0.8}
										placeholder={strings.EnterTheAccountNumberDotDotDot}
										onChangeText={(input) =>
											this.setState({
												bankInformation: {
													...bankInformation,
													accountNumber: input,
												},
											})
										}
										value={bankInformation.accountNumber}
										password={false}
										keyboardType={'numeric'}
									/>
								</View>
								<View
									style={{
										justifyContent: 'flex-end',
										alignItems: 'flex-start',
										width: screenWidth * 0.8,
										marginVertical: screenHeight * 0.05,
									}}>
									<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
										{strings.RoutingNumber}
									</Text>
								</View>
								<View style={{ justifyContent: 'center' }}>
									<HelpTextInput
										isMultiline={false}
										height={screenHeight * 0.06}
										width={screenWidth * 0.8}
										placeholder={strings.EnterTheRoutingNumberDotDotDot}
										onChangeText={(input) =>
											this.setState({
												bankInformation: {
													...bankInformation,
													routingNumber: input,
												},
											})
										}
										value={bankInformation.routingNumber}
										password={false}
										keyboardType={'numeric'}
									/>
								</View>
								<View
									style={{
										justifyContent: 'flex-end',
										alignItems: 'flex-start',
										width: screenWidth * 0.8,
										marginVertical: screenHeight * 0.05,
									}}>
									<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
										{strings.AccountType}
									</Text>
								</View>
								<View
									style={{
										alignSelf: 'center',
										borderColor: colors.lightBlue,
										borderWidth: 3,
										borderRadius: 20,
										paddingHorizontal: screenWidth * 0.01,
										backgroundColor: colors.white,
									}}>
									<RNPickerSelect
										onValueChange={(value) =>
											this.setState({
												bankInformation: {
													...bankInformation,
													accountHolderType: value,
												},
											})
										}
										items={[
											{
												label: strings.Individual,
												value: 'individual',
											},
											{ label: strings.Company, value: 'company' },
										]}
										value={bankInformation.accountHolderType}
										style={{
											iconContainer: {
												top: screenHeight * 0.015,
											},
											inputIOS: [
												fontStyles.smallTextStyle,
												fontStyles.blue,
												{
													width: screenWidth * 0.8,
													height: screenHeight * 0.05,
												},
											],
											inputAndroid: [
												fontStyles.smallTextStyle,
												fontStyles.blue,
												{
													width: screenWidth * 0.8,
													height: screenHeight * 0.05,
												},
											],
										}}
										Icon={() => (
											<Icon
												type='font-awesome'
												name='arrow-down'
												color={colors.lightBlue}
												size={20}
											/>
										)}
									/>
								</View>
							</View>
						) : (
							<View />
						)}
						<View>
							{isEditing === false ? (
								<View
									style={{
										marginVertical: screenHeight * 0.05,
										justifyContent: 'flex-start',
										alignItems: 'center',
										flexDirection: 'column',
									}}>
									<CheckBox
										onClick={() => {
											this.setState({ isChecked: !isChecked });
										}}
										isChecked={isChecked}
										checkedCheckBoxColor={colors.lightBlue}
										checkBoxColor={colors.lightBlue}
									/>
									<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>
										{strings.IAcceptThe}
									</Text>
									<TouchableOpacity
										onPress={() => {
											//Opens the stripe agreements
											Linking.openURL('https://stripe.com/legal');
										}}>
										<Text style={[fontStyles.mainTextStyle, fontStyles.blue, { flexWrap: 'wrap' }]}>
											{strings.StripeServicesAgreement}
										</Text>
									</TouchableOpacity>
									<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.AndThe}</Text>
									<TouchableOpacity
										onPress={() => {
											//Opens the stripe agreements
											Linking.openURL('https://stripe.com/connect-account/legal');
										}}>
										<Text style={[fontStyles.mainTextStyle, fontStyles.blue { flexWrap: 'wrap' }]}>
											{strings.StripeConnectedAccountAgreement}
										</Text>
									</TouchableOpacity>
								</View>
							) : (
								<View style={{ height: screenHeight * 0.05 }} />
							)}
						</View>
						<View style={{ marginBottom: screenHeight * 0.05 }}>
							<HelpButton
								title={strings.Next}
								disabled={isLoading}
								isLoading={isLoading}
								width={screenWidth * 0.39}
								onPress={() => {
									if (isEditing === true) {
										this.updateStripeConnectedAccount();
									} else {
										this.createStripeConnectedAccount();
									}
								}}
							/>
						</View>
						<HelpAlert
							isVisible={isCheckedErrorVisible}
							onPress={() => {
								this.setState({ isCheckedErrorVisible: false });
							}}
							title={strings.Whoops}
							message={strings.PleaseAcceptAgreements}
						/>
						<HelpAlert
							isVisible={paymentMethodErrorVisible}
							onPress={() => {
								this.setState({ paymentMethodErrorVisible: false });
							}}
							title={strings.Whoops}
							message={strings.PleaseSelectAWayToAcceptPayments}
						/>
						<HelpAlert
							isVisible={invalidCardTypeVisible}
							onPress={() => {
								this.setState({ invalidCardTypeVisible: false });
							}}
							title={strings.InvalidCardType}
							message={strings.InvalidCardTypeMessage}
						/>
						<HelpAlert
							isVisible={fieldsError}
							onPress={() => {
								this.setState({ fieldsError: false });
							}}
							title={strings.Whoops}
							message={strings.PleaseFillOutAllFields}
						/>
						<HelpAlert
							isVisible={enterStripeInfoVisible}
							onPress={() => {
								this.setState({ enterStripeInfoVisible: false });
								this.props.navigation.push('BusinessScreens', {
									businessID,
								});
							}}
							title={strings.EnterStripeInfo}
							message={strings.EnterStripeInfoMessage}
						/>
					</View>
				</KeyboardAwareScrollView>
			</TouchableWithoutFeedback>
		);
	}
}
