import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	Body: {
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: colors.white,
		height: '100%',
	},
	Content:{
		flexDirection: 'column',
		backgroundColor: colors.white,
		height: '100%',
		padding: 10,
	},
	Column:{
		flexDirection: 'column',
	},
	Row:{
		flexDirection: 'row',
	},

	SectionContainer:{
		marginVertical: 10,
		width: '100%',
		height: 250,
		// flex: 1,
		overflow: 'visible',
	},
	SectionHeading:{
		...fontStyles.bigTextStyle,
		color: colors.darkBlue,
		fontWeight: 'bold',
		marginRight: 20,
	},

	AlertContainer:{
		width:"100%",
		borderWidth:2,
		borderColor: colors.blue,
		borderRadius:20,
		padding: 8,
		backgroundColor: colors.white,
	},
	AlertHeading:{
		...fontStyles.mainTextStyle,
		color: colors.darkBlue,
		fontWeight: 'bold',
		marginLeft: 5,
	},
	AlertBody:{
		...fontStyles.mainTextStyle,
		color: colors.darkBlue,
		height: 50,
	},
	RecievedText:{
		...fontStyles.mainTextStyle,
		color: colors.blue,
	},
	ContinuedText:{
		...fontStyles.bigTextStyle,
		color: colors.darkBlue,
		fontWeight: 'bold',
		marginLeft: 5,
		marginTop:-5
	},
});
