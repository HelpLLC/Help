import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    NotifSection: {
        
    },
    NotifSectionTitle: {
        flexDirection: 'row',
    },
    NotifTypeText: {
        ...fontStyles.biggerTextStyle,
        fontWeight:'bold',
        color:colors.darkBlue,
    },
    NotifNumText: {
        ...fontStyles.biggerTextStyle,
        color:colors.white,
        borderRadius: 100,
        backgroundColor: colors.green,
    },
});