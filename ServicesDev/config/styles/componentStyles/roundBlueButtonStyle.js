//This will be the style for the round blue button component
import colors from '../../colors';
export default {

    //The button that appears in the splash screen of the app
    MainScreenButton: {
        backgroundColor: colors.lightBlue,
        margin: 10,
        borderRadius: 37,
        paddingTop: 21,
        paddingBottom: 21,
        paddingRight: 12,
        paddingLeft: 12
    },

    //Default button size to use
    MediumSizeButton: {
        backgroundColor: colors.lightBlue,
        width: 160,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35
    },

    //These are two buttons that will determine the type of account the user wants
    AccountTypeButton: {
        backgroundColor: colors.white,
        width: 140,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2.5,
        borderRadius: 30
    },

    //The round button that appears in the business screen in the provider screens and has a plus
    BusinessScreenPlusButton: {
        backgroundColor: colors.lightBlue,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },

};
