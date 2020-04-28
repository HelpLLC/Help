import React from 'react';
import PropTypes from 'prop-types';
import TimeInput from 'material-ui-time-picker';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { View } from 'react-native-web';
import TimePickerStyle from './TimePickerStyle';

export default function TimePicker(props) {
	TimePicker.propTypes = {
		widthPercent: PropTypes.string.isRequired,
		marginLeft: PropTypes.number.isRequired,
		marginTop: PropTypes.number.isRequired,
	};

	const { widthPercent, marginLeft, marginTop } = props;

	const theme = createMuiTheme({
		palette: {
			primary: {
				main: '#00B0F0',
			},
		},
		textAlign: 'center',
		color: '#00B0F0',
	});

	return (
		<View>
			<ThemeProvider theme={theme}>
				<TimeInput mode='12h' style={{...fontStyles.mainTextStyleBlue, width: widthPercent}} onChange={props.onChange} value={props.value} />
			</ThemeProvider>
		</View>
	);
}
