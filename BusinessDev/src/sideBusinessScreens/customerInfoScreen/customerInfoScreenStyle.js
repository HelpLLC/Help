//This is the styles for the customer info screen
import { StyleSheet } from 'react-native';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';

export default StyleSheet.create({
	customQuestionsContainer: {
		paddingBottom: screenHeight * 0.025,
		borderBottomColor: colors.blue,
		borderBottomWidth: 2,
	},
	customQuestionsText: {
		width: screenWidth * 0.85,
		marginVertical: screenHeight * 0.025,
	},
	textSpacer: {
		height: screenHeight * 0.025,
	},
	defaultQuestionRow: {
		width: screenWidth * 0.85,
		marginBottom: screenHeight * 0.01,
		marginRight: screenHeight * 0.025,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	questionContainer: {
		width: screenWidth * 0.85,
		marginVertical: screenHeight * 0.025,
	},
	textInputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	deleteCustomQuestion: {
		width: screenWidth * 0.2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	questionSpacer: {
		height: screenHeight * 0.015,
	},
	buttonSection: {
		marginVertical: screenHeight * 0.05,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
