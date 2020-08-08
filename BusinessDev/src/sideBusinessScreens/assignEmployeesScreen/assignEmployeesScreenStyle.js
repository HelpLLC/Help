import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    Body:{
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.white,
        height: screenHeight
    },

    MainContainer:{
        height:screenHeight - 80 - (screenHeight * 0.135),
        flexDirection:'column',
    },
    SearchBarContainer:{
        padding:20,
        flexDirection:'row',
        justifyContent:'center',
        width: screenWidth,
    },
    SearchBar:{
        paddingVertical:0,
        paddingHorizontal:10,
        borderColor:colors.darkBlue,
        borderWidth:2,
        borderRadius:50,
        flexDirection:'row',
        flexGrow:1,
    },
    SearchBarText:{
        flexGrow:1,
        color:colors.darkBlue
    },

    ListContainer:{
        flexGrow:1,
        marginTop:-10,
    },
    ItemContainer:{
        borderRadius:10,
        borderWidth:2,
        borderColor:colors.green,
        marginVertical:5,
        marginHorizontal:10,
        flexDirection:'row',
        justifyContent:'center',
        padding:7,
    },
    ItemTextContainer:{
        paddingRight:screenWidth*.1,
        flexGrow:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    ItemText:{
        color:colors.darkBlue,
        fontWeight:'bold',
        marginBottom:10,
    },
    ItemAssignedText:{
        color:colors.blue,
        fontWeight:'bold',
    },

    PopupContainer:{
        backgroundColor:colors.lightGray+'80',
        width:screenWidth,
        height:screenHeight,
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
    },
    PopupTextContainer:{
        backgroundColor:colors.blue,
        width:screenWidth*.65,
        padding:20,
        borderRadius:10,
        flexDirection:'column',
        alignItems:'center',
    },
    PopupTitle:{
        color:colors.white,
        fontWeight:'bold',
        textAlign:'center',
    },
    PopupText:{
        color:colors.white,
        marginVertical:15,
        textAlign:'center',
    },
    PopupDetails:{
        color:colors.white,
        fontWeight:'bold',
        marginVertical:5,
        textAlign:'center',
    },

    Footer:{
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray
    }
})