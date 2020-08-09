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
    },
    SectionAnswerText:{
        color:colors.darkBlue,
        width:screenWidth - (5 * 2 + 30 + 60 + 20),
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.blue,
        paddingHorizontal:10,
        paddingTop:5,
    },
})