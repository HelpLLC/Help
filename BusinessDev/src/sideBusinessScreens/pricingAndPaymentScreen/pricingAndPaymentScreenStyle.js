//This is going to contain the styles for the pricing and payment screen
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	pricingTypeSection: {
		marginTop: screenHeight * 0.025,
		marginBottom: screenHeight * 0.025,
		width: screenWidth * 0.85,
		alignSelf: 'center',
	},
	pricingTypeText: {
		marginBottom: screenHeight * 0.015,
	},
	pricingRow: {
		flexDirection: 'row',
		width: screenWidth * 0.85,
		alignSelf: 'center',
		alignItems: 'center',
	},
	dollarSignText: {
		marginRight: screenWidth * 0.025,
	},
	pickerStyle: {
		borderRadius: 20,
		marginLeft: screenWidth * 0.03,
		marginRight: screenWidth * 0.03,
		paddingLeft: 10,
		width: screenWidth * 0.25,
		height: screenHeight * 0.06,
		backgroundColor: colors.white,
		borderColor: colors.lightBlue,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 5,
		shadowOpacity: 10,
		justifyContent: 'center',
		shadowColor: colors.lightBlue,
		borderWidth: 3,
	},
	paymentMethodSection: {
		width: screenWidth * 0.85,
		alignSelf: 'center',
		// borderBottomColor: colors.lightBlue,
		// borderBottomWidth: 2,
		paddingBottom: screenHeight * 0.025,
		marginBottom: screenHeight * 0.025,
	},
	paymentTypeSubText: {
		marginVertical: screenHeight * 0.025,
	},
	buttonSeparator: { height: screenHeight * 0.025 },
	paymentTimeSection: { width: screenWidth * 0.85, alignSelf: 'center' },
	buttonSection: {
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		width: screenWidth,
		position: 'absolute',
		bottom:30,
		paddingHorizontal: 15,
	},
});
