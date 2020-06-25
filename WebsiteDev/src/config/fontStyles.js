//This class will represent all the font styles that should be used throughout the application
//This includes font families, sizes, and colors.
import colors from '../config/colors';

//Gets the correct font based on either iOS or Android
const font = 'Lucida Grande';

export default {
	//The style for all big text style
	bigTextStyle: {
		fontFamily: font,
		fontSize: '3vw',
	},

	//The style for all small text style
	smallTextStyle: {
		fontFamily: font,
		fontSize: '1.25vw',
	},

	// The style for all tiny text style
	tinyTextStyle: {
		fontFamily: font,
		fontSize: '0.85vw',
	},

	//The style for all sub text style
	subTextStyle: {
		fontFamily: font,
		fontSize: '1.25vw',
	},

	//The style for all the main text style
	mainTextStyle: {
		fontFamily: font,
		fontSize: '1.75vw',
	},

	//The style for all the big subtitle text style
	bigSubTitleStyle: {
		fontFamily: font,
		fontSize: '4vw',
	},

	//The style for all the big title text style
	bigTitleStyle: {
		fontFamily: font,
		fontSize: '5.5vw',
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
};
