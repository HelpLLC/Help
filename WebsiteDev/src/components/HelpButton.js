import React from 'react';
import Button from '@material-ui/core/Button';
import colors from '../config/colors';
import fontStyles from '../config/fontStyles'

export default function HelpButton(props) {
	const { label, onClick, fullWidth } = props;
	return (
		<Button
			onClick={onClick}
			color={'primary'}
			variant='contained'
			style={{ ...fontStyles.mainTextStyleWhite, backgroundColor: colors.lightBlue }}
			fullWidth={fullWidth}>
			{label}
		</Button>
	);
}
