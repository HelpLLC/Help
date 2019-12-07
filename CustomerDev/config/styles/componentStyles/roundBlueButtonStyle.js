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

    //Smaller sized button
    SmallSizeButton: {
        backgroundColor: colors.lightBlue,
        width: (Dimensions.get('window').width * 0.278),
        height: (Dimensions.get('window').height * 0.05),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: (Dimensions.get('window').height * 0.0512)
    },

};
