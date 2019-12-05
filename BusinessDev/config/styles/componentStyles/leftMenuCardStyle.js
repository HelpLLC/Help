import colors from 'config/colors';
import { Dimensions } from 'react-native';

export default {
    mainStyle: {
        height: Dimensions.get('window').height * 0.075,
        width: Dimensions.get('window').width * 0.55,
        marginRight: Dimensions.get('window').width * 0.07,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    mainStyleWithBorderBottom: {
        height: Dimensions.get('window').height * 0.075,
        width: Dimensions.get('window').width * 0.55,
        marginRight: Dimensions.get('window').width * 0.07,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: colors.black
    }
}