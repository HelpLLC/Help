//This component will be the one that appears when an alert needs to be made for the user
import React from 'react';
import { Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import { screenWidth, screenHeight } from 'config/dimensions';
import AwesomeAlert from 'react-native-awesome-alerts';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';

//The class that will render the alert
export default function HelpAlert(props) {
	//Defines the types of props that this component should take. For this, it should only take the state
	//to determine whether it shows or not, as well as the onPress method for the confirm message
	HelpAlert.propTypes = {
		isVisible: PropTypes.bool,
		onConfirm: PropTypes.func,
		onCancel: PropTypes.func,
		title: PropTypes.string,
		message: PropTypes.string,
	}; 
	
    const { isVisible, onConfirm, onCancel, title, message, confirmText, cancelText } = props;
    let textStyle = {...fontStyles.bigTextStyle, fontWeight:'bold'}
	return (
		<View>
			<Modal visible={isVisible} transparent={true}>
				<AwesomeAlert
					show={isVisible}
					title={title}
					message={message}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
					showCancelButton={cancelText != undefined}
					showConfirmButton={confirmText != undefined}
					confirmButtonColor={colors.lightBlue}
					confirmText={confirmText}
					onConfirmPressed={onConfirm}
					cancelText={cancelText}
                    onCancelPressed={onCancel}
                    titleStyle={{...fontStyles.biggerTextStyle, fontWeight:'bold', color:colors.white}}
                    messageStyle={{...textStyle, color:colors.white, textAlign:'center'}}
                    confirmButtonTextStyle={{...textStyle, color:colors.darkBlue}}
                    cancelButtonTextStyle={{...textStyle, color:colors.darkBlue}}
                    cancelButtonColor={colors.white}
                    confirmButtonColor={colors.white}
                    contentContainerStyle={{backgroundColor:colors.blue, borderRadius:12}}
                    confirmButtonStyle={{borderRadius:12}}
                    cancelButtonStyle={{borderRadius:12}}
				/>
			</Modal>
		</View>
	);
}
