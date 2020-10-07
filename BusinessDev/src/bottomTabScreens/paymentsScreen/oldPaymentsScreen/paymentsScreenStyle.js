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
        backgroundColor:colors.blue
    },

    ContentContainer:{
        width:'100%',
        flex:1,
        padding: 15,
    },
    HeaderContainer:{
        borderColor: colors.green,
        borderWidth:2,
        borderRadius: 10,
        flexDirection:'column',
        alignItems:'flex-start',
        padding: 15,
    },
    HeaderText:{
        ...fontStyles.biggerTextStyle,
        fontWeight:'bold',
        color: colors.darkBlue,
        padding:0
    },
    HeaderDetailsContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-end',
        width:'100%',
        marginTop:5,
        marginBottom:-5
    },
    HeaderBalance:{
        ...fontStyles.biggerTextStyle,
        color: colors.darkBlue,
        padding:0,
    },
    HeaderViewDetails:{
        ...fontStyles.bigTextStyle,
        color: colors.blue,
        padding:0
    },
    DropdownContainer:{
        borderRadius:15,
        borderColor:colors.white,
        borderWidth:1,
        height: 30,
        width:80,
        padding:0,
        overflow:'hidden',
        alignSelf:'flex-end',
        margin:10,
    },
    Dropdown:{
        color:colors.white,
        backgroundColor: colors.blue,
        height: 30,
        fontWeight:'bold',
        width:80,
        marginTop:-2,
        marginBottom:-5,
    },
    ListContainer:{
        flex:1,
    },

    ItemContainer:{
        borderColor: colors.green,
        borderWidth:2,
        borderRadius: 10,
        flexDirection:'column',
        padding: 10,
        marginVertical:5,
        paddingBottom:-3,
    },
    RowContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start',
        marginBottom:5
    },
    ItemMarker:{
        ...fontStyles.bigTextStyle,
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
    ColumnContainer:{
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        marginHorizontal:10
    },
    ItemSubject:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        marginBottom:5,
    },
    ItemField:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        textAlign:'center',
    },

    Footer:{
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray
    }
})