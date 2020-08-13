// This file will contain the splash screen StyleSheet
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';

export default StyleSheet.create({
	logoImage: {
		width: screenWidth * 0.8,
		resizeMode: 'contain',
	},
	logoImageContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	buttonsContainer: {
		flex: 1,
	},
	getStartedContainer: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	logInContainer: {
		flexDirection: 'row',
		marginTop: screenHeight * 0.025,
		justifyContent: 'center',
	},
});
