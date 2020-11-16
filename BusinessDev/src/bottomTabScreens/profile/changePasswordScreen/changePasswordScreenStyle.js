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
        flexGrow:1,
        paddingVertical:20,
        width:screenWidth,
    },
    FieldContainer:{
        flexDirection:'column',
        justifyContent:'flex-start',
        width:'100%',
        marginBottom:15,
        paddingHorizontal:40,
    },
    FieldName:{
        color:colors.darkBlue,
        fontWeight:'bold',
        marginBottom:4,
    },
    FieldInput:{
        borderColor:colors.blue,
        borderWidth:2,
        borderRadius:20,
        width:'100%',
        paddingVertical:3,
        paddingHorizontal:10,
    },
})