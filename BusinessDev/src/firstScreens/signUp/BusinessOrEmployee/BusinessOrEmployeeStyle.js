// This is going to contain the StyleSheet for the BusinessOrEmployee screen
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';

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
	businessButton: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	employeeButton: {
		flexDirection: 'row',
		marginTop: screenHeight * 0.025,
		justifyContent: 'center',
	},
});
