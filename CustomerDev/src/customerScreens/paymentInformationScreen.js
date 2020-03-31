//This is the screen where customers are going to enter their card information or just skip this information for later.
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import { CreditCardInput } from 'react-native-credit-card-input';
import { View, Text } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../components/TopBanner';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OptionPicker from '../components/OptionPicker';
import HelpAlert from '../components/HelpAlert';

//declares and exports the class
export default class paymentInformationScreen extends Component {
	//The state of the screen
	state = {
		form: {
			valid: false,
			values: {
				number: '',
				expiry: '',
				cvc: '',
				type: '',
				name: '',
				postalCode: ''
			},
			status: {
				// will be one of ["incomplete", "invalid", and "valid"]
				number: 'incomplete',
				expiry: 'incomplete',
				cvc: 'incomplete',
				name: 'incomplete',
				postalCode: 'incomplete'
			}
		},
		saveCardInfoVisible: false,
		isLoading: false,
		isRequestSucess: false,
		fieldsError: false
	};

	//Saves the credit card information
	saveInfo() {}

	//Requests the service
	async requestService() {
		//Uploads the request to firebase
		if (isEditing === true) {
			await FirebaseFunctions.call('updateCustomerRequest', {
				requestID: request.requestID,
				status: request.status,
				customerID: request.customerID,
				customerLocation: {
					city: customer.city,
					state: customer.state,
					country: customer.country
				},
				businessID: request.businessID,
				serviceTitle: service.serviceTitle,
				customerName: customer.name,
				serviceID: request.serviceID,
				date: selectedDate,
				serviceDuration: service.serviceDuration,
				questions: answers ? answers : [],
				time: selectedTime
			});
		} else {
			await FirebaseFunctions.call('requestService', {
				assignedTo: '',
				businessID: business.businessID,
				customerLocation: {
					city: customer.city,
					state: customer.state,
					country: customer.country
				},
				customerID: customer.customerID,
				cash: false,
				card: true,
				date: selectedDate,
				questions: answers ? answers : [],
				price: service.price,
				priceText: service.priceText,
				review: '',
				serviceTitle: service.serviceTitle,
				customerName: customer.name,
				serviceDuration: service.serviceDuration,
				serviceID: service.serviceID,
				requestedOn: new Date().toLocaleDateString('en-US'),
				status: 'REQUESTED',
				time: selectedTime
			});
		}
		const allServices = await FirebaseFunctions.call('getAllServices', {});
		const updatedCustomer = await FirebaseFunctions.call('getCustomerByID', {
			customerID: customer.customerID
		});
		this.setState({
			isLoading: false,
			isRequestSucess: true,
			customer: updatedCustomer,
			allServices
		});
	}

	//Renders the screen
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.PaymentInfo}
					leftIconName='angle-left'
					leftOnPress={() => {
						//Method will go back to the splash screen
						this.props.navigation.goBack();
					}}
				/>
				<View
					style={{
						marginTop: screenHeight * 0.025,
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						width: screenWidth * 0.9
					}}>
					<Text style={[{ textAlign: 'center' }, fontStyles.mainTextStyleBlack]}>
						{strings.ChargingMessage}
					</Text>
					<View style={{ height: screenHeight * 0.01 }} />
					<Text style={[{ textAlign: 'center' }, fontStyles.subTextStyleBlack]}>
						{strings.NotSharedWithBusiness}
					</Text>
				</View>
				<View style={{ marginTop: screenHeight * 0.035, height: screenHeight * 0.35 }}>
					<CreditCardInput
						brand={'visa'}
						fontFamily={fontStyles.subTextStyleBlack}
						invalidColor={colors.red}
						validColor={colors.lightBlue}
						requiresName={true}
						requiresPostalCode={true}
						allowScroll={true}
						validatePostalCode={(input) => {
							if (input === '') {
								return 'incomplete';
							} else if (input.length !== 5) {
								return 'invalid';
							} else {
								return 'valid';
							}
						}}
						onChange={(form) => {
							this.setState({ form });
						}}
					/>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: screenHeight * 0.15
					}}>
					<RoundBlueButton
						title={strings.Save}
						isLoading={this.state.isLoading}
						disabled={this.state.isLoading}
						textStyle={fontStyles.bigTextStyleWhite}
						style={roundBlueButtonStyle.MediumSizeButton}
						onPress={() => {
							this.setState({
								fieldsError: !this.state.form.valid,
								saveCardInfoVisible: this.state.form.valid
							});
						}}
					/>
				</View>
				<OptionPicker
					isVisible={this.state.saveCardInfoVisible}
					title={strings.SavePaymentInfo}
					message={strings.SavePaymentInfoMessage}
					confirmText={strings.Yes}
					cancelText={strings.No}
					clickOutside={false}
					confirmOnPress={() => {
						this.setState({ saveCardInfoVisible: false, isLoading: true });
						this.saveInfo();
					}}
					cancelOnPress={() => {
						this.setState({ saveCardInfoVisible: false, isLoading: true });
						this.requestService();
					}}
				/>
				<HelpAlert
					isVisible={this.state.isRequestSucess}
					onPress={() => {
						this.setState({ isRequestSucess: false });
						this.props.navigation.push('FeaturedScreen', {
							customer: customer,
							allServices: allServices
						});
					}}
					title={strings.Success}
					message={strings.TheServiceHasBeenRequested}
				/>
				<HelpAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseMakeSureAllFieldsAreValid}
				/>
			</HelpView>
		);
	}
}
