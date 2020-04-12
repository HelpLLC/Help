//This object will hold all of the styles for the white card component
import colors from '../../colors';
 
import { screenWidth, screenHeight } from 'config/dimensions';


export default {

    //This is the card that appears in the about section & the settings screen
    whiteCardStyle: {
        height: screenHeight * 0.07,
        width: screenWidth - 30,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
}