//This is going to contain the styles for the Help Button
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../../config/dimensions';
import colors from '../../config/colors';

export default StyleSheet.create({
	//Default button size to use
	MainButton: {
		height: screenHeight * 0.0878,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
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
