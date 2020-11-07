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
        marginBottom:15,
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

    ListContainer:{
        flex:1,
        marginHorizontal:10,
    },
    ItemContainer:{
        borderColor: colors.green,
        borderWidth:2,
        borderRadius: 10,
        flexDirection:'row',
        paddingVertical:5,
        paddingHorizontal:10,
        width:screenWidth - (2 * 10),
        marginBottom:10,
    },
    ColumnContainer:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    RequestTitle:{
        ...fontStyles.biggerTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        marginVertical:3,
    },
    RequestText:{
        ...fontStyles.bigTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        marginVertical:3,
    },
})