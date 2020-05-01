//This screen will be where a business can edit existing information about how they accept payments. They will
//be able to edit exising information, or delete it all together
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import HelpButton from '../components/HelpButton/HelpButton';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner/TopBanner';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
 
import colors from 'config/colors';
import OptionPicker from '../components/OptionPicker';
import strings from 'config/strings';
import { screenHeight, screenWidth } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import stripe from 'tipsi-stripe';
stripe.setOptions({
	publishableKey: 'pk_test_RP4GxbKwMWbM3NN5XMo3qzKz00lEiD2Fe1',
});

//Exports the class component
export default class viewPaymentMethodScreen extends Component {
	//This is the initial state of the payments screen. Controls the loading state, the visible errors,
	//etc.
	state = {
		isScreenLoading: true,
		isLoading: false,
		isDeletePaymentMethodVisible: false,
		business: this.props.navigation.state.params.business,
	};

	//This function is going to delete the payment method using Cloud Functions, then will adjust the state of the screen
	//accordingly to display the "No Payment Method" state.
	async deletePaymentMethod() {
		this.setState({ isScreenLoading: true });
		const { businessID } = this.state.business;
		await FirebaseFunctions.call('deleteBusinessPaymentInformation', {
			businessID,
		});

		this.setState({ isScreenLoading: false });
		this.props.navigation.push('BusinessScreens', { businessID });
	}

	//Sets the current screen in Firebase
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen(
			'ViewBusinessPaymentMethodScreen',
			'viewPaymentMethodScreen'
		);
		this.setState({ isScreenLoading: false });
	}

	//Renders each row with a text so code reusage is saved
	renderRowOfInfo(leftText, rightText, isRightTextBig) {
		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: screenWidth * 0.9,
					marginBottom: screenHeight * 0.015,
				}}>
				<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{leftText}</Text>
				<Text
					style={
						isRightTextBig === true
							? [fontStyles.subTextStyle, fontStyles.black]
							: [fontStyles.smallTextStyle, fontStyles.black]
					}>
					{rightText}
				</Text>
			</View>
		);
	}

	//The render method for this screen
	render() {
		const { isScreenLoading, isLoading, isDeletePaymentMethodVisible, business } = this.state;

		if (isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						leftIconName='angle-left'
						leftOnPress={() => {
							this.props.navigation.goBack();
						}}
						title={strings.Payments}
					/>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		//If the user does have a payment method, displays some information about it, and gives the option to delete
		//or edit it
		else {
			const { paymentInformation } = business;
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						leftIconName='angle-left'
						leftOnPress={() => {
							this.props.navigation.goBack();
						}}
						title={strings.Payments}
					/>
					<View
						style={{
							alignSelf: 'flex-start',
							marginTop: screenHeight * 0.05,
							marginLeft: screenWidth * 0.1,
							marginBottom: screenHeight * 0.05,
						}}>
						<Icon
							type='font-awesome'
							name={
								paymentInformation.object === 'bank_account'
									? 'university'
									: 'credit-card'
							}
							color={colors.lightBlue}
							size={100}
						/>
					</View>
					{//If this is a bank account, fetches the correct field. If it is a debit card, fetches the correct fields
					paymentInformation.object === 'bank_account' ? (
						<View>
							{this.renderRowOfInfo(
								strings.AccountName,
								paymentInformation.account_holder_name,
								true
							)}
							{this.renderRowOfInfo(strings.Bank, paymentInformation.bank_name, true)}
							{this.renderRowOfInfo(
								strings.AccountNumber,
								strings.Asterisks + paymentInformation.last4,
								false
							)}
							{this.renderRowOfInfo(
								strings.RoutingNumber,
								paymentInformation.routing_number,
								true
							)}
							{this.renderRowOfInfo(
								strings.AccountType,
								paymentInformation.account_holder_type.charAt(0).toUpperCase() +
									paymentInformation.account_holder_type.slice(1),
								true
							)}
						</View>
					) : (
						<View>
							{this.renderRowOfInfo(strings.Name, paymentInformation.name, true)}
							{this.renderRowOfInfo(
								strings.CardNumber,
								paymentInformation.brand +
									' ' +
									strings.Asterisks +
									paymentInformation.last4,
								false
							)}
							{this.renderRowOfInfo(
								strings.ExpDate,
								paymentInformation.exp_month + '/' + paymentInformation.exp_year,
								true
							)}
							{this.renderRowOfInfo(
								strings.Address,
								paymentInformation.address_line1,
								true
							)}
						</View>
					)}
					<View
						style={{
							marginTop: screenHeight * 0.3,
							width: screenWidth,
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							alignItems: 'center',
						}}>
						<HelpButton
							title={strings.Delete}
							width={screenWidth * 0.39}
							isRedButton={true}
							onPress={() => {
								this.setState({ isDeletePaymentMethodVisible: true });
							}}
							disabled={this.state.isLoading}
						/>

						<HelpButton
							title={strings.Edit}
							width={screenWidth * 0.39}
							onPress={() => {
								//Starts the Stripe Payments process
								this.props.navigation.push('CreatePaymentMethodScreen', {
									businessID: business.businessID,
									isEditing: true
								});
							}}
							disabled={this.state.isLoading}
						/>
					</View>
					<OptionPicker
						isVisible={isDeletePaymentMethodVisible}
						title={strings.DeletePaymentMethod}
						message={strings.AreYouSureYouWantToDeletePaymentMethod}
						confirmText={strings.Yes}
						cancelText={strings.Cancel}
						clickOutside={true}
						confirmOnPress={async () => {
							this.setState({
								isDeletePaymentMethodVisible: false,
							});
							this.deletePaymentMethod();
						}}
						cancelOnPress={() => {
							this.setState({ isDeletePaymentMethodVisible: false });
						}}
					/>
				</HelpView>
			);
		}
	}
}
