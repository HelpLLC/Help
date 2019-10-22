//This component will represent the default pop up that will appear when the user needs to make a decision
//The component will ask a question, and there will be a confirm button and a cancel button, which custom
//texts passed in as props. Based on the clicked option, a function is called, also passed in as a prop
import React, { Component } from 'react';
import { Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import AwesomeAlert from 'react-native-awesome-alerts';
import colors from 'config/colors';

//The class that will render the alert
class OptionPicker extends Component {
    render() {
        const { isVisible, confirmText, cancelText,
            confirmOnPress, cancelOnPress, title, message } = this.props;
        return (
            <View>
                <Modal visible={isVisible} transparent={true}>
                    <AwesomeAlert
                        show={isVisible}
                        title={title}
                        message={message}
                        closeOnTouchOutside={true}
                        showCancelButton={true}
                        showConfirmButton={true}
                        confirmButtonColor={colors.lightBlue}
                        cancelButtonColor={colors.gray}
                        confirmText={confirmText}
                        cancelText={cancelText}
                        onConfirmPressed={() => { confirmOnPress() }}
                        onCancelPressed={() => { cancelOnPress() }}
                        onDismiss={() => { cancelOnPress() }}
                    />
                </Modal>
            </View>
        )
    }
}

//Defines the types of props that this component should take. For this, it should only take the state
//to determine whether it shows or not, as well as the onPress method for the confirm message
OptionPicker.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    confirmText: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    confirmOnPress: PropTypes.func.isRequired,
    cancelOnPress: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
}

//Exports the module
export default OptionPicker;