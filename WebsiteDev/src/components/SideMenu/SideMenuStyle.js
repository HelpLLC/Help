import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';

export default {
	sidebar: {
		width: 256,
		height: '100vh',
		color: colors.white,
      backgroundColor: colors.blue,
	},
	sidebarLink: {
		display: 'block',
		padding: '2vh 0vw',
		color: colors.white,
		textDecoration: 'none',
      ...fontStyles.mainTextStyle,
	},
	divider: {
		margin: '1vh 0',
		height: 1,
		backgroundColor: colors.white,
	},
	content: {
		padding: '2vh',
		height: '100vh',
		backgroundColor: colors.blue,
		color: colors.white,
	},
	contentHeaderMenuLink: {
		textDecoration: 'none',
		color: 'white',
		padding: 8,
	},
	content: {
		padding: '2vh',
	},
	root: {
		...fontStyles.mainTextStyle
	},
	header: {
		padding: '2vh',
		...fontStyles.bigSubTitleStyle,
		...fontStyles.white,
	},
	logout: {
		display: 'block',
      color: colors.white,
      ...fontStyles.mainTextStyle,
		textDecoration: 'none',
	},
};
