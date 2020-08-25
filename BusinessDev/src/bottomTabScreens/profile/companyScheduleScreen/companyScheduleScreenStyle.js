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
        flexGrow:1,
        width:screenWidth,
    },
    ScrollContainer:{
        width:'100%',
        flex:1,
    },
    ScrollContent:{
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
        paddingHorizontal:30,
        paddingVertical:20,
    },

    TitleContainer:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
    TitleText:{
        ...fontStyles.mainTextStyle,
        fontWeight:'bold',
        color:colors.darkBlue,
        marginHorizontal:10,
    },
    RowContainer:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        height:50,
        marginVertical:-3,
    },
    DisplayText:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
    },
    InputText:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        paddingHorizontal:5,
        paddingBottom:0,
        paddingTop:5,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: colors.blue,
        width:100,
        textAlign:'center',
        marginVertical:0,
    },

    Footer:{
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray,
    }
})