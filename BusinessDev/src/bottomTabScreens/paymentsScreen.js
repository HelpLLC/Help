//This is going to be the screen where the business's payment information is displayed. This includes transaction history, stripe
//account management, etc.
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import HelpAlert from '../components/HelpAlert';
import TopBanner from '../components/TopBanner';
import { screenWidth, screenHeight } from 'config/dimensions';
import LoadingSpinner from '../components/LoadingSpinner';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import colors from 'config/colors';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import fontStyles from 'config/styles/fontStyles';

//Creates and exports the class
export default class paymentsScreen extends Component {
	state = {
		isScreenLoading: true,
		isErrorVisible: false,
		business: '',
		businessID: '',
		paymentSetupStatus: '',
	};

	//Declares the screen name in Firebase
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('PaymentsScreen', 'paymentsScreen');
		try {
			//If navigated from launch screen or the log in screen, won't "double fetch" the business object because it'll have
			//already been fetched
			const { businessID, businessFetched } = this.props.navigation.state.params;
			let business = '';
			if (businessFetched === true) {
				business = this.props.navigation.state.params.business;
			} else {
				business = await FirebaseFunctions.call('getBusinessByID', { businessID });
			}
			this.setState({
				businessID: business.businessID,
				paymentSetupStatus: business.paymentSetupStatus,
				business,
				isScreenLoading: false,
			});
		} catch (error) {
			this.setState({ isScreenLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'PaymentsScreen',
					userID: 'b-' + this.props.navigation.state.params.businessID,
				},
			});
		}
	}

	render() {
		const {
			isScreenLoading,
			isErrorVisible,
			business,
			businessID,
			paymentSetupStatus,
		} = this.state;

		//If the screen is loading, the  loading spinner will appear. If the business has not yet set up payments, that
		//UI will appear. If none of that is true, the business's payments will be displayed
		if (isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner title={strings.Payments} />
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
					<HelpAlert
						isVisible={isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
					/>
				</HelpView>
			);
		} else if (paymentSetupStatus === 'FALSE') {
			return (
				<HelpView style={screenStyle.container}>
					<View>
						<TopBanner size={30} title={strings.Payments} />
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'center',
							marginTop: screenHeight * 0.025,
							width: screenWidth * 0.9,
						}}>
						<Text style={[fontStyles.bigTextStyleBlack, { textAlign: 'center' }]}>
							{strings.AcceptCardPaymentsWithHelp}
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
							title={strings.GetStarted}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								//Starts the Stripe Payments process
								this.props.navigation.push('CreatePaymentMethodScreen', {
									businessID,
									isEditing: false
								});
							}}
						/>
					</View>
				</HelpView>
			);
		} else {
			const { paymentInformation } = business;
			console.log(paymentInformation);
			return (
				//View that dismisses the keyboard when clicked anywhere else
				<HelpView style={screenStyle.container}>
					<TopBanner size={30} title={strings.Payments} />
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.push('ViewPaymentMethodScreen', { business });
						}}
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-start',
							paddingBottom: screenHeight * 0.025,
							paddingTop: screenHeight * 0.05,
							width: screenWidth,
							marginLeft: screenWidth * 0.1,
							marginBottom: screenHeight * 0.05,
						}}>
						<View>
							<Icon
								type='font-awesome'
								name={
									paymentInformation.object === 'bank_account'
										? 'university'
										: 'credit-card'
								}
								color={colors.lightBlue}
								size={80}
							/>
						</View>
						<View style={{ marginLeft: screenWidth * 0.15 }}>
							<Text style={fontStyles.mainTextStyleBlue}>
								{paymentInformation.object === 'bank_account'
									? paymentInformation.account_holder_name
									: paymentInformation.name}
							</Text>
						</View>
						<View style={{ marginLeft: screenWidth * 0.15 }}>
							<Icon
								name={'angle-right'}
								type={'font-awesome'}
								color={colors.lightBlue}
								size={40}
							/>
						</View>
					</TouchableOpacity>
				</HelpView>
			);
		}
	}
}
