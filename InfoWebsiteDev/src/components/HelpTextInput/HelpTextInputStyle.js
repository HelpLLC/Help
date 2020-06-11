//This is the styles for the HelpTextInput component
import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';
import { isMobile } from 'react-device-detect';

export default {
	textInputContainerStyle: isMobile
		? {
				borderRadius: 20,
				backgroundColor: colors.white,
				borderColor: colors.lightBlue,
				shadowOffset: {
					width: 0,
					height: 0,
				},
				shadowRadius: 5,
				shadowOpacity: 10,
				shadowColor: colors.lightBlue,
				alignItems: 'center',
				flexDirection: 'row',
				borderWidth: 3,
				...fontStyles.mainTextStyle,
				...fontStyles.bold,
				...fontStyles.black,
		  }
		: {
				borderRadius: 20,
				backgroundColor: colors.white,
				borderColor: colors.lightBlue,
				shadowOffset: {
					width: 0,
					height: 0,
				},
				shadowRadius: 5,
				shadowOpacity: 10,
				shadowColor: colors.lightBlue,
				alignItems: 'center',
				flexDirection: 'row',
				borderWidth: 3,
				...fontStyles.subTextStyle,
				...fontStyles.black,
		  },
	row: {
		display: 'flex',
		flexDirection: 'row',
	},
};
