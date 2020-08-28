//The styles for the top banner component
import React from 'react';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	MainContainer:{
		width:screenWidth,
		flexDirection:'column',
		justifyContent:'center',
		paddingTop: 10,
		backgroundColor:colors.white,
	},
	Absolute:{
		position:'absolute',
		bottom:0,
	},
	ConfirmationContainer:{
		borderRadius: 20,
		borderWidth:1,
		borderColor:colors.blue,
		marginVertical:10,
		paddingVertical: 5,
		paddingHorizontal:8,
		alignSelf:'center'
	},
	ConfirmationText:{
		color:colors.darkBlue,
	},
});
