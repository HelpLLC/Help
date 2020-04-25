//This is going to contain the styles for the Contact Us Page
import { StyleSheet } from 'react-native';
import colors from '../../../config/colors';

export default StyleSheet.create({
	imageContainer: {
		alignItems: 'center',
	},
	path: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		height: '105vh',
		opacity: 1,
	},
	textContainer: {
		marginTop: '9vh',
	},
	title: {
		fontFamily: 'Lucida Grande',
		fontSize: '87px',
		textAlign: 'left',
		color: colors.white,
	},
	explanation: {
		overflow: 'hidden',
		fontFamily: 'Lucida Grande',
		fontSize: '130px',
		textAlign: 'center',
		lineHeight: '130px',
		color: colors.white,
	},
	contactBorder: {
		marginTop: '30vh',
		borderRadius: '25px',
		border: '2px solid ' + colors.fountainBlue,
		boxShadow: '0px 3px 5px 1px ' + colors.fountainBlue,
		flexDirection: 'row',
		paddingHorizontal: '2vw',
		paddingVertical: '5vw',
	},
	heading1Container: {
		flexDirection: 'column',
		justifyContent: 'center',
	},
	heading1: {
		fontFamily: 'Lucida Grande',
		fontSize: '80px',
		textAlign: 'left',
		color: colors.bismark,
	},
	rowContainer: {
		flexDirection: 'row',
		marginTop: '1vh',
	},
	contactInfoIcon: {
		overflow: 'hidden',
		fontFamily: 'Lucida Grande',
		textAlign: 'left',
		color: colors.black,
		marginTop: '3vh',
	},
	contactInfoText: {
		overflow: 'hidden',
		fontFamily: 'Lucida Grande',
		fontSize: '40px',
		textAlign: 'left',
		color: colors.bismark,
		marginTop: '3vh',
		marginLeft: '1vw',
	},
	mapImage: {
		width: '25vw',
		height: '35vh',
		objectFit: 'cover',
	},
	heading2Container: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'column',
		width: '90vw',
		marginTop: '15vh',
	},
	heading2: {
		fontFamily: 'Lucida Grande',
		fontSize: '79px',
		textAlign: 'left',
		color: colors.bismark,
	},
	subtitle2: {
		overflow: 'hidden',
		fontFamily: 'Lucida Grande',
		fontSize: '50px',
		textAlign: 'center',
		lineHeight: '7.5vh',
		color: colors.blue,
		marginVertical: '4vh',
	},
	formContainer: {
		marginBottom: '5vh',
		alignItems: 'center',
		marginLeft: '3vh',
	},
	emailNameContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '95vw',
		marginBottom: '5vh',
	},
	buttonContainer: {
		marginTop: '2vh',
		marginBottom: '3vh',
		alignItems: 'center',
		alignSelf: 'center',
	},
});
