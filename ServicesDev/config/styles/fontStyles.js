//This class will represent all the font styles that should be used throughout the application
//This includes font families, sizes, and colors.
import colors from '../colors';
import { StyleSheet, Platform } from 'react-native';

//Gets the correct font based on either iOS or Android
const font = (Platform.OS === 'ios' ? 'arialrounded' : 'sans-serif-medium');
export default StyleSheet.create({

    //The style for all big text that will be colored black
    bigTextStyleBlack: {
        fontFamily: font,
        fontSize: 24,
        color: colors.black
    },

    //The style for all big text that will be colored white
    bigTextStyleWhite: {
        fontFamily: font,
        fontSize: 24,
        color: colors.white
    },

    //The style for all big text that will be colored blue
    bigTextStyleBlue: {
        fontFamily: font,
        fontSize: 24,
        color: colors.lightBlue
    },

    //The style for main text that will be colored black
    mainTextStyleBlack: {
        fontFamily: font,
        fontSize: 20,
        color: colors.black
    },

    //The style for main text that will be colored blue
    mainTextStyleBlue: {
        fontFamily: font,
        fontSize: 20,
        color: colors.lightBlue
    },

    //The style for main text that will be colored white
    mainTextStyleWhite: {
        fontFamily: font,
        fontSize: 20,
        color: colors.white
    },

    //The style for main text that will be colored gray
    mainTextStyleGray: {
        fontFamily: font,
        fontSize: 20,
        color: colors.gray
    },

    //The style for main text that will be colored red
    mainTextStyleRed: {
        fontFamily: font,
        fontSize: 20,
        color: colors.red
    },

    //The style for all non-main text that is black
    subTextStyleBlack: {
        fontFamily: font,
        fontSize: 16,
        color: colors.black
    },

    //The style for all non-main text that is blue
    subTextStyleBlue: {
        fontFamily: font,
        fontSize: 16,
        color: colors.lightBlue
    },

    //The style for all non-main text that is red
    subTextStyleRed: {
        fontFamily: font,
        fontSize: 16,
        color: colors.red
    },

    //The style for all non-main text that is gray
    subTextStyleGray: {
        fontFamily: font,
        fontSize: 16,
        color: colors.gray
    },

    //The style for all non-main text that is white
    subTextStyleWhite: {
        fontFamily: font,
        fontSize: 16,
        color: colors.white
    },

    //The style for the tab label at the bottom of the screens
    tabLabelStyle: {
        fontFamily: font,
        fontSize: 16
    },

    //The style for the text on the button on the report issue screen
    reportIssueButtonTextStyle: {
        fontFamily: font,
        fontSize: 30,
        color: colors.white
    },

    //The style for all big blue title texts
    bigTitleStyleBlue: {
        fontFamily: font,
        fontSize: 88,
        color: colors.lightBlue
    },

});