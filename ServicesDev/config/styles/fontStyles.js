//This class will represent all the font styles that should be used throughout the application
//This includes font families, sizes, and colors.
import colors from '../colors';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({

    //The style for all big text that will be colored black
    bigTextStyleBlack: {
        fontFamily: 'arialrounded',
        fontSize: 24,
        color: colors.black
    },

    //The style for all big text that will be colored white
    bigTextStyleWhite: {
        fontFamily: 'arialrounded',
        fontSize: 24,
        color: colors.white
    },

    //The style for all big text that will be colored blue
    bigTextStyleBlue: {
        fontFamily: 'arialrounded',
        fontSize: 24,
        color: colors.lightBlue
    },

    //The style for main text that will be colored black
    mainTextStyleBlack: {
        fontFamily: 'arialrounded',
        fontSize: 20,
        color: colors.black
    },

    //The style for main text that will be colored blue
    mainTextStyleBlue: {
        fontFamily: 'arialrounded',
        fontSize: 20,
        color: colors.lightBlue
    },

    //The style for main text that will be colored white
    mainTextStyleWhite: {
        fontFamily: 'arialrounded',
        fontSize: 20,
        color: colors.white
    },

    //The style for main text that will be colored gray
    mainTextStyleGray: {
        fontFamily: 'arialrounded',
        fontSize: 20,
        color: colors.gray
    },

    //The style for main text that will be colored red
    mainTextStyleRed: {
        fontFamily: 'arialrounded',
        fontSize: 20,
        color: colors.red
    },

    //The style for all non-main text that is black
    subTextStyleBlack: {
        fontFamily: 'arialrounded',
        fontSize: 16,
        color: colors.black
    },

    //The style for all non-main text that is blue
    subTextStyleBlue: {
        fontFamily: 'arialrounded',
        fontSize: 16,
        color: colors.lightBlue
    },

    //The style for all non-main text that is red
    subTextStyleRed: {
        fontFamily: 'arialrounded',
        fontSize: 16,
        color: colors.red
    },

    //The style for all non-main text that is gray
    subTextStyleGray: {
        fontFamily: 'arialrounded',
        fontSize: 16,
        color: colors.gray
    },

    //The style for all non-main text that is white
    subTextStyleWhite: {
        fontFamily: 'arialrounded',
        fontSize: 16,
        color: colors.white
    },

    //The style for the tab label at the bottom of the screens
    tabLabelStyle: {
        fontFamily: 'arialrounded',
        fontSize: 16
    },

    //The style for the text on the button on the report issue screen
    reportIssueButtonTextStyle: {
        fontFamily: 'arialrounded',
        fontSize: 30,
        color: colors.white
    },

    //The style for all big blue title texts
    bigTitleStyleBlue: {
        fontFamily: 'arialrounded',
        fontSize: 88,
        color: colors.lightBlue
    },

});