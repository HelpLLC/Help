//This is the default style that should be used by every single screen.
import colors from '../colors';
import { screenWidth, screenHeight } from 'config/dimensions';

export default {
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: colors.lightGray,
		flex: 1
	}
};
