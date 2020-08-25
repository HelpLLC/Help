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
    
    Header:{
        width:'100%',
        height:80,
        backgroundColor:colors.lightBlue
    },

    ContentContainer:{
        flexGrow:1
    },
    MainContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding:15,
        width: '100%',
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

    MainText:{
        color: colors.darkBlue,
        fontWeight:'bold',
        margin:10,
        flexShrink:1,
    },
    OptionText:{
        color: colors.darkBlue,
        fontWeight:'bold',
        marginLeft: 5,
    },

    LogoutPositioning:{
        position:'absolute',
        bottom:20,
    },
    LogoutContainer:{
        borderColor: colors.red,
        justifyContent:'flex-start',
    },
    LogoutText:{
        color: colors.red,
    },

    Footer:{
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray
    }
})