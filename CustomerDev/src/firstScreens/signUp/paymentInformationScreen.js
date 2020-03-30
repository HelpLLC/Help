//This is the screen where customers are going to enter their card information or just skip this information for later.
import React, { Component } from 'react';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import { CreditCardInput } from 'react-native-credit-card-input';
import { View, TouchableOpacity, Text } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import TopBanner from '../../components/TopBanner';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OptionPicker from '../../components/OptionPicker';
import HelpAlert from '../../components/HelpAlert';

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
		fieldsError: false
	};

	//Saves the credit card information
	saveInfo() {}

	//Requests the service
	requestService() {}

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
						textStyle={fontStyles.bigTextStyleWhite}
						style={roundBlueButtonStyle.MediumSizeButton}
						onPress={() => {
							console.log(this.state.form);
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
