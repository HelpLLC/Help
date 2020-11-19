import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    Body:{
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.white,
        height: '100%'
    },

    ContentContainer:{
        flexGrow:1
    },
    OptionContainer:{
        flexDirection: 'row',
        width:screenWidth + 4,
        height: 60,
        padding: 10,
        alignItems:'center',
        borderWidth: 2,
        marginBottom: -2,
    },
    OptionNormal:{
        borderColor: colors.blue,
        justifyContent:'space-between'
    },
    OptionText:{
        color: colors.darkBlue,
        fontWeight:'bold',
        marginLeft: 5,
    },
})