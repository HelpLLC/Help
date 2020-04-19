//This is going to contain the styles for the Help Button
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	//Default button size to use
	BlueButton: {
		height: screenHeight * 0.0878,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		borderRadius: screenHeight * 0.0512,
	},

	//Default button size to use but the red version
	RedButton: {
		height: screenHeight * 0.0878,
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: colors.red,
		justifyContent: 'center',
		borderRadius: screenHeight * 0.0512,
	},

	//These are two buttons that will determine the type of account the user wants
	LightButton: {
		height: screenHeight * 0.0878,
		alignItems: 'center',
		backgroundColor: colors.white,
		borderColor: colors.lightBlue,
		justifyContent: 'center',
		alignSelf: 'center',
		borderWidth: 2.5,
		borderRadius: screenHeight * 0.0512,
	},

	//The style for a perfect round button that is small
	CircleBlueButton: {
		height: screenHeight * 0.0732,
		width: screenHeight * 0.0732,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: (screenHeight * 0.0732) / 2,
	},
});
