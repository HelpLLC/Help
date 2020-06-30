// This is going to be the StyleSheet for the confirmPaymentScreen
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	serviceTitle: {
		marginTop: screenHeight * 0.05,
		marginBottom: screenHeight * 0.065,
		justifyContent: 'center',
		alignItems: 'center',
		width: screenWidth,
		textAlign: 'center',
	},
	requestInfoColumn: {
		flexDirection: 'column',
		height: screenHeight * 0.17,
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center',
	},
	requestInfoRow: {
		width: screenWidth * 0.9,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	signatureText: {
		marginTop: screenHeight * 0.075,
		marginBottom: screenHeight * 0.01,
		alignItems: 'flex-start',
		width: screenWidth * 0.9,
		alignSelf: 'center',
	},
	signatureBox: {
		width: screenWidth * 0.9,
		height: screenHeight * 0.13,
		borderColor: colors.lightBlue,
		borderWidth: 3,
		borderRadius: 25,
		backgroundColor: colors.white,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	imageStyle: {
		width: (screenWidth * 0.9) - 3,
		height: (screenHeight * 0.13) - 3,
		borderRadius: 25,
	},
	emailConfirmationStyle: {
		width: screenWidth * 0.9,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignSelf: 'center',
		alignItems: 'center',
		marginTop: screenHeight * 0.05,
	},
	leftSpacer: {
		marginLeft: screenWidth * 0.05,
		marginTop: screenHeight * 0.015,
	},
	spacer: {
		height: screenHeight * 0.01,
	},
	buttonContainer: {
		alignSelf: 'center',
		marginTop: screenHeight * 0.05,
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
