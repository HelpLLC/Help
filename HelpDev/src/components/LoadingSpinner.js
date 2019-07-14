//This component will be the default loading spinner that should be user throughout the entire app
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import colors from 'config/colors';
import PropTypes from 'prop-types';

//The class that will render the spinner
class LoadingSpinner extends Component {
    render() {
        return (
            <View>
                <ActivityIndicator
                    animating={this.props.isVisible}
                    size={'small'}
                    color={colors.lightBlue} />
            </View>
        );
    }
}

//Making sure that the correct prop type (boolean) is passed in
LoadingSpinner.propTypes = {
    isVisible: PropTypes.bool.isRequired
}

export default LoadingSpinner;