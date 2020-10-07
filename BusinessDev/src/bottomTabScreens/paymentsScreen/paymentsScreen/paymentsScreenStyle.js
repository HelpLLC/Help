import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
    Body:{
        flexDirection: 'column',
        backgroundColor: colors.white,
        alignItems:'flex-start',
        height: '100%',
        paddingHorizontal:10,
    },
    
    HeaderContainer:{
        borderColor: colors.green,
        borderWidth:2,
        borderRadius: 10,
        flexDirection:'column',
        marginTop:10,
        paddingVertical:5,
        paddingHorizontal:10,
        width:screenWidth - (2 * 10),
    },
    RowContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    AccountNumber:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
    },
    Balance:{
        ...fontStyles.biggerTextStyle,
        color:colors.darkBlue,
        marginVertical:5
    },
    Subject:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        marginBottom:5,
    },
    Content:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
    },
    Spacer:{
        marginBottom:15
    },
    AccountInput:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        fontWeight:'bold',
        borderColor:colors.blue,
        borderWidth:2,
        borderRadius:25,
        width:200,
        paddingVertical:5,
        paddingHorizontal:10,
        marginBottom:15,
    },
    
})