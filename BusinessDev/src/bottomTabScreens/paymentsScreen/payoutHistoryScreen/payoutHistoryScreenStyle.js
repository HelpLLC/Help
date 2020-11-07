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
        marginHorizontal:15,
        marginVertical:15,
    },
    ItemContainer:{
        borderColor: colors.green,
        borderWidth:2,
        borderRadius: 10,
        flexDirection:'row',
        paddingVertical:8,
        paddingHorizontal:12,
        width:screenWidth - (2 * 15),
        marginBottom:10,
        justifyContent:'space-between',
        alignItems:'center',
    },
    ItemDate:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
    },
    ItemTranfer:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
    },
    
})