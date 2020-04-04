//This will be the style for the round blue button component
import colors from '../../colors';
 
import { screenWidth, screenHeight } from 'config/dimensions';

export default {
	//Default button size to use
	MediumSizeButton: {
		backgroundColor: colors.lightBlue,
		width: screenWidth * 0.39,
		height: screenHeight * 0.0878,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: screenHeight * 0.0512
	},

	//Smaller sized button
	SmallSizeButton: {
		backgroundColor: colors.lightBlue,
		width: screenWidth * 0.278,
		height: screenHeight * 0.05,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: screenHeight * 0.0512
	},

	//These are two buttons that will determine the type of account the user wants
	AccountTypeButton: {
		backgroundColor: colors.white,
		width: screenWidth * 0.34,
		height: screenHeight * 0.0585,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2.5,
		borderRadius: screenHeight * 0.04392
	}
};
