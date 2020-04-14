//This is the screen where customers will be able to add a payment method, edit their existing payment
//method, or delete their existing payment method.
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import RoundBlueButton from '../components/RoundBlueButton';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import colors from 'config/colors';
import LeftMenu from './LeftMenu';
import HelpAlert from '../components/HelpAlert';
import OptionPicker from '../components/OptionPicker';
import strings from 'config/strings';
import { screenHeight, screenWidth } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import SideMenu from 'react-native-side-menu';
import stripe from 'tipsi-stripe';
stripe.setOptions({
	publishableKey: 'pk_test_RP4GxbKwMWbM3NN5XMo3qzKz00lEiD2Fe1',
});

//Exports the class component
export default class paymentsScreen extends Component {
	//This is the initial state of the payments screen. Controls the loading state, the visible errors,
	//etc.
	state = {
		isScreenLoading: true,
		isLoading: false,
		isOpen: false,
		hasPaymentMethod: '',
		isDeletePaymentMethodVisible: false,
		customer: this.props.navigation.state.params.customer,
		paymentToken: '',
		allServices: this.props.navigation.state.params.allServices,
	};

	//This method is going to record the payment method for this user and store in stripe. Also adjusts the state
	//of the screen
	async saveCardInformation() {
		try {
			const token = await stripe.paymentRequestWithCardForm({
				requiredBillingAddressFields: 'full',
				theme: {
					accentColor: colors.lightBlue,
					errorColor: colors.red,
				},
			});
			this.setState({ isScreenLoading: true });
			const { customerID } = this.state.customer;
			await FirebaseFunctions.call('createStripeCustomerPaymentInformtion', {
				paymentInformation: token.tokenId,
				customerID,
			});
			const updatedCustomerDocument = await FirebaseFunctions.call('getCustomerByID', {
				customerID,
			});
			this.setState({
				isScreenLoading: false,
				customer: updatedCustomerDocument,
				hasPaymentMethod: true,
			});
		} catch (error) {
			if (error.message !== 'Cancelled by user') {
				FirebaseFunctions.call('logIssue', {
					error,
					userID: 'CustomerPaymentMethodsScreen',
				});
			}
			this.setState({ isScreenLoading: false });
		}
	}

	//This method is going to edit existing card information associated with a customer. It will not create a new
	//stripe customer, but rather just edit the exising one. It will also manage the state for the screen after that
	async editCardInformation() {
		try {
			const token = await stripe.paymentRequestWithCardForm({
				requiredBillingAddressFields: 'full',
				theme: {
					accentColor: colors.lightBlue,
					errorColor: colors.red,
				},
			});
			this.setState({ isScreenLoading: true });
			const { customer } = this.state;
			const { customerID } = customer;
			await FirebaseFunctions.call('updateStripeCustomerPaymentInformtion', {
				paymentInformation: token.tokenId,
				customerID,
			});
			const updatedCustomerDocument = await FirebaseFunctions.call('getCustomerByID', {
				customerID,
			});
			this.setState({
				isScreenLoading: false,
				customer: updatedCustomerDocument,
				hasPaymentMethod: true,
			});
		} catch (error) {
			if (error.message !== 'Cancelled by user') {
				FirebaseFunctions.call('logIssue', {
					error,
					userID: 'CustomerPaymentMethodsScreen',
				});
			}
			this.setState({ isScreenLoading: false });
		}
	}

	//This function is going to delete the payment method using Cloud Functions, then will adjust the state of the screen
	//accordingly to display the "No Payment Method" state.
	async deletePaymentMethod() {
		this.setState({ isScreenLoading: true });
		const { customerID } = this.state.customer;
		await FirebaseFunctions.call('deleteCustomerPaymentInformation', {
			customerID,
		});
		const updatedCustomerDocument = await FirebaseFunctions.call('getCustomerByID', {
			customerID,
		});

		this.setState({
			isScreenLoading: false,
			customer: updatedCustomerDocument,
			hasPaymentMethod: false,
		});
	}

	//The componentDidMount method will detect whether the customer already has a payment method
	//or not and sets the initial state based on that. Also fetches the correct customer objects, etc.
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CustomerPaymentMethodsScreen', 'paymentsScreen');

