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
        
    },
    MainContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        padding:15
    },
    OptionContainer:{
        flexDirection: 'row',
        borderColor: colors.blue,
        width:screenWidth + 4,
        height: 60,
        padding: 10,
        alignItems:'center',
        borderWidth: 2,
        marginBottom: -2,
        justifyContent:'space-between'
    },

    MainText:{
        color: colors.darkBlue,
        fontWeight:'bold',
        margin:10
    },
    OptionText:{
        color: colors.darkBlue,
        fontWeight:'bold',
        marginLeft: 5,
    },

    LogoutContainer:{
        borderWidth: 0,
        backgroundColor: colors.red
    },
    LogoutText:{
        color: colors.white,
    },

    Footer:{
        position:'absolute',
        bottom:-2,
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray
    }
})