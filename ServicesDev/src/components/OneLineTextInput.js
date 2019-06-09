//This component will represest a single lined text input that will have a bottom border
//color and a placeholder
import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import colors from 'config/colors';
import PropTypes from 'prop-types';

class OneLineTextInput extends Component {
    render() {
        //The one prop this will take is a placeholder text which will disappear when the user
        //starts typing as well as onChangeText function and a value
        const { placeholder, onChangeText, value, maxLength, width } = this.props;

        return (
            <View>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.gray}
                    onChangeText={(input) => onChangeText(input)}
                    style={{
                        borderBottomColor: colors.black,
                        borderWidth: 0.5,
                        borderLeftColor: colors.lightGray,
                        borderRightColor: colors.lightGray,
                        borderTopColor: colors.lightGray,
                        width: width ? width : 250
                    }}
                    value={value}
                    maxLength={maxLength} />
            </View>
        );
    }
}

//This function makes sure that the correct props are passed into the component
//A placeholder can be passed in as a prop & it is not required
//A onChangeText function can be passed as prop but not required
OneLineTextInput.propTypes = {
    placeholder: PropTypes.string,
    onChangeText: PropTypes.func,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    width: PropTypes.number
}

//exports the module
export default OneLineTextInput;

