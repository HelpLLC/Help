//This will contain the stylings for the createServiceScreen
import { StyleSheet } from 'react-native';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';

export default StyleSheet.create({
	imageSection: {
		justifyContent: 'space-evenly',
		flexDirection: 'column',
		marginTop: screenHeight * 0.025,
		alignItems: 'center',
	},
	imagePicker: {
		alignSelf: 'center',
		width: screenWidth * 0.25,
		marginBottom: screenHeight * 0.02,
		height: screenWidth * 0.25,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: colors.lightBlue,
		borderWidth: (screenWidth * 0.25) / 17,
		borderRadius: (screenWidth * 0.25) / 2,
		backgroundColor: colors.white,
	},
	inputSection: {
		width: screenWidth * 0.85,
		alignItems: 'flex-start',
		alignSelf: 'center',
	},
	inputTitleStyle: {
		marginVertical: screenHeight * 0.015,
	},
	serviceDurationRow: {
		flexDirection: 'row',
		width: screenWidth * 0.85,
		justifyContent: 'flex-start',
		alignItems: 'center',
		alignSelf: 'flex-start'
	},
	hoursText: {
		marginHorizontal: screenWidth * 0.05
	},
	pickerStyle: {
		borderRadius: 20,
		marginHorizontal: screenWidth * 0.05,
		paddingLeft: 10,
		width: screenWidth * 0.22,
		height: screenHeight * 0.06,
		backgroundColor: colors.white,
		borderColor: colors.lightBlue,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 5,
		shadowOpacity: 10,
		justifyContent: 'center',
		shadowColor: colors.lightBlue,
		borderWidth: 3,
	},
	buttonSection: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: screenHeight * 0.1,
	},
});
