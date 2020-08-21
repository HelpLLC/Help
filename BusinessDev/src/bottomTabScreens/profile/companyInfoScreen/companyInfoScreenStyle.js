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
        width:screenWidth,
    },
    ScrollContainer:{
        width:'100%',
        flex:1,
    },
    ScrollContent:{
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
        paddingHorizontal:15,
        paddingVertical:10,
    },

    MainSectionContainer:{
        width:'100%',
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
        flexGrow:1,
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        marginLeft:10,
        paddingTop:5,
        paddingRight:10,
    },
    SectionTitleText:{
        ...fontStyles.mainTextStyle,
        fontWeight:'bold',
        color:colors.darkBlue,
        marginBottom:3,
    },
    SectionContentScroll:{
        width:screenWidth - (30 + 10 + 60 + 10 + 10),
        borderWidth: 2,
        borderRadius: 30,
        borderColor: colors.blue,
    },
    SectionContentText:{
        ...fontStyles.mainTextStyle,
        color:colors.darkBlue,
        paddingHorizontal:15,
        paddingVertical:5,
    },

    Footer:{
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray
    }
})