//This class will represent all the font styles that should be used throughout the application
//This includes font families, sizes, and colors.
import colors from '../colors';
import { StyleSheet, Platform, PixelRatio } from 'react-native';
import { screenWidth, screenHeight } from '../dimensions';

//Gets the correct font based on either iOS or Android
const font = 'Lucida Grande';

//Sets the font size
let baseFontSize = Platform.OS === 'android' ? 20 : 18;
const pixelRatio = PixelRatio.get();
if (pixelRatio < 3) {
	baseFontSize = Platform.OS === 'android' ? 16 : 14.4;
}

const bigFontSize = baseFontSize * 1.2;
const smallTextFontSize = baseFontSize * 0.6;
const subTextFontSize = baseFontSize * 0.9;
const subTitleFontSize = baseFontSize * 2.2;
const bigTitleFontSize = baseFontSize * 4.4;

export default StyleSheet.create({
	//The style for all big text style
	bigTextStyle: {
		fontFamily: font,
		fontSize: bigFontSize,
	},

	//The style for all small text style
	smallTextStyle: {
		fontFamily: font,
		fontSize: smallTextFontSize,
	},

	//The style for all sub text style
	subTextStyle: {
		fontFamily: font,
		fontSize: subTextFontSize,
	},

	//The style for all the main text style
	mainTextStyle: {
		fontFamily: font,
		fontSize: baseFontSize,
	},

	//The style for all the big subtitle text style
	bigSubTitleStyle: {
		fontFamily: font,
		fontSize: subTitleFontSize,
	},

	//The style for all the big title text style
	bigTitleStyle: {
		fontFamily: font,
		fontSize: bigTitleFontSize,
	},

	/* The colors for all the different fonts*/
	lightGray: {
		color: colors.lightGray,
	},

	white: {
		color: colors.white,
	},

	lightBlue: {
		color: colors.lightBlue,
	},

	darkBlue: {
		color: colors.darkBlue,
	},

	blue: {
		color: colors.blue,
	},

	black: {
		color: colors.black,
	},

	red: {
		color: colors.red,
	},

	gray: {
		color: colors.gray,
	},

	green: {
		color: colors.green,
	},

	/*The different font stylings*/
	bold: {
		fontWeight: 'bold',
	},
});
