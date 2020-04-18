//The styles for the top banner component
import React from 'react';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	entireTopBanner: {
		height: screenHeight * 0.1,
		width: screenWidth,
		paddingTop: screenHeight * 0.035,
		alignItems: 'center',
		backgroundColor: colors.lightBlue,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	textStyle: {
		...fontStyles.bigTextStyleWhite,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		flex: 10,
	},
	rightComponent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
		paddingRight: screenWidth * 0.05,
	},
	leftComponent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: screenWidth * 0.05,
	},
});
