//This is the styles for the HelpTextInput component
import { StyleSheet } from 'react-native';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';

export default StyleSheet.create({
	textInputContainerStyle: {
		borderRadius: 20,
		backgroundColor: colors.white,
		borderColor: colors.lightBlue,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderWidth: 3,
	},
	textInputStyle: {
		...fontStyles.subTextStyle,
		...fontStyles.black,
		alignSelf: 'stretch',
		paddingLeft: 10,
	},
});
