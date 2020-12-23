// This is going to be the StyleSheet for the confirmPaymentScreen
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	AddServiceButton: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: screenHeight * 0.05,
	},
	ServiceCard: {
		width: screenWidth * 0.95,
		height: screenHeight * 0.25,
		borderColor: colors.lightBlue,
		borderWidth: 3,
		borderRadius: 25,
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center',
		marginTop: screenHeight * 0.05,
	},
	imageStyle: {
		width: screenWidth * 0.4 - 3,
		height: screenHeight * 0.13 - 3,
		borderRadius: 25,
	},
	TextPlusButton: {
		marginTop: screenHeight * 0.05,
		marginLeft: screenWidth * 0.05,
	},
	MiddleText: {
		marginTop: screenHeight * 0.03,
	},
	ImageandTitle: {
		marginLeft: screenWidth * -0.1,
		marginTop: screenHeight * 0.02,
	},
	BottomSpacer: {
		marginBottom: screenHeight * 0.02,
	},
	RightSpacer: {
		marginRight: screenWidth * 0.02,
	},
	TopSpacer: {
		marginTop: screenHeight * 0.005,
	},
	EditButton: {
		marginRight: screenWidth * -0.3,
	},
});
