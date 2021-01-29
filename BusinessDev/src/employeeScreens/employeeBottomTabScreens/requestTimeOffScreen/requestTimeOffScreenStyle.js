import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    Body:{
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.white,
        width:'100%',
        flex:1,
    },

    ContentContainer:{
        flex:1,
        padding:20,
        width:'100%',
    },
    RowContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        marginBottom:20,
    },
    CollumnContainer:{
        flexDirection:'column',
        marginLeft:10,
    },
    ContentSubject:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        marginVertical:5,
    },

    DateContainer:{

    },
    Date:{
        ...fontStyles.bigTextStyle,
        margin:0,
        borderColor:colors.white,
        borderRadius:20,
        borderWidth:1,
        paddingHorizontal:10,
        paddingVertical:3,
        alignSelf:'flex-start',
        textAlign:'left',
    },
    DateInput:{
        color:colors.white,
        backgroundColor:colors.blue,
        fontWeight:'bold'
    },
    DateContent:{
        color:colors.darkBlue,
    },
    InputContent:{
        ...fontStyles.mainTextStyle,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: colors.blue,
        color:colors.darkBlue,
        height:150,
        paddingHorizontal:10,
    },

    FooterButton:{
        marginBottom:20,
        width:'100%',
        justifyContent:'center',
    },
})