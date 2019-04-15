//This will be the style used by the top banner
import colors from '../../colors';
import { Dimensions } from 'react-native';

export default {
    style: {
        height: 83.5,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
    }
}