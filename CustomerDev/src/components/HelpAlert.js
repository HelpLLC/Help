//This component will be the one that appears when an alert needs to be made for the user
import React from 'react';
import { Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import AwesomeAlert from 'react-native-awesome-alerts';
import strings from 'config/strings';
import colors from 'config/colors';

//The class that will render the alert
export default function HelpAlert(props) {
	//Defines the types of props that this component should take. For this, it should only take the state
	//to determine whether it shows or not, as well as the onPress method for the confirm message
	HelpAlert.propTypes = {
		isVisible: PropTypes.bool.isRequired,
		onPress: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
	};

	const { isVisible, onPress, title, message } = props;
	return (
		<View>
			<Modal visible={isVisible} transparent={true}>
				<AwesomeAlert
					show={isVisible}
					title={title}
					message={message}
					closeOnTouchOutside={false}
					showCancelButton={false}
					showConfirmButton={true}
					confirmButtonColor={colors.lightBlue}
					confirmText={strings.Ok}
					onConfirmPressed={onPress}
				/>
			</Modal>
		</View>
	);
}
