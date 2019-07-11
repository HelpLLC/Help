//This will be the style used by the top banner
import colors from '../../colors';
import { Dimensions } from 'react-native';

export default {
    style: {
        height: (Dimensions.get('window').height * 0.12),
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
    }
}