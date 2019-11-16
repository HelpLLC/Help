//This will be the style for the round blue button component
import colors from '../../colors';
import { Dimensions } from 'react-native';
export default {

    //Default button size to use
    MediumSizeButton: {
        backgroundColor: colors.lightBlue,
        width: (Dimensions.get('window').width * 0.39),
        height: (Dimensions.get('window').height * 0.0878),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: (Dimensions.get('window').height * 0.0512)
    },

    //Default button size to use but the red version
    MediumSizeButtonRed: {
        backgroundColor: colors.red,
        width: (Dimensions.get('window').width * 0.39),
        height: (Dimensions.get('window').height * 0.0878),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: (Dimensions.get('window').height * 0.0512)
    },

    //These are two buttons that will determine the type of account the user wants
    AccountTypeButton: {
        backgroundColor: colors.white,
        width: (Dimensions.get('window').width * 0.34),
        height: (Dimensions.get('window').height * 0.0585),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2.5,
        borderRadius: (Dimensions.get('window').height * 0.04392)
    },

    //The round button that appears in the business screen in the provider screens and has a plus
    BusinessScreenPlusButton: {
        backgroundColor: colors.lightBlue,
        width: (Dimensions.get('window').height * 0.0732),
        height: (Dimensions.get('window').height * 0.0732),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: (Dimensions.get('window').height * 0.0732) / 2
    },

};
