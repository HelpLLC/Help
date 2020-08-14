import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import { color } from 'react-native-reanimated';

export default StyleSheet.create({
    body: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: screenHeight * 0.025,
        width: screenWidth * 0.9,
    },
    button: {
        alignItems: 'center',
        marginTop: screenHeight * 0.01,
    }
})