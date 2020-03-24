import React, { useState, Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import color from '@material-ui/core/colors/amber';
import classNames from 'classnames';

class EditText extends Component {
	render() {
		const { labelText, multiline, classes, onChange, value } = this.props;
		const theme = createMuiTheme({
			palette: {
				primary: {
					main: '#00B0F0'
				}
			},
			textAlign: 'center',
			color: '#00B0F0'
		});
		const useStyles = makeStyles((theme) => ({
			textField: {
				border: '1px solid red'
			}
		}));

		return (
			<div>
				<ThemeProvider theme={theme} style={useStyles.textField}>
					<TextField
						id='outlined-basic'
						label={labelText}
						variant='outlined'
						multiline={this.props.multiline}
						style={{ width: this.props.widthPercent }}
						textAlign='center'
						type={this.props.type}
						inputProps={{
							style: {
								marginTop: '5px'
							}
						}}
						size='normal'
						onChange={(event) => {
							this.props.onChange(event.target.value);
						}}
						value={this.props.value}
					/>
				</ThemeProvider>
			</div>
		);
	}
	propTypes = {
		labelText: PropTypes.string.isRequired,
		multiline: PropTypes.bool.isRequired,
		widthPercent: PropTypes.string.isRequired,
		type: PropTypes.string
	};
}

//exports the module
export default EditText;
