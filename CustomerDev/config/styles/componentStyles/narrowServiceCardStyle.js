//This style will be used on the service card
import colors from '../../colors';
import { screenWidth, screenHeight } from 'config/dimensions';
 


export default {
    style: {
        width: (screenWidth) * 0.45,
        height: (screenHeight * 0.3),
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderColor: colors.lightBlue,
        borderWidth: 3.5,
        borderRadius: (screenHeight * 0.0439238653)
    }
}