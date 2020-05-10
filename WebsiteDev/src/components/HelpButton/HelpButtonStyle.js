//This is going to contain the styles for the Help Button
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../../config/dimensions';
import colors from '../../config/colors';

export default StyleSheet.create({
	//Default button size to use
	MainButton: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},

	//The style for a perfect round button that is small
	CircleBlueButton: {
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
