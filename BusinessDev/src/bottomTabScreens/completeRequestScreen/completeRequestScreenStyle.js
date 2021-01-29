import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	Body: {
		flexDirection: 'column',
		alignItems: 'center',
		height: screenHeight,
	},

	MainContainer: {
		height: screenHeight - screenHeight * 0.135,
	},

	FooterContainer: {
		width: screenWidth,
		flexDirection: 'row',
		backgroundColor: colors.blue,
		marginTop: 10,
		paddingVertical: 5,
	},
	CollumnContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
	},
	FooterSubject: {
		...fontStyles.mainTextStyle,
		textAlign: 'center',
		color: colors.white,
		fontWeight: 'bold',
		marginTop: -10,
	},
	FooterCaption: {
		...fontStyles.subTextStyle,
		color: colors.white,
		fontWeight: 'bold',
	},
});
