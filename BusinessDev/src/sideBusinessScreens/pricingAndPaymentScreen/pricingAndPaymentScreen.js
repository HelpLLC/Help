//This screen is going to be the second step in the product creation process. The business will determine the pricing
//of the service, as well as choose when customers will pay
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Picker } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import { screenHeight, screenWidth } from 'config/dimensions';
import ImagePicker from '../../components/ImagePicker';
import strings from 'config/strings';
import RNPickerSelect from 'react-native-picker-select';
import colors from 'config/colors';
import styles from './pricingAndPaymentScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FastImage from 'react-native-fast-image';
import HelpAlert from '../../components/HelpAlert';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { Icon } from 'react-native-elements';

//Declares and exports the functional component
export default function pricingAndPaymentScreen(props) {
	const { service, serviceID } = props.navigation.state.params;
	const [priceNumber, setPriceNumber] = useState('');
	const [priceType, setPriceType] = useState(strings.Fixed);
	const [perType, setPerType] = useState(strings.Hour);
	const [isCashSelected, setIsCashSelected] = useState(false);
	const [isCardSelected, setIsCardSelected] = useState(false);
	const [isPrepaySelected, setIsPrepaySelected] = useState(false);
	const [isPostpaySelected, setIsPostPaySelected] = useState(false);
	const [fieldsError, setFieldsError] = useState(false);
	const [paymentMethodError, setPaymentMethodError] = useState(false);
	const [paymentTimeError, setPaymentTimeError] = useState(false);
	const [cardPaymentMethodError, setCardPaymentMethodError] = useState(false);

	//This the method that is called when the component mounts. Sets the screen in firebase, and fetches the data
	//if this service is being edited
	useEffect(() => {
		FirebaseFunctions.setCurrentScreen(
			'BusinessCreatePricingAndPaymentScreen',
			'pricingAndPaymentScreen'
		);
		if (props.navigation.state.params.editing === true) {
			setData();
		}
	}, []);

	//This method is going to set the data for this screen if this is editing an exisitng prodct
	const setData = () => {
		const thePrice = service.price;

		if (thePrice.priceType === 'Fixed') {
			setPriceType(strings.Fixed);
			setPriceNumber(thePrice.priceFixed + '');
		} else if (thePrice.priceType === 'Per') {
			setPriceType(strings.Per);
			setPriceNumber(thePrice.price + '');
			setPerType(thePrice.per);
		}
		setIsCashSelected(service.cash);
		setIsCardSelected(service.card);
		setIsPrepaySelected(service.prepay);
		setIsPostPaySelected(service.postpay);
	};

	//This method will capture all of the data from this screen, make sure it is completed, then capture all the data
	//from the previous step, then pass it on to the next screen. If the fields from here are incomplete, then an error will
	//be displayed to the user
	const goToNextScreen = () => {
		if (priceNumber.trim() === '') {
			setFieldsError(true);
		} else if (isCardSelected === false && isCashSelected === false) {
			setPaymentMethodError(true);
		} else if (isPostpaySelected === false && isPrepaySelected === false) {
			setPaymentTimeError(true);
		} else {
			//Constructs the pricing object and the price text
			let priceText =
				priceType === strings.Per
					? '$' + priceNumber + ' ' + strings.per + ' ' + perType
					: '$' + priceNumber;
			let price = '';
			if (priceType === strings.Fixed) {
				price = {
					priceType: 'Fixed',
					priceFixed: parseFloat(priceNumber),
				};
			} else {
				price = {
					priceType: 'Per',
					price: parseFloat(priceNumber),
					per: perType,
				};
			}

			const {
				business,
				businessID,
				serviceTitle,
				serviceDescription,
				serviceDuration,
				imageResponse,
				editing,
			} = props.navigation.state.params;
			props.navigation.push('CustomerInfoScreen', {
				business,
				businessID,
				serviceTitle,
				serviceDescription,
				serviceDuration,
				imageResponse,
				priceText,
				price,
				isCardSelected,
				isCashSelected,
				isPrepaySelected,
				isPostpaySelected,
				service,
				serviceID,
				editing,
			});
		}
	};

	//The UI rendering
	return (
		<HelpView style={screenStyle.container}>
			<TopBanner
				title={strings.PricingAndPayment}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
			<View style={styles.pricingTypeSection}>
				<View style={styles.pricingTypeText}>
					<Text style={fontStyles.bigTextStyleDarkBlue}>{strings.PricingType}</Text>
				</View>
				<View style={styles.pricingRow}>
					<View style={styles.dollarSignText}>
						<Text style={fontStyles.mainTextStyleDarkBlue}>{strings.DollarSign}</Text>
					</View>
					<HelpTextInput
						isMultiline={false}
						width={screenWidth * 0.2}
						height={screenHeight * 0.06}
						keyboardType={'numeric'}
						placeholder={'0'}
						onChangeText={(input) => setPriceNumber(input)}
						value={priceNumber}
					/>
					<View style={styles.pickerStyle}>
						<RNPickerSelect
							onValueChange={(value) => setPriceType(value)}
							items={[
								{ label: strings.Fixed, value: strings.Fixed },
								{ label: strings.Per, value: strings.Per },
							]}
							value={priceType}
							style={{
								iconContainer: {
									top: screenHeight * 0.0175,
									right: screenWidth * 0.01,
								},
								inputIOS: [
									fontStyles.subTextStyleBlack,
									{ width: screenWidth * 0.2, height: screenHeight * 0.06 },
								],
								inputAndroid: [
									fontStyles.subTextStyleBlack,
									{ width: screenWidth * 0.2, height: screenHeight * 0.06 },
								],
							}}
							Icon={() => (
								<Icon type='font-awesome' name='arrow-down' color={colors.lightBlue} size={20} />
							)}
						/>
					</View>
					{//Shows the per selected if the per type is selected
					priceType === strings.Per ? (
						<View style={styles.pickerStyle}>
							<RNPickerSelect
								onValueChange={(value) => setPerType(value)}
								items={[{ label: strings.Hour, value: strings.Hour }]}
								value={perType}
								style={{
									iconContainer: {
										top: screenHeight * 0.0175,
										right: screenWidth * 0.01,
									},
									inputIOS: [
										fontStyles.subTextStyleBlack,
										{ width: screenWidth * 0.25, height: screenHeight * 0.06 },
									],
									inputAndroid: [
										fontStyles.subTextStyleBlack,
										{ width: screenWidth * 0.25, height: screenHeight * 0.06 },
									],
								}}
								Icon={() => (
									<Icon type='font-awesome' name='arrow-down' color={colors.lightBlue} size={20} />
								)}
							/>
						</View>
					) : (
						<View />
					)}
				</View>
			</View>
			<View style={styles.paymentMethodSection}>
				<Text style={fontStyles.bigTextStyleDarkBlue}>{strings.PaymentMethod}</Text>
				<View style={styles.paymentTypeSubText}>
					<Text style={fontStyles.mainTextStyleBlue}>{strings.HowWillYourCustomersPayYou}</Text>
				</View>
				<HelpButton
					isLightButton={!isCashSelected}
					onPress={() => {
						setIsCashSelected(true);
						setIsCardSelected(false);
					}}
					title={strings.Cash}
					width={screenWidth * 0.65}
					height={screenHeight * 0.06}
				/>
				<View style={styles.buttonSeparator} />
				<HelpButton
					isLightButton={!isCardSelected}
					onPress={() => {
						//If Stripe connect has not been setup yet, then a popup appear. If it has, then it just selects
						//the payment method
						if (props.navigation.state.params.business.paymentSetupStatus === 'TRUE') {
							setIsCardSelected(true);
							setIsCashSelected(false);
						} else {
							setCardPaymentMethodError(true);
						}
					}}
					title={strings.CreditDebitCard}
					width={screenWidth * 0.65}
					height={screenHeight * 0.06}
				/>
			</View>
			<View style={styles.paymentTimeSection}>
				<Text style={fontStyles.bigTextStyleDarkBlue}>{strings.PaymentTime}</Text>
				<View style={styles.paymentTypeSubText}>
					<Text style={fontStyles.mainTextStyleBlue}>
						{strings.WhenDoYouWantYourCustomersToPayYou}
					</Text>
				</View>
				<HelpButton
					isLightButton={!isPrepaySelected}
					onPress={() => {
						setIsPrepaySelected(true);
						setIsPostPaySelected(false);
					}}
					title={strings.WhenTheyOrder}
					width={screenWidth * 0.65}
					height={screenHeight * 0.06}
				/>
				<View style={styles.buttonSeparator} />
				<HelpButton
					isLightButton={!isPostpaySelected}
					onPress={() => {
						setIsPostPaySelected(true);
						setIsPrepaySelected(false);
					}}
					title={strings.AfterCompletion}
					width={screenWidth * 0.65}
					height={screenHeight * 0.06}
				/>
			</View>
			<View style={styles.buttonSection}>
				<HelpButton
					onPress={() => {
						//Attemps to navigate to the next screen
						goToNextScreen();
					}}
					title={strings.Next}
					width={screenWidth * 0.39}
				/>
			</View>
			<HelpAlert
				isVisible={fieldsError}
				onPress={() => {
					setFieldsError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseCompleteAllTheFields}
			/>
			<HelpAlert
				isVisible={paymentMethodError}
				onPress={() => {
					setPaymentMethodError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseSelectAPaymentMethod}
			/>
			<HelpAlert
				isVisible={paymentTimeError}
				onPress={() => {
					setPaymentTimeError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseSelectPaymentTime}
			/>
			<HelpAlert
				isVisible={cardPaymentMethodError}
				onPress={() => {
					setCardPaymentMethodError(false);
				}}
				title={strings.SetUpPayment}
				message={strings.PaymentsMustBeSetupBeforeAcceptingCardPayments}
			/>
		</HelpView>
	);
}
