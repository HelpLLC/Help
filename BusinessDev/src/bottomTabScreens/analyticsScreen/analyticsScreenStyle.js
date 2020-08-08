import { StyleSheet } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import { color } from 'react-native-reanimated';

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

    MainTabContainer:{
        width:'100%',
        flexDirection: 'row',
        borderBottomWidth:1,
        borderBottomColor: colors.blue,
        borderTopWidth:1,
        borderTopColor: colors.white,
        marginBottom:15,
    },
    TabContainer:{ },
    TabText:{
        textAlign:'center',
        fontWeight:'bold',
        margin:12,
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
    
    ChartMainContainer:{
        borderColor:colors.green,
        borderWidth: 2,
        borderRadius: 15,
        width: screenWidth * 0.9,
        paddingLeft:28,
        paddingVertical:10,
        justifyContent:'center',
        alignContent:'center',
        
    },
    ChartTitleText:{
        fontWeight:'bold',
        color: colors.darkBlue,
        marginLeft:-15,
        marginTop:-5,
        marginBottom:-20

    },
    ChartDropdownContainer:{
        height: 30,
        borderRadius:15,
        overflow: 'hidden',
        marginRight:5,
        marginTop:-5,
        marginBottom:-15,
    },
    ChartDropdown:{
        color:colors.white,
        backgroundColor: colors.blue,
        height: 30,
        fontWeight:'bold'
    },
    ChardDropdownLabels:{
        backgroundColor:colors.blue,
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10, 
        borderBottomRightRadius: 10,
        fontWeight:'bold'
    },
    LineChart:{
        height: 250,
        width: screenWidth * 0.8,
    },

    BarChartContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:30
    },
    BarChartYaxis:{
        width:150,
        marginHorizontal:-30,
    },
    BarChartXaxis:{
        height:30,
        position: 'absolute',
        marginLeft:8,
    },
    BarChart:{
        height: 250,
        width: screenWidth * 0.6,
    },

    KeyMainContainer:{
        marginTop:25,
        justifyContent:'center',
        alignItems:'center',
    },
    KeySubContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:20,
    },
    KeyColor:{
        width:15,
        height:15,
        backgroundColor:colors.blue
    },
    KeyText:{
        color:colors.darkBlue,
        margin:5,
    },


    Footer:{
        position:'absolute',
        bottom:-2,
        width:screenWidth + 4,
        height:80,
        borderWidth:2,
        borderColor: colors.gray
    }
})