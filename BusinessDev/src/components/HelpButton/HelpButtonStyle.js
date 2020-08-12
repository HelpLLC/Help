//This is going to contain the styles for the Help Button
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	//Default button size to use
	BlueButton: {
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		borderRadius: screenHeight * 0.0186,
	},

	//Default button size to use but the red version
	RedButton: {
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: colors.red,
		justifyContent: 'center',
		borderRadius: screenHeight * 0.0512,
	},

	//These are two buttons that will determine the type of account the user wants
	LightButton: {
		alignItems: 'center',
		backgroundColor: colors.white,
		borderColor: colors.blue,
		justifyContent: 'center',
		alignSelf: 'center',
		borderWidth: 2.5,
		borderRadius: screenHeight * 0.0512,
	},

	//The style for a perfect round button that is small
	CircleBlueButton: {
		width: screenHeight * 0.0732,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: (screenHeight * 0.0732) / 2,
	},
});
