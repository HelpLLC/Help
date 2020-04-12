//This style will be used on the service card
import colors from '../../colors';
 
import { screenWidth, screenHeight } from 'config/dimensions';


export default {
    style: {
        width: (screenWidth) * 0.7,
        marginTop: screenHeight * 0.025,
        height: (screenHeight) * 0.135,
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderColor: colors.lightBlue,
        borderWidth: 1.5,
        borderRadius: (screenHeight * 0.01)
    }
}