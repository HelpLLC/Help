//This style will be used on the service card
import colors from '../../colors';
import { Dimensions } from 'react-native';


export default {
   style: {
      width: (Dimensions.get('window').width) * 0.5,
      height: (Dimensions.get('window').height * 0.275),
      flexDirection: 'column',
      backgroundColor: colors.white,
      borderColor: colors.lightBlue,
      maxHeight: 240,
      borderWidth: 6,
      borderRadius: (Dimensions.get('window').height * 0.0439238653)
   }
}