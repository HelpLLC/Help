import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';

export default {
    unconfirmedInfoCard: {
        marginTop: screenHeight * 0.02,
        width: screenWidth * 0.93,
        height: screenHeight * 0.18,
        flexDirection: 'column',
        borderColor: colors.green,
		borderWidth: 2,
        borderRadius: 20,
    },
    unconfirmedText: {
        flex: 2,
    },
    nameText: {
        ...fontStyles.bigTextStyle,
        ...fontStyles.darkBlue,
        ...fontStyles.bold,
        marginLeft: screenWidth * 0.07,
        marginTop: screenHeight * 0.015,
        marginBottom: screenHeight * 0.006,
    },
    text: {
        ...fontStyles.mainTextStyle,
        ...fontStyles.darkBlue,
        ...fontStyles.bold,
        marginLeft: screenWidth * 0.07,
        marginTop: screenHeight * 0.006,
        marginBottom: screenHeight * 0.006,
    },
    statusButtons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    requestButton: {
        marginLeft: screenWidth * 0.1,
        marginRight: screenWidth * 0.1,
    }
};