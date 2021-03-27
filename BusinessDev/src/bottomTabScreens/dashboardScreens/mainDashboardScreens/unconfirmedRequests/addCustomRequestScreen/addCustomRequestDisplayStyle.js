import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    Body:{
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.white,
        height: screenHeight
    },

    MainContainer:{
        height:screenHeight - 80 - (screenHeight * 0.135)
    },

    RequestDetailsContainer:{
        alignSelf:'stretch'
    },
    ButtonContainer:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colors.white,
        paddingVertical:10,
        height:70,
        width:'100%',
        paddingHorizontal: (screenWidth - 200) / 2,
    },
    Button:{

    },

    Footer:{
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray
    }
})