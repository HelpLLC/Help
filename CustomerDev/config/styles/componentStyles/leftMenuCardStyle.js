import colors from 'config/colors';
 
import { screenWidth, screenHeight } from 'config/dimensions';

export default {
    mainStyle: {
        height: screenHeight * 0.075,
        width: screenWidth * 0.55,
        marginRight: screenWidth * 0.07,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    mainStyleWithBorderBottom: {
        height: screenHeight * 0.075,
        width: screenWidth * 0.55,
        marginRight: screenWidth * 0.07,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: colors.black
    }
}