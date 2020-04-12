//This will contain all of the styles used in the GoogleCityPicker component
import colors from '../../colors';
 
import { screenWidth, screenHeight } from 'config/dimensions';

export default {
	//The style for the container itself
	textInputContainer: {
		borderWidth: 3,
		borderColor: colors.lightBlue,
		borderTopWidth: 3,
		paddingBottom: 43.55, //Has to be exact amouunt due to wonky component styles
		borderBottomWidth: 3,
		borderTopColor: colors.lightBlue,
		borderBottomColor: colors.lightBlue,
		borderRadius: 20,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: colors.white,
		width: screenWidth * 0.8
	},
	//The style that contains the results of the entered text
	listView: {
		height: screenHeight * 0.2,
		borderColor: colors.lightBlue,
		marginTop: screenHeight * 0.01,
		borderRadius: 20,
		borderWidth: 3,
		width: screenWidth * 0.8,
		backgroundColor: colors.white
	},
	//The style that renders the "powered by Google" image
	powered: {
		height: 0,
		width: 0
	},
	//The style that renders each row that has a city
	row: {
		borderBottomColor: colors.lightGray,
		borderBottomWidth: 1
	}
};
