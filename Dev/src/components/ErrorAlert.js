//This component will be the one that appears when something goes wrong with the app. It will be most
//commonly used when a firebase function doesn't resolve for some reason
import React, { Component } from 'react';
import { Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import AwesomeAlert from 'react-native-awesome-alerts';
import strings from 'config/strings';
import colors from 'config/colors';

//The class that will render the alert
class ErrorAlert extends Component {
	render() {
		const { isVisible, onPress, title, message } = this.props;
		return (
			<View>
				<Modal visible={isVisible} transparent={true}>
					<AwesomeAlert
						show={isVisible}
						title={title}
						message={message}
						closeOnTouchOutside={true}
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
}

//Defines the types of props that this component should take. For this, it should only take the state
//to determine whether it shows or not, as well as the onPress method for the confirm message
ErrorAlert.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	onPress: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired
};

//exports the module
export default ErrorAlert;
