//This style will be used on the service card
import colors from '../../colors';
import { Dimensions } from 'react-native';


export default {
    style: {
        width: (Dimensions.get('window').width) * 0.7,
        marginTop: Dimensions.get('window').height * 0.025,
        height: (Dimensions.get('window').height) * 0.135,
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderColor: colors.lightBlue,
        borderWidth: 1.5,
        borderRadius: (Dimensions.get('window').height * 0.01)
    }
}