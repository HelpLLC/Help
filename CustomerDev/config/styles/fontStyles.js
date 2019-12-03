//This class will represent all the font styles that should be used throughout the application
//This includes font families, sizes, and colors.
import colors from '../colors';
import { StyleSheet, Platform, PixelRatio } from 'react-native';

//Gets the correct font based on either iOS or Android
const font = 'Arial Rounded MT Bold';

//Sets the font size
let baseFontSize = (Platform.OS === 'android' ? 20 : 18);
const pixelRatio = PixelRatio.get();
if (pixelRatio < 3) {
    baseFontSize = (Platform.OS === 'android' ? 16 : 14.4);
}

const bigFontSize = baseFontSize * 1.2;
const subTextFontSize = baseFontSize * 0.9;
const bigTitleFontSize = baseFontSize * 4.4;

export default StyleSheet.create({

    //The style for all big text that will be colored black
    bigTextStyleBlack: {
        fontFamily: font,
        fontSize: bigFontSize,
        color: colors.black
    },

    //The style for all big text that will be colored white
    bigTextStyleWhite: {
        fontFamily: font,
        fontSize: bigFontSize,
        color: colors.white
    },

    //The style for all big text that will be colored blue
    bigTextStyleBlue: {
        fontFamily: font,
        fontSize: bigFontSize,
        color: colors.lightBlue
    },

    //The style for main text that will be colored black
    mainTextStyleBlack: {
        fontFamily: font,
        fontSize: baseFontSize,
        color: colors.black
    },

    //The style for main text that will be colored blue
    mainTextStyleBlue: {
        fontFamily: font,
        fontSize: baseFontSize,
        color: colors.lightBlue
    },

    //The style for main text that will be colored white
    mainTextStyleWhite: {
        fontFamily: font,
        fontSize: baseFontSize,
        color: colors.white
    },

    //The style for main text that will be colored gray
    mainTextStyleGray: {
        fontFamily: font,
        fontSize: baseFontSize,
        color: colors.gray
    },

    //The style for main text that will be colored red
    mainTextStyleRed: {
        fontFamily: font,
        fontSize: baseFontSize,
        color: colors.red
    },

    //The style for all non-main text that is black
    subTextStyleBlack: {
        fontFamily: font,
        fontSize: subTextFontSize,
        color: colors.black
    },

    //The style for all non-main text that is blue
    subTextStyleBlue: {
        fontFamily: font,
        fontSize: subTextFontSize,
        color: colors.lightBlue
    },

    //The style for all non-main text that is red
    subTextStyleRed: {
        fontFamily: font,
        fontSize: subTextFontSize,
        color: colors.red
    },

    //The style for all non-main text that is gray
    subTextStyleGray: {
        fontFamily: font,
        fontSize: subTextFontSize,
        color: colors.gray
    },

    //The style for all non-main text that is white
    subTextStyleWhite: {
        fontFamily: font,
        fontSize: subTextFontSize,
        color: colors.white
    },

    //The style for the tab label at the bottom of the screens
    tabLabelStyle: {
        fontFamily: font,
        fontSize: subTextFontSize
    },

    //The style for the text on the button on the report issue screen
    reportIssueButtonTextStyle: {
        fontFamily: font,
        fontSize: baseFontSize * 1.5,
        color: colors.white
    },

    //The style for all big blue title texts
    bigTitleStyleBlue: {
        fontFamily: font,
        fontSize: bigTitleFontSize,
        color: colors.lightBlue
    },

    //The style for all big white title texts
    bigTitleStyleWhite: {
        fontFamily: font,
        fontSize: bigTitleFontSize,
        color: colors.white
    },

});