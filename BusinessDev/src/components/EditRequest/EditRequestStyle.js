import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    ContentContainer:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',
        paddingTop:10,
    },

    MainSectionContainer:{
        width:screenWidth - 30,
        flexDirection:'row',
        justifyContent:'flex-start',
        paddingHorizontal:5,
        paddingVertical:10,
    },
    MainBorder:{
        borderBottomWidth:3,
        borderColor:colors.blue,
    },
    SectionIcon:{
        width:60,
        height: 60,
        justifyContent: 'center',
        alignItems:'center',
    },
    SectionTextContainer:{
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        flex:1,
        marginLeft:20,
        paddingTop:5,
    },
    SectionTitleText:{
        fontWeight:'bold',
        color:colors.darkBlue,
        marginBottom:3,
    },
    SectionContentText:{
        color:colors.darkBlue,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: colors.blue,
        width: "100%",
        paddingHorizontal: 15,
    },
    SectionAnswerText:{
        color:colors.darkBlue,
        width:screenWidth - (5 * 2 + 30 + 60 + 20),
        borderWidth: 2,
        borderRadius: 25,
        borderColor: colors.blue,
        paddingHorizontal:15,
        paddingTop:5,
    },

    RowContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start',
        flex:1,
        width:screenWidth - (5 * 2 + 30 + 60 + 20),
    },
    PaymentMarker:{
        ...fontStyles.mainTextStyle,
        fontWeight:'bold',
        color:colors.white,
        borderWidth:1,
        borderRadius: 10,
        overflow:'hidden',
        paddingHorizontal:8,
    },
    SucceededMarker:{
        borderColor:colors.green,
        backgroundColor:colors.green,
    },
    RefundMarker:{
        borderColor:colors.red,
        backgroundColor:colors.red,
    },
})