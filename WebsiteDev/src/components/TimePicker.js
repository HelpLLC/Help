import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeInput from 'material-ui-time-picker';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

class TimePicker extends Component {
	render() {
		const { widthPercent, marginLeft, marginTop } = this.props;

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
			marginLeft: this.props.marginLeft,
			fontSize: 14,
			width: this.props.widthPercent,
			marginTop: this.props.marginTop,
		};

		return (
			<div>
				<ThemeProvider theme={theme}>
					<TimeInput
						mode='12h'
						// style={mystyle}
						style={mystyle}
						onChange={this.props.onChange}
						value={this.props.value}
					/>
				</ThemeProvider>
			</div>
		);
	}
	propTypes = {
		widthPercent: PropTypes.string.isRequired,
		marginLeft: PropTypes.number.isRequired,
		marginTop: PropTypes.number.isRequired,
	};
}

//exports the module
export default TimePicker;
