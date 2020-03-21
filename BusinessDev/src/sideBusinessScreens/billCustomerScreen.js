//This is going to be the screen where the business will confirm how much should be billed to the customer. It will display
//the price of the service, and then confirm based on whether the price is a "per" or a "set" price
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import HelpView from '../components/HelpView';
import fontStyles from 'config/styles/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import RoundBlueButton from '../components/RoundBlueButton';
import TopBanner from '../components/TopBanner';

//Declares and exports the class
export default class billCustomerScreen extends Component {
	//The state of the screen
	state = {
		request: '',
		requestID: '',
		cash: '',
		card: '',
		price: '',
		priceText: '',
		billedAmount: '',
		units: '',
		isLoading: false
	};

	//Sets the initial state
	componentDidMount() {
		const { request } = this.props.navigation.state.params;

		//Sets the initial billed amount if it is fixed for this service
		if (request.price.priceType === 'fixed') {
			this.setState({
				billedAmount: request.price.priceFixed.toFixed(2) + ''
			});
		}

		this.setState({
			request,
			requestID: request.requestID,
			cash: request.cash,
			card: request.card,
			price: request.price,
			priceText: request.priceText
		});
	}

	//renders the class
	render() {
		const { request, requestID, cash, card, price, priceText, billedAmount, units } = this.state;

		//Determines what to render based on whether the service was paid for in cash, still to be paid via card, and the type
		//of the price (per vs. exact)

		//If the payment is just through cash, then the business will be asked how much the customer paid them
		if (cash === true) {
			return (
				<HelpView>
					<TopBanner
						title={strings.Billing}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'center',
							marginTop: screenHeight * 0.05,
							width: screenWidth * 0.9
						}}>
						<Text style={[fontStyles.mainTextStyleBlack, { textAlign: 'center' }]}>
							{strings.HowMuchWasTheCustomerChargedForTheService}
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							marginTop: screenHeight * 0.2
						}}>
						<Text style={fontStyles.bigTitleStyleBlack}>{strings.DollarSign}</Text>
						<TextInput
							value={billedAmount}
							style={[
								fontStyles.bigTitleStyleBlack,
								{
									borderBottomColor: colors.black,
									borderBottomWidth: 1
								}
							]}
							keyboardType={'numeric'}
							placeholder={strings.ExampleBilledAmount}
							onChangeText={(text) => {
								this.setState({ billedAmount: text });
							}}
						/>
					</View>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: screenHeight * 0.175
						}}>
						<RoundBlueButton
							title={strings.Complete}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.mainTextStyleWhite}
							onPress={() => {
								//Completes the service
							}}
							disabled={this.state.isLoading}
						/>
					</View>
				</HelpView>
			);
		} else {
			//This means it is a card transaction

			//If it is a set price, that price is simply confirmed here by the business
			if (price.priceType === 'fixed') {
				return (
					<HelpView>
						<TopBanner
							title={strings.Billing}
							leftIconName='angle-left'
							leftOnPress={() => this.props.navigation.goBack()}
						/>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'center',
								marginTop: screenHeight * 0.05,
								width: screenWidth * 0.9
							}}>
							<Text style={[fontStyles.mainTextStyleBlack, { textAlign: 'center' }]}>
								{strings.PleaseConfirmThatThisIsThePriceTheCustomerShouldBeChargedForThisService}
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								marginTop: screenHeight * 0.2
							}}>
							<Text style={fontStyles.bigTitleStyleBlack}>{strings.DollarSign}</Text>
							<TextInput
								value={billedAmount}
								style={[
									fontStyles.bigTitleStyleBlack,
									{
										borderBottomColor: colors.black,
										borderBottomWidth: 1
									}
								]}
								keyboardType={'numeric'}
								placeholder={strings.ExampleBilledAmount}
								onChangeText={(text) => {
									this.setState({ billedAmount: text });
								}}
							/>
						</View>
						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: screenHeight * 0.175
							}}>
							<RoundBlueButton
								title={strings.Complete}
								style={roundBlueButtonStyle.MediumSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									//Completes the service
								}}
								disabled={this.state.isLoading}
							/>
						</View>
					</HelpView>
				);
			} else {
				//This means that it is a card transaction that is a "per", which will then ask the business how many of that
				//"per" there was, and calculate a price based on that.

				return (
					<HelpView>
						<TopBanner
							title={strings.Billing}
							leftIconName='angle-left'
							leftOnPress={() => this.props.navigation.goBack()}
						/>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'center',
								marginTop: screenHeight * 0.05,
								width: screenWidth * 0.9
							}}>
							<Text style={[fontStyles.mainTextStyleBlack, { textAlign: 'center' }]}>
								{strings.ThePriceForThisServiceWas}
								{priceText}
							</Text>
							<View style={{ height: screenHeight * 0.025 }} />
							<Text style={[fontStyles.mainTextStyleBlack, { textAlign: 'center' }]}>
								{strings.PleaseEnterAmountOf}
								{price.per}
								{strings.ParanthesesS}
								{strings.ThereWereForThisRequestSoThatTheFinalPriceCanBeCalculated}
							</Text>
							<View style={{ height: screenHeight * 0.025 }} />
						</View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								marginTop: screenHeight * 0.2
							}}>
							<TextInput
								value={units}
								style={[
									fontStyles.bigTitleStyleBlack,
									{
										borderBottomColor: colors.black,
										borderBottomWidth: 1
									}
								]}
								keyboardType={'numeric'}
								placeholder={strings.Zero}
								onChangeText={(text) => {
									this.setState({ units: text });
								}}
							/>
						</View>
						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: screenHeight * 0.175
							}}>
							<RoundBlueButton
								title={strings.Complete}
								style={roundBlueButtonStyle.MediumSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									//Completes the service
								}}
								disabled={this.state.isLoading}
							/>
						</View>
					</HelpView>
				);
			}
		}
	}
}
