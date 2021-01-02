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

	MainTabContainer: {
		width: '100%',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: colors.blue,
		borderTopWidth: 1,
		borderTopColor: colors.white,
		marginBottom: 15,
	},
	TabContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
	},
	TabText: {
		...fontStyles.mainTextStyle,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	SelectedTab: {
		backgroundColor: colors.white,
	},
	SelectedTabText: {
		color: colors.blue,
	},
	UnselectedTab: {
		backgroundColor: colors.blue,
	},
	UnselectedTabText: {
		color: colors.white,
	},

	ListContainer: {
		flex: 1,
		marginHorizontal: 10,
		marginTop: 15,
	},
	ItemContainer: {
		borderColor: colors.green,
		borderWidth: 2,
		borderRadius: 10,
		flexDirection: 'column',
		paddingTop: 10,
		paddingBottom: 15,
		paddingHorizontal: 10,
		width: screenWidth - 2 * 10,
		marginBottom: 15,
	},
	RowContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	ColumnContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	RequestTitle: {
		...fontStyles.biggerTextStyle,
		color: colors.darkBlue,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	RequestText: {
		...fontStyles.bigTextStyle,
		color: colors.darkBlue,
		fontWeight: 'bold',
		marginVertical: 3,
	},
	RequestIcon: {
		width: '100%',
		height: '100%',
	},
	IconContainer: {
		borderColor: colors.white,
		borderWidth: 1,
		borderRadius: 10,
		overflow: 'hidden',
	},
});
