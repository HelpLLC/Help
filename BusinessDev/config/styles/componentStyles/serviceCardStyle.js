//This style will be used on the service card
import colors from '../../colors';
import { screenWidth, screenHeight } from 'config/dimensions';
 


export default {
    style: {
        width: screenWidth - 40,
        height: (screenHeight * 0.21961933),
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderColor: colors.lightBlue,
        borderWidth: 6,
        borderRadius: (screenHeight * 0.0439238653)
    }
}