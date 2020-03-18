//This will contain the styles that are used in the component "HelpSearchBar". It contains the container style and the input
//container style
import colors from '../../colors';
import { screenWidth, screenHeight } from 'config/dimensions';

export default {
    containerStyle: {
        backgroundColor: colors.lightBlue,
        borderRadius: 30,
        borderBottomColor: colors.lightBlue,
        borderTopColor: colors.lightBlue
    },
    inputContainerStyle: {
        backgroundColor: colors.white,
        borderRadius: 20
    }
}