		//Tests for whether the customer has a payment method or not and displays the correct UI
		const { customer } = this.state;
		this.setState({
			hasPaymentMethod: customer.paymentInformation !== '',
			isScreenLoading: false,
		});
	}

	//The render method for this screen
	render() {
		const {
			isScreenLoading,
			customer,
			allServices,
			isOpen,
			hasPaymentMethod,
			isDeletePaymentMethodVisible,
			isLoading,
		} = this.state;

		if (isScreenLoading === true) {
			return (
				<SideMenu
					onChange={(isOpen) => {
						this.setState({ isOpen });
					}}
					isOpen={isOpen}
					menu={
						<LeftMenu
							navigation={this.props.navigation}
							allServices={allServices}
							customer={customer}
						/>
					}>
					<HelpView style={screenStyle.container}>
						<TopBanner
							leftIconName='navicon'
							leftOnPress={() => {
								this.setState({ isOpen: true });
							}}
							size={30}
							title={strings.Payments}
						/>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<LoadingSpinner isVisible={true} />
						</View>
					</HelpView>
				</SideMenu>
			);
		}
		//If the user does have a payment method, displays some information about it, and gives the option to delete
		//or edit it
		else if (hasPaymentMethod === true) {
			const { paymentInformation } = customer;
			return (
				<SideMenu
					onChange={(isOpen) => {
						this.setState({ isOpen });
					}}
					isOpen={isOpen}
					menu={
						<LeftMenu
							navigation={this.props.navigation}
							allServices={allServices}
							customer={customer}
						/>
					}>
					<HelpView style={screenStyle.container}>
						<TopBanner
							leftIconName='navicon'
							leftOnPress={() => {
								this.setState({ isOpen: true });
							}}
							size={30}
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
								name='credit-card'
								color={colors.lightBlue}
								size={100}
							/>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: screenWidth * 0.9,
								marginBottom: screenHeight * 0.015,
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{strings.NameOnCard}</Text>
							<Text style={fontStyles.subTextStyleBlack}>
								{paymentInformation.name}
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: screenWidth * 0.9,
								marginBottom: screenHeight * 0.015,
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{strings.CardNumber}</Text>
							<Text style={fontStyles.smallTextStyleBlack}>
								{paymentInformation.brand}
								{strings.Asterisks}
								{paymentInformation.last4}
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: screenWidth * 0.9,
								marginBottom: screenHeight * 0.015,
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{strings.ExpDate}</Text>
							<Text style={fontStyles.subTextStyleBlack}>
								{paymentInformation.exp_month}/{paymentInformation.exp_year}
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: screenWidth * 0.9,
								marginBottom: screenHeight * 0.015,
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{strings.Address}</Text>
							<Text style={fontStyles.subTextStyleBlack}>
								{paymentInformation.address_line1}
							</Text>
						</View>
						<View
							style={{
								marginTop: screenHeight * 0.3,
								width: screenWidth,
								flexDirection: 'row',
								justifyContent: 'space-evenly',
								alignItems: 'center',
							}}>
							<RoundBlueButton
								title={strings.Delete}
								style={roundBlueButtonStyle.MediumSizeButtonRed}
								textStyle={fontStyles.bigTextStyleWhite}
								onPress={() => {
									this.setState({ isDeletePaymentMethodVisible: true });
								}}
								disabled={this.state.isLoading}
							/>

							<RoundBlueButton
								title={strings.Edit}
								style={roundBlueButtonStyle.MediumSizeButton}
								textStyle={fontStyles.bigTextStyleWhite}
								onPress={() => {
									this.editCardInformation();
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
				</SideMenu>
			);
		}
		//This means the user does not have a payment method, which the screen then allows them to add one
		else {
			return (
				<SideMenu
					onChange={(isOpen) => {
						this.setState({ isOpen });
					}}
					isOpen={isOpen}
					menu={
						<LeftMenu
							navigation={this.props.navigation}
							allServices={allServices}
							customer={customer}
						/>
					}>
					<HelpView style={screenStyle.container}>
						<TopBanner
							leftIconName='navicon'
							leftOnPress={() => {
								this.setState({ isOpen: true });
							}}
							size={30}
							title={strings.Payments}
						/>
						<HelpView style={screenStyle.container}>
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									alignSelf: 'center',
									marginTop: screenHeight * 0.025,
									width: screenWidth * 0.9,
								}}>
								<Text
									style={[fontStyles.bigTextStyleBlack, { textAlign: 'center' }]}>
									{strings.AddAPaymentMethodWithHelp}
								</Text>
							</View>
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									alignSelf: 'center',
									marginTop: screenHeight * 0.025,
									width: screenWidth * 0.9,
								}}>
								<Text
									style={[fontStyles.subTextStyleBlack, { textAlign: 'center' }]}>
									{strings.YourInformationWillNotBeSharedWithBusinesses}
								</Text>
							</View>
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									alignSelf: 'center',
									marginTop: screenHeight * 0.025,
								}}>
								<Icon
									type='font-awesome'
									name='credit-card'
									color={colors.lightBlue}
									size={250}
								/>
							</View>
							<View
								style={{
									justifyContent: 'flex-end',
									alignItems: 'center',
									alignSelf: 'center',
									marginTop: screenHeight * 0.15,
								}}>
								<RoundBlueButton
									title={strings.Add}
									style={roundBlueButtonStyle.MediumSizeButton}
									textStyle={fontStyles.bigTextStyleWhite}
									isLoading={isLoading}
									onPress={() => {
										this.saveCardInformation();
									}}
								/>
							</View>
						</HelpView>
					</HelpView>
				</SideMenu>
			);
		}
	}
}
