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
    RowContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: screenWidth,
    },
    CollumnContainer:{
        flexDirection: 'column',
        alignItems: 'center',
    },
    ViewButton:{
        backgroundColor:colors.white,
        borderRadius:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:70,
        height:40,
        marginRight:15
    },
    ViewText:{
        ...fontStyles.mainTextStyle,
        fontWeight:'bold',
        color: colors.blue,
        textAlign:'center'
    },

    KeyLabel:{
        ...fontStyles.biggerTextStyle,
        color:colors.white,
        fontWeight:'bold',
        marginHorizontal:40
    },
    DayLabels:{
        ...fontStyles.biggerTextStyle,
        color:colors.white,
        fontWeight:'bold'
    },
    MonthDay:{
        width:35,
        height:35,
        borderRadius:50,
        justifyContent:'center',
        marginVertical:-8
    },
    MonthDayText:{
        ...fontStyles.bigTextStyle,
        color:colors.white,
        fontWeight:'bold',
        textAlign:'center'
    },
    DayLabel:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        marginLeft:10
    },
    DayContainer:{
        margin:10
    },
    MonthRequestContainer:{
        borderRadius:25,
        borderWidth:2,
        borderColor:colors.blue,
        paddingHorizontal:10,
        paddingVertical:10,
        marginTop:5,
        height:75,
        justifyContent:'center'
    },

    WeekDayLabelContainer:{
        borderRadius:50,
        width:50,
        height:50,
        borderWidth:2,
        justifyContent:'center'
    },
    WeekDayLabel:{
        ...fontStyles.mainTextStyle,
        color:colors.white,
        fontWeight:'bold',
        textAlign:'center'
    },
    TimeLabel:{
        ...fontStyles.subTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        height:100,
        width:75,
        paddingHorizontal:10
    },

    NoRequestsLabelContainer:{
        borderRadius:20,
        backgroundColor:colors.darkBlue,
        paddingHorizontal:10,
        paddingVertical:10,
        margin:10,
        justifyContent:'center',
        alignItems:'center'
    },
    NoRequestsLabel:{
        ...fontStyles.bigTextStyle,
        color:colors.white,
        fontWeight:'bold',
        textAlign:'center',
        marginVertical:5,
    },

})