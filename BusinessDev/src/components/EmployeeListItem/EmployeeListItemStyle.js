import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';

export default {
    listItem: {
        marginTop: screenHeight * 0.02,
        width: screenWidth * 0.93,
        height: screenHeight * 0.13,
        flexDirection: 'row',
        borderColor: colors.green,
		borderWidth: 2,
        borderRadius: 20,
    },
    row: {
        flex: 1,
        alignItems: 'center',
    },
    profileImage: {
        marginLeft: screenWidth * 0.04,
        width: screenWidth * 0.22,
        resizeMode: 'contain',
        flex: 1,
    },
    nameText: {
        ...fontStyles.mainTextStyle,
        ...fontStyles.darkBlue,
        ...fontStyles.bold,
        marginTop: screenHeight * 0.03,
    },
    button: {
        alignItems: 'center',
        marginTop: screenHeight * 0.01,
    },
};