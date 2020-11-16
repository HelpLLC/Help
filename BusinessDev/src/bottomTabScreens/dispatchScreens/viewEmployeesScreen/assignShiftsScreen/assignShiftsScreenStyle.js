import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    PopupContainer: {
        backgroundColor: colors.gray + '70',
        width: screenWidth,
        height: screenHeight,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    PopupTextContainer: {
        backgroundColor: colors.blue,
        width: screenWidth * 0.75,
        padding: 20,
        borderRadius: 15,
        flexDirection: 'column',
        alignItems: 'center',
    },
    PopupTitle: {
        ...fontStyles.bigTextStyle,
        ...fontStyles.bold,
        ...fontStyles.white,
        textAlign:'center',
    },
    PopupText: {
        ...fontStyles.mainTextStyle,
        ...fontStyles.white,
        marginVertical: 15,
        textAlign: 'center',
        lineHeight: screenHeight * 0.03,
    },
    PopupDetails: {
        ...fontStyles.bigTextStyle,
        ...fontStyles.bold,
        ...fontStyles.white,
        marginVertical: 5,
        textAlign: 'center',
    },
});