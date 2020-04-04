//This style will represent the style for the chat card component
import colors from '../../colors';
 
import { screenWidth, screenHeight } from 'config/dimensions';

export default {
    style: {
        width: screenWidth * 0.9,
        backgroundColor: colors.white,
        flexDirection: 'row',
        height: (screenHeight * 0.12),
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: colors.lightGray,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 1
    }
}