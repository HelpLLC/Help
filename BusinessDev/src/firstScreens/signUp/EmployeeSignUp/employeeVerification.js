import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import screenStyle from '../../../../config/styles/screenStyle';
import fontStyles from '../../../../config/styles/fontStyles';
import { screenHeight, screenWidth } from '../../../../config/dimensions';
import HelpCodeInput from '../../../components/HelpCodeInput/HelpCodeInput';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import colors from '../../../../config/colors';
import HelpButton from '../../../components/HelpButton/HelpButton';
import strings from '../../../../config/strings';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../../../config/FirebaseFunctions';

const CELL_COUNT = 5;

function EmployeeVerification(props) {
	const [value, setValue] = useState('');
	const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
	const [props1, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

	const signUp = async () => {
		try {
			console.log("RANDOM");
			const { email, name, phoneNumber } = props.navigation.state.params;
			const { password } = props.navigation.state.params;
			//Fetches the account information based on whether the business also has a customer account
			console.log("1")
			account = await firebase.auth().createUserWithEmailAndPassword(email, password);
			console.log("2")
			//call function that gets businessID verification code 
			const businessID = await FirebaseFunctions.call('getBusinessByEmployeeCode')
			console.log(businessID);
			await Promise.all([
				FirebaseFunctions.logIn(email, password),
				FirebaseFunctions.call('addEmployeeToDatabase', {
					name,
					email,
					phoneNumber,
					businessID,
					employeeID: account.user.uid,
				}),
			]);
		} catch (error) {
			console.log("SOMETHINGELSE");
			await FirebaseFunctions.call('logIssue', {
				userID: 'EX',
				error,
			});
		}
		props.navigation.push('waitingForVerification');
	};

	return (
		<View style={screenStyle.container}>
			<View style={{ marginTop: screenHeight * 0.1 }}>
				<View>
					<Text style={[fontStyles.darkBlue, fontStyles.bigSubTitleStyle, { textAlign: 'center' }]}>
						Join a Business
					</Text>
				</View>
				<SafeAreaView style={styles.root}>
					<CodeField
						ref={ref}
						{...props1}
						value={value}
						onChangeText={setValue}
						cellCount={CELL_COUNT}
						rootStyle={styles.codeFieldRoot}
						keyboardType='number-pad'
						textContentType='oneTimeCode'
						renderCell={({ index, symbol, isFocused }) => (
							<Text
								key={index}
								style={[styles.cell, isFocused && styles.focusCell]}
								onLayout={getCellOnLayoutHandler(index)}>
								{symbol || (isFocused ? <Cursor /> : null)}
							</Text>
						)}
					/>
					<View style={{ marginTop: screenHeight * 0.05 }}>
						<Text style={[fontStyles.darkBlue, fontStyles.bigTextStyle, { textAlign: 'center' }]}>
							Enter a 5 digit code given by your employer
						</Text>
					</View>
					<View style={{ marginTop: screenHeight * 0.05 }}>
						<HelpButton
							title={strings.Join}
							width={screenWidth * 0.4356}
							height={screenHeight * 0.0566}
							onPress={() => {
								signUp();
							}}
						/>
					</View>
					<View style={{ marginTop: screenHeight * 0.2 }}>
						<Text style={[fontStyles.darkBlue, fontStyles.bigTextStyle, { textAlign: 'center' }]}>
							Don't have a code? Contact your employer and get one!
						</Text>
					</View>
				</SafeAreaView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, padding: 20, width: screenWidth * 0.8 },
	title: { textAlign: 'center', fontSize: 30 },
	codeFieldRoot: { marginTop: 20 },
	cell: {
		width: screenWidth * 0.11,
		height: screenHeight * 0.05,
		lineHeight: screenHeight * 0.05,
		fontSize: 24,
		borderWidth: 2,
		borderColor: colors.lightBlue,
		textAlign: 'center',
		borderRadius: screenWidth * 0.03,
	},
	focusCell: {
		borderColor: colors.blue,
	},
});
export default EmployeeVerification;
