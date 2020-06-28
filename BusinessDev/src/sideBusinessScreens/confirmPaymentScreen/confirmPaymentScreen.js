// This is the screen where customers will be able to sign off on the request being completed
// It will be navigated to from the billCustomerScreen
import React, { useEffect, useState } from 'react';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Switch } from 'react-native-switch';
import HelpButton from '../../components/HelpButton/HelpButton';
import HelpAlert from '../../components/HelpAlert';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import HelpView from '../../components/HelpView';
import TopBanner from '../../components/TopBanner/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import { screenWidth, screenHeight } from 'config/dimensions';
import confirmPaymentScreenStyle from './confirmPaymentScreenStyle';
import LoadingSpinner from '../../components/LoadingSpinner';
import Signature from 'react-native-signature-canvas';
import strings from 'config/strings';
import colors from 'config/colors';

// Creates the functional component
const confirmPaymentScreen = (props) => {
	// The state variables for this screen
	const [isLoading, setIsLoading] = useState(true);
	const [signature, setSignature] = useState('');
	const [isSignatureScreenVisible, setIsSignatureScreenVisible] = useState(false);
	const [request, setRequest] = useState('');
	const [billedAmount, setBilledAmount] = useState(15);
	const [sendEmailConfirmation, setSendEmailConfirmation] = useState(true);
	const [email, setEmail] = useState('');
	const [signatureError, setSignatureError] = useState(false);
	const [emailError, setEmailError] = useState(false);

	useEffect(() => {
		fetchFunc();
	}, []);

	const fetchFunc = async () => {
		await FirebaseFunctions.auth.signInWithEmailAndPassword('businessuser@hotmail.com', 'password');
		const fetched = await FirebaseFunctions.call('getRequestByID', {
			requestID: 'EKY0Winhxxb85GlXy1WX',
		});
		setRequest(fetched);
		setIsLoading(false);
	};

	// Handles the logic behind completing a request
	const completeRequest = async () => {
		if (signature === '') {
			setSignatureError(true);
		} else if (sendEmailConfirmation === true && email.trim() === '') {
			setEmailError(true);
		}
	};

	// Returns the UI for this screen

	// Shows this if the screen is loading
	if (isLoading === true) {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.Confirmation}
					leftIconName='angle-left'
					leftOnPress={() => props.navigation.goBack()}
				/>
				<View style={confirmPaymentScreenStyle.loading}>
					<LoadingSpinner isVisible={true} />
				</View>
			</HelpView>
		);
	}

	// Shows the signature component if the prop is set to true
	if (isSignatureScreenVisible === true) {
		return (
			<Signature
				onOK={(img) => {
					setSignature(img);
					setIsSignatureScreenVisible(false);
				}}
				onEmpty={() => {
					setSignature('');
					setIsSignatureScreenVisible(false);
				}}
				descriptionText={strings.Signature}
				clearText={strings.Clear}
				confirmText={strings.Save}
				autoClear={true}
			/>
		);
	}

	return (
		<HelpView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
			<TopBanner
				title={strings.Confirmation}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
			<View style={confirmPaymentScreenStyle.serviceTitle}>
				<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.bigSubTitleStyle]}>
					{request.serviceTitle}
				</Text>
			</View>
			<View style={confirmPaymentScreenStyle.requestInfoColumn}>
				<View style={confirmPaymentScreenStyle.requestInfoRow}>
					<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle]}>
						{strings.CompletionDate}
					</Text>
					<Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
						{new Date().toLocaleDateString('en-US')}
					</Text>
				</View>
				<View style={confirmPaymentScreenStyle.requestInfoRow}>
					<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle]}>
						{strings.Recipient}
					</Text>
					<Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
						{request.customerName}
					</Text>
				</View>
				<View style={confirmPaymentScreenStyle.requestInfoRow}>
					<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle]}>
						{strings.Total}
					</Text>
					<Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>${billedAmount}</Text>
				</View>
				{request.cash === true ? (
					<View style={confirmPaymentScreenStyle.requestInfoRow}>
						<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle]}>
							{strings.Cash}
						</Text>
						<Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>${billedAmount}</Text>
					</View>
				) : (
					<View style={confirmPaymentScreenStyle.requestInfoRow}>
						<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle]}>
							{strings.CreditDebitCard}
						</Text>
						<Text style={[fontStyles.darkBlue, fontStyles.mainTextStyle]}>
							******{request.paymentInformation.last4}
						</Text>
					</View>
				)}
			</View>
			<View style={confirmPaymentScreenStyle.signatureText}>
				<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.mainTextStyle]}>
					{strings.Signature}
				</Text>
			</View>
			{signature === '' ? (
				<TouchableOpacity
					onPress={() => setIsSignatureScreenVisible(true)}
					style={confirmPaymentScreenStyle.signatureBox}
				/>
			) : (
				<TouchableOpacity
					onPress={() => setIsSignatureScreenVisible(true)}
					style={confirmPaymentScreenStyle.signatureBox}>
					<Image source={{ uri: signature }} style={confirmPaymentScreenStyle.imageStyle} />
				</TouchableOpacity>
			)}
			<View style={confirmPaymentScreenStyle.emailConfirmationStyle}>
				<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.subTextStyle]}>
					{strings.SendEmailConfirmation}
				</Text>
				<Switch
					value={sendEmailConfirmation}
					onValueChange={(val) => setSendEmailConfirmation(val)}
					activeText={''}
					inActiveText={''}
					backgroundActive={colors.blue}
					backgroundInactive={colors.gray}
					circleActiveColor={colors.white}
					circleInActiveColor={colors.white}
				/>
			</View>
			<View style={confirmPaymentScreenStyle.leftSpacer}>
				{sendEmailConfirmation === true ? (
					<View>
						<Text style={[fontStyles.darkBlue, fontStyles.bold, fontStyles.subTextStyle]}>
							{strings.RecipientEmail}
						</Text>
						<View style={confirmPaymentScreenStyle.spacer} />
						<HelpTextInput
							isMultiline={false}
							width={screenWidth * 0.6}
							height={screenHeight * 0.06}
							placeholder={strings.EnterAnEmail}
							onChangeText={(input) => setEmail(input)}
							value={email}
							password={false}
							autoCompleteType={'email'}
							keyboardType={'email-address'}
						/>
					</View>
				) : (
					<View />
				)}
			</View>
			<View style={confirmPaymentScreenStyle.buttonContainer}>
				<HelpButton
					title={strings.Confirm}
					onPress={() => {
						completeRequest();
					}}
					width={screenWidth * 0.424}
					height={screenHeight * 0.05}
				/>
			</View>
			<HelpAlert
				isVisible={signatureError}
				onPress={() => {
					setSignatureError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseAddACustomerSignature}
			/>
			<HelpAlert
				isVisible={emailError}
				onPress={() => {
					setEmailError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseAddARecipientEmail}
			/>
		</HelpView>
	);
};

// Exports the module
export default confirmPaymentScreen;
