//This object will hold all of the styles for the white card component
import colors from '../../colors';
import { Dimensions } from 'react-native';

export default {
	//This is the card that appears in the about section & the settings screen
	whiteCardStyle: {
		height: Dimensions.get('window').height * 0.07,
		width: Dimensions.get('window').width - 30,
		backgroundColor: colors.white,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
};
