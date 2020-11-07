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
    
    MainTabContainer:{
        width:'100%',
        flexDirection: 'row',
        borderBottomWidth:1,
        borderBottomColor: colors.blue,
        borderTopWidth:1,
        borderTopColor: colors.white,
    },
    TabContainer:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        height:40,
    },
    TabText:{
        ...fontStyles.mainTextStyle,
        textAlign:'center',
        fontWeight:'bold',
    },
    SelectedTab:{
        backgroundColor:colors.white,
    },
    SelectedTabText:{
        color:colors.blue
    },
    UnselectedTab:{
        backgroundColor:colors.blue,
    },
    UnselectedTabText:{
        color:colors.white
    },

    ScrollView:{
        flex:1,
        flexDirection:'column',
        paddingHorizontal:15,
    },
    ServiceIcon:{
        width:'100%',
        height:'100%',
    },
    IconContainer:{
        borderColor:colors.white,
        borderWidth:1,
        borderRadius:10,
        overflow:'hidden',
    },
    PastMonth:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        textAlign:'left',
        fontWeight:'bold',
        marginBottom:25,
    },
    Ratings:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
    },
    RatingObject:{
        alignSelf:'flex-start',
    },
    EditIcon:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        marginTop:5,
        marginLeft:5,
        marginRight:15,
    },
    ServiceSubject:{
        ...fontStyles.biggerTextStyle,
        borderBottomColor:colors.blue,
        flex:1,
        marginVertical:5,
        borderBottomWidth:2,
        paddingVertical:3,
        paddingHorizontal:10,
        color:colors.darkBlue,
        fontWeight:'bold',
    },
    ServiceText:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        marginHorizontal:5,
    },
    ServiceIcon:{
        flex:1,
        height:100,
    },
    IconContainer:{
        borderColor:colors.white,
        borderWidth:1,
        borderRadius:10,
        overflow:'hidden',
    },
    EditServiceButton:{
        height: 50,
        width: screenWidth - (2 * 15),
    },
    RowContainer:{
        flexDirection:'row',
    },
    ColumnContainer:{
        flexDirection:'column',
    },
})