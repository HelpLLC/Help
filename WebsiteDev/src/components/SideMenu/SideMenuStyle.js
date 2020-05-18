import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';

export default {
	sidebar: {
		width: 256,
      height: '100vh',
      color: colors.white,
      backgroundColor: colors.blue
	},
	sidebarLink: {
		display: 'block',
		padding: '16px 0px',
		color: colors.white,
		textDecoration: 'none',
	},
	divider: {
		margin: '8px 0',
		height: 1,
		backgroundColor: colors.white,
	},
	content: {
		padding: '16px',
		height: '100%',
		backgroundColor: colors.blue,
		color: colors.white,
	},
	contentHeaderMenuLink: {
		textDecoration: 'none',
		color: 'white',
		padding: 8,
	},
	content: {
		padding: '16px',
	},
	root: {
		fontFamily:
			'"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
		fontWeight: 300,
	},
	header: {
      padding: '16px',
		...fontStyles.bigSubTitleStyle,
		...fontStyles.white,
	},
};
