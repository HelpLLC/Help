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
    
    HeaderContainer:{
        borderColor: colors.green,
        borderWidth:2,
        borderRadius: 10,
        flexDirection:'column',
        margin:10,
        paddingVertical:5,
    },
    RowContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    RowObject:{
        width:'50%',
        paddingHorizontal:10,
        paddingVertical:8,
        flexDirection:'row',
    },
    HeaderSubject:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        textAlign:'left',
        alignSelf:'flex-start',
        width:'100%',
    },
    MainHeaderSubject:{
        ...fontStyles.biggerTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        textAlign:'left',
        alignSelf:'flex-start',
        width:'100%',
    },
    HeaderField:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        textAlign:'right',
        alignSelf:'flex-end',
        width:'100%',
    },

    RecentTransactions:{
        ...fontStyles.biggerTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        textAlign:'left',
        marginTop:20,
        marginBottom:10,
        paddingHorizontal:11,
        width:'100%',
        textAlign:'left',
    },

    ListContainer:{
        flex:1,
        marginHorizontal:10,
        marginVertical:10,
    },
    ItemContainer:{
        borderColor: colors.green,
        borderWidth:2,
        borderRadius: 10,
        flexDirection:'column',
        paddingVertical:5,
        paddingHorizontal:10,
        width:screenWidth - (2 * 10),
        marginBottom:10,
    },
    ItemDate:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        textAlign:'left',
        alignSelf:'flex-start',
        marginVertical:5,
    },
    SubjectRowObject:{
        width:'60%',
        flexDirection:'row',
    },
    AmountRowObject:{
        width:'40%',
        flexDirection:'column',
        marginTop:-3,
    },
    ItemSubjectText:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        textAlign:'left',
        width:'100%',
        lineHeight:26,
    },
    ItemTransaction:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        textAlign:'right',
        width:'100%',
    },
    ItemBalance:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        textAlign:'right',
        width:'100%',
    },
})