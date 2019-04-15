//This style will be used on the service card
import colors from '../../colors';
import { Dimensions } from 'react-native';


export default {
    style: {
        width: Dimensions.get('window').width - 40,
        height: 150,
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderColor: colors.lightBlue,
        borderWidth: 6,
        borderRadius: 30
    }
}