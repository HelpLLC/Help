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
		shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 5,
        shadowOpacity: 10,
		shadowColor: colors.lightBlue,
		alignItems: 'center',
		flexDirection: 'row',
		borderWidth: 3,
	},
	textInputStyle: {
		...fontStyles.subTextStyle,
		...fontStyles.black,
		paddingLeft: 10,
	},
});
