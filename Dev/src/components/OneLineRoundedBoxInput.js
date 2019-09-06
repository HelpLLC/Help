//This component will represest a single lined text input that will have a bottom border
//color and a placeholder
import React, { Component } from 'react';
import { View, TextInput, Dimensions } from 'react-native';
import colors from 'config/colors';
import PropTypes from 'prop-types';

class OneLineRoundedBoxInput extends Component {
    render() {
        //The one prop this will take is a placeholder text which will disappear when the user
        //starts typing as well as onChangeText function and a value
        const { placeholder, onChangeText, value, maxLength, width, password, autoCompleteType, keyboardType } = this.props;

        return (
            <View>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.gray}
                    onChangeText={(input) => onChangeText(input)}
                    style={{
                     borderWidth: 3,
                     borderColor: colors.lightBlue,
                     width: width ? width : (Dimensions.get('window').width * 0.6),
                     height: (Dimensions.get('window').height * 0.05),
                     borderRadius: 20,
                     paddingLeft: 10,
                     backgroundColor: colors.white
                    }}
                    secureTextEntry={password}
                    keyboardType={keyboardType ? keyboardType : 'default'}
                    blurOnSubmit={true}
                    returnKeyType={'done'}
                    value={value}
                    autoCompleteType={autoCompleteType ? autoCompleteType : 'off'}
                    autoCapitalize={autoCompleteType === "email" ||  autoCompleteType === "password"? 'none': 'words'}
                    maxLength={maxLength} />
            </View>
        );
    }
}

//This function makes sure that the correct props are passed into the component
//A placeholder can be passed in as a prop & it is not required
//A onChangeText function can be passed as prop but not required
OneLineRoundedBoxInput.propTypes = {
    placeholder: PropTypes.string,
    onChangeText: PropTypes.func,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    width: PropTypes.number
}

//exports the module
export default OneLineRoundedBoxInput;

