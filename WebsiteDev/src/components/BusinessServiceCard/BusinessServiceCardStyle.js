//This is going to contain the styles for the Help Button
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../../config/dimensions';
import colors from '../../config/colors';

export default StyleSheet.create({
	cardcontainer: {
		float: 'initial',
		display: 'inline-flex',
		height: '175px',
		width: 'initial',
		marginLeft: '200px',
		marginRight: '200px',
		marginTop: '50px',
		backgroundColor: colors.white,
	},
	body1: {
		margin: '10px',
	},
	body2: {
		margin: '10px',
	},
	body3: {
		margin: '10px',
	},
	body4: {
		margin: '10px',
	},
	body5: {
		margin: '10px',
	},
	img: {
		borderTop: 'initial',
		display: 'inline-block',
		height: '120px',
		marginTop: '0px',
	},
	price: {
		fontSize: '20px',
		backgroundColor: 'unset',
		borderColor: colors.white,
		fontWeight: 'bold',
		marginTop: '-10px',
	},
	requests: {
		fontSize: '20px',
		backgroundColor: 'unset',
		borderColor: colors.white,
		fontWeight: 'bold',
		marginTop: '-10px',
	},
	days: {
		fontSize: '20px',
		backgroundColor: 'unset',
		borderColor: colors.white,
		fontWeight: 'bold',
		marginTop: '-10px',
	},
	house: {
		fontSize: '20px',
		backgroundColor: 'unset',
		borderColor: colors.white,
		fontWeight: 'bold',
		marginTop: '-10px',
	},
	rating: {
		fontSize: '20px',
		backgroundColor: 'unset',
		borderColor: colors.white,
		fontWeight: 'bold',
		marginTop: '-10px',
	},
	description: {
		fontSize: '20px',
		backgroundColor: 'unset',
		borderColor: colors.white,
		fontWeight: 'bold',
		marginTop: '-10px',
	},
});
