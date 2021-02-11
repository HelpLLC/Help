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

    ContentContainer:{
        flexGrow:1
    },
    RowContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
		marginVertical: 5
    },
    CollumnContainer:{
        flexDirection: 'column',
        alignItems: 'center',
    },

	TimeSectionContainer:{
        flexDirection: 'column',
		margin: 10,

	},
	TimeSectionHeader:{
		...fontStyles.biggerTextStyle,
		fontWeight: 'bold',
		color: colors.darkBlue,
		marginLeft: 10
	},

	RequestContainer:{
        flexDirection: 'column',
		borderColor: colors.blue,
		borderWidth: 2,
		borderRadius: 15,
		paddingHorizontal: 20,
		marginVertical: 5
	},
	RequestText:{
		...fontStyles.bigTextStyle,
		fontWeight: 'bold',
		color: colors.darkBlue,
	},
	RequestTimeText:{
		...fontStyles.bigTextStyle,
		color: colors.blue,
	},
	RequestDetailText:{
		...fontStyles.mainTextStyle,
		color: colors.darkBlue,
	},
	
});
