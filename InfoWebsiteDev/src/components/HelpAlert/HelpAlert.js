//This component will represent the dialog popups where an alert will be displayed to the user with a given message
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import colors from '../../config/colors';
import TitleComponent from '../TitleComponent';

const HelpAlert = (props) => {
	//These are the prop types that will be passed into this component
	HelpAlert.propTypes = {
		isVisible: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		titleText: PropTypes.string.isRequired,
		messageText: PropTypes.string.isRequired,
	};

	//Fetches the passed in props
	const { isVisible, onClose, titleText, messageText } = props;

	return (
		<Dialog open={isVisible} onClose={() => onClose()}>
			<TitleComponent text={titleText} isCentered={true} textColor={colors.darkBlue} />
			<DialogContent>
				<DialogContentText>{messageText}</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default HelpAlert;
