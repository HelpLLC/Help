import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';

export default {
	sidebar: {
		width: '20vw',
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
		marginTop: "43vh",
		height: 1,
		backgroundColor: colors.white,
	},
	content: {
		padding: '2vh',
		height: '100vh',
		backgroundColor: colors.blue,
		color: colors.white,
    },
    contenttext: {
        ...fontStyles.mainTextStyle
    },
	contentHeaderMenuLink: {
		textDecoration: 'none',
		color: 'white',
		padding: 8,
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
		marginTop: "2.5vh",
		display: 'block',
      color: colors.white,
      ...fontStyles.mainTextStyle,
		textDecoration: 'none',
	},
};
