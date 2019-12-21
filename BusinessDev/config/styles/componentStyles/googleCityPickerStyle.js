//This will contain all of the styles used in the GoogleCityPicker component
import colors from '../../colors';
import { Dimensions } from 'react-native';

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
		width: Dimensions.get('window').width * 0.6
	},
	//The style that contains the results of the entered text
	listView: {
		height: Dimensions.get('window').height * 0.2,
		borderColor: colors.lightBlue,
		marginTop: Dimensions.get('window').height * 0.01,
		borderRadius: 20,
		borderWidth: 3,
		width: Dimensions.get('window').width * 0.6,
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
