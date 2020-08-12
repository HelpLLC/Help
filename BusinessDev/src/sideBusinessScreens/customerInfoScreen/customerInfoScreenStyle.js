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
		marginTop: screenHeight * 0.025,
	},
	textSpacer: {
		height: screenHeight * 0.025,
	},
	checkboxStyle:{
		borderRadius:0,
	},
	addQuestion:{
		alignSelf: 'center',
	},
	contactQuestionRow:{
		marginBottom: -15,
		marginRight: screenHeight * 0.025,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	defaultQuestionRow: {
		width: screenWidth * 0.85,
		marginVertical: screenHeight * 0.005,
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
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		width: '100%',
		position: 'absolute',
		bottom:30,
		paddingHorizontal: 15,
	},
	footer:{
		marginTop:10,
	},
});
