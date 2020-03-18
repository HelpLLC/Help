//This will be the style used by the top banner
import colors from '../../colors';
import { screenWidth, screenHeight } from 'config/dimensions';
 

export default {
	style: {
		height: screenHeight * 0.12,
		flexDirection: 'row',
		width: screenWidth,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: colors.white
	},
};
