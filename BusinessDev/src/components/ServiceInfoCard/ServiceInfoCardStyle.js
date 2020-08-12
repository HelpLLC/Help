import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';

export default {
    infoCard: {
        marginTop: screenHeight * 0.02,
        width: screenWidth * 0.93,
        height: screenHeight * 0.15,
        flexDirection: 'row',
        borderColor: colors.green,
		borderWidth: 2,
        borderRadius: 20,
    },
    serviceText: {
        flex: 1.5,
        alignSelf: 'center',
    },
    nameText: {
        ...fontStyles.bigTextStyle,
        ...fontStyles.darkBlue,
        ...fontStyles.bold,
        marginLeft: screenWidth * 0.05,
        marginTop: screenHeight * 0.007,
        marginBottom: screenHeight * 0.007,
    },
    text: {
        ...fontStyles.mainTextStyle,
        ...fontStyles.darkBlue,
        ...fontStyles.bold,
        marginLeft: screenWidth * 0.05,
        marginTop: screenHeight * 0.007,
        marginBottom: screenHeight * 0.007,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    }
};