import React from 'react';
import PropTypes from 'prop-types';
import TimeInput from 'material-ui-time-picker';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { View } from 'react-native-web';

export default function TimePicker(props) {
  
	TimePicker.propTypes = {
		widthPercent: PropTypes.string.isRequired,
		marginLeft: PropTypes.number.isRequired,
		marginTop: PropTypes.number.isRequired,
  };
  
  const { 
    widthPercent, 
    marginLeft, 
    marginTop 
  } = props;

		const theme = createMuiTheme({
			palette: {
				primary: {
					main: '#00B0F0',
				},
			},
			textAlign: 'center',
			color: '#00B0F0',
		});

		const mystyle = {
			color: '#00B0F0',
			fontFamily: 'Arial Rounded MT Bold',
			marginLeft: props.marginLeft,
			fontSize: 14,
			width: props.widthPercent,
			marginTop: props.marginTop,
		};

		return (
			<View>
				<ThemeProvider theme={theme}>
					<TimeInput
						mode='12h'
						style={mystyle}
						onChange={props.onChange}
						value={props.value}
					/>
				</ThemeProvider>
			</View>
		);
}
