//This is the styles for the HelpTextInput component
import { StyleSheet } from 'react-native-web';
import colors from '../../config/colors';
import { screenHeight, screenWidth } from '../../config/dimensions';
import fontStyles from '../../config/fontStyles';

export default {
	textInputContainerStyle: {
		borderRadius: 20,
		backgroundColor: colors.white,
		borderColor: colors.lightBlue,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 5,
		shadowOpacity: 10,
		shadowColor: colors.lightBlue,
		alignItems: 'center',
		flexDirection: 'row',
		borderWidth: 3,
		...fontStyles.subTextStyle,
		...fontStyles.black,
		padding: 10,
	},
};
