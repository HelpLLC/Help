//This style will represent the style for the chat card component
import colors from '../../colors';
import { Dimensions } from 'react-native'

export default {
    style: {
        width: Dimensions.get('window').width,
        backgroundColor: colors.white,
        flexDirection: 'row',
        height: (Dimensions.get('window').height * 0.12),
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: colors.lightGray,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 1
    }
}