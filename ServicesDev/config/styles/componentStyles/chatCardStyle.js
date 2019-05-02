//This style will represent the style for the chat card component
import colors from '../../colors';
import { Dimensions } from 'react-native'

export default {
    style: {
        width: Dimensions.get('window').width,
        backgroundColor: colors.white,
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    }
}