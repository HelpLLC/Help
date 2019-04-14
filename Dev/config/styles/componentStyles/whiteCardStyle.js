//This object will hold all of the styles for the white card component
import colors from '../../colors';
import { Dimensions } from 'react-native';

export default {

    //This is the style for the cards that appear in the settings screen
    settingsCard: {
        height: 45,
        marginBottom: 35,
        width: Dimensions.get('window').width,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    //This is the card that appears in the about section
    aboutScreenCard: {
        height: 45,
        width: Dimensions.get('window').width,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
}