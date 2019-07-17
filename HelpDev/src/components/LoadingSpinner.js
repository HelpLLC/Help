//This component will be the default loading spinner that should be user throughout the entire app
import React, { Component } from 'react';
import { View } from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import Modal from "react-native-modal";
import colors from 'config/colors';
import PropTypes from 'prop-types';

//The class that will render the spinner
class LoadingSpinner extends Component {
    render() {
        const { isVisible } = this.props;
        return (
            <View>
                <Modal visible={isVisible} transparent={true}>
                    <DotIndicator
                        animating={isVisible}
                        color={colors.lightBlue}
                        count={3} />
                </Modal>
            </View>
        );
    }
}

//Making sure that the correct prop type (boolean) is passed in
LoadingSpinner.propTypes = {
    isVisible: PropTypes.bool.isRequired
}

export default LoadingSpinner;