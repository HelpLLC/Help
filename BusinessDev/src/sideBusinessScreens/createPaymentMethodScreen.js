//This is the screen where the business will enter all the required information to create a Stripe Custom Connect Account
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import RoundBlueButton from '../components/RoundBlueButton';
import screenStyle from 'config/styles/screenStyle';
import colors from 'config/colors';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import HelpView from '../components/HelpView';
import HelpAlert from '../components/HelpAlert';
import NetInfo from '@react-native-community/netinfo';
import LoadingSpinner from '../components/LoadingSpinner';
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
		isCheckedErrorVisible: false,
		paymentInfoToken: '',
		bankAccountSelected: false,
		debitCardSelected: false,
		invalidCardTypeVisible: false,
		paymentMethodErrorVisible: false,
		isLoading: false,
	};

	//Fetches the correctly passed in data and sets it to the state
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen(
			'CreatePaymentMethodScreen',
			'createPaymentMethodScreen'
		);
		const { businessID } = this.props.navigation.state.params;
		this.setState({ isScreenLoading: false, businessID });
	}

	//Starts the process for creating a Stripe Connected Account
	async createStripeConnectedAccount() {
		this.setState({ isLoading: true });
		const {
			businessID,
			isChecked,
			paymentInfoToken,
			bankAccountSelected,
			debitCardSelected,
		} = this.state;

		//Makes sure the agreements have been accepted
		if (isChecked === false) {
			this.setState({ isCheckedErrorVisible: true });
		} //Makes sure a payment field has been filled out
		else if (
			(bankAccountSelected === false && debitCardSelected === false) ||
			paymentInfoToken === ''
		) {
			this.setState({ paymentMethodErrorVisible: true });
		} else {
			//Constructs the token acceptance object for Stripe to know the user has accepted their agreement
			const dateAccepted = Math.floor(Date.now() / 1000);
			const IPAddress = (await NetInfo.fetch()).details.ipAddress;
			const tos_acceptance = {
				date: dateAccepted,
				ip: IPAddress,
			};

			const connectAccount = await FirebaseFunctions.call(
				'createStripeConnectAccountForBusiness',
				{
					businessID,
					tos_acceptance,
					paymentInformation: paymentInfoToken,
					paymentToken: paymentInfoToken.tokenId,
				}
			);

			//Handles the case  if the card is invalid
			if (connectAccount === 'invalid_card_type') {
				this.setState({
					debitCardSelected: false,
					invalidCardTypeVisible: true,
					paymentInfoToken: '',
					paymentInformation: '',
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
			bankAccountSelected,
			isLoading,
			paymentInfoToken,
			isCheckedErrorVisible,
			invalidCardTypeVisible,
			paymentMethodErrorVisible,
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
			<HelpView style={screenStyle.container}>
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
					<Text style={fontStyles.mainTextStyleBlack}>
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
					<RoundBlueButton
						title={strings.BankAccount}
						//Tests if this button is selected, if it is, then the border color will
						//be blue
						style={[
							roundBlueButtonStyle.AccountTypeButton,
							{
								//Width increased for longer text
								width: screenWidth * 0.39,
								borderColor:
									bankAccountSelected === true ? colors.lightBlue : colors.white,
							},
						]}
						textStyle={fontStyles.mainTextStyleBlue}
						//Method selects the business button and deselects the other
						onPress={() => {
							this.setState({
								bankAccountSelected: true,
								debitCardSelected: false,
							});
						}}
						disabled={isLoading}
					/>
					<RoundBlueButton
						title={strings.DebitCard}
						//Tests if this button is selected, if it is, then the border color will
						//be blue
						style={[
							roundBlueButtonStyle.AccountTypeButton,
							{
								//Width increased for longer text
								width: screenWidth * 0.39,
								borderColor:
									debitCardSelected === true ? colors.lightBlue : colors.white,
							},
						]}
						textStyle={fontStyles.mainTextStyleBlue}
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
				<View>
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
						<Text style={fontStyles.mainTextStyleBlack}>{strings.IAcceptThe}</Text>
						<TouchableOpacity
							onPress={() => {
								//Opens the stripe agreements
								Linking.openURL('https://stripe.com/legal');
							}}>
							<Text style={[fontStyles.mainTextStyleBlue, { flexWrap: 'wrap' }]}>
								{strings.StripeServicesAgreement}
							</Text>
						</TouchableOpacity>
						<Text style={fontStyles.mainTextStyleBlack}>{strings.AndThe}</Text>
						<TouchableOpacity
							onPress={() => {
								//Opens the stripe agreements
								Linking.openURL('https://stripe.com/connect-account/legal');
							}}>
							<Text style={[fontStyles.mainTextStyleBlue, { flexWrap: 'wrap' }]}>
								{strings.StripeConnectedAccountAgreement}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View>
					<RoundBlueButton
						title={strings.Add}
						disabled={isLoading}
						isLoading={isLoading}
						style={roundBlueButtonStyle.MediumSizeButton}
						textStyle={fontStyles.bigTextStyleWhite}
						onPress={() => {
							this.createStripeConnectedAccount();
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
			</HelpView>
		);
	}
}
