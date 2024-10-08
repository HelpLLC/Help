//This is the styles for the HelpTextInput component
import { StyleSheet } from 'react-native';
import colors from '../../config/colors';
import { screenHeight, screenWidth } from '../../config/dimensions';
import fontStyles from '../../config/fontStyles';

export default {
	listItem: {
		marginTop: '3vh',
		display: 'flex',
		width: '45vw',
		height: '15vh',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderRadius: '10px',
		border: '2px solid #5cc6bc',
		'box-shadow': '0px 3px 5px 1px rgba(92, 198, 188, 2.55)',
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
	},
	profileImage: {
		marginLeft: '0.5vw',
		marginTop: '0.5vh',
		marginBottom: '0.5vh',
		width: '5vw',
		height: '5vw',
	},
	nameText: {
		...fontStyles.mainTextStyle,
		...fontStyles.darkBlue,
		...fontStyles.bold,
		marginLeft: '1vw',
		marginTop: '3vh',
	},
	assignButton: {
		marginTop: '0.75vh',
		alignItems: 'center',
		marginRight: '1vw',
	},
	assignedText: {
		...fontStyles.bigSubTitleStyle,
		...fontStyles.green,
		marginLeft: '1vw',
		marginTop: '2vh',
	},
};
