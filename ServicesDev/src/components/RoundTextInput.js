//This component will represent the TextInput that will be rounded and allow users to type
//multiple lines within it.
import React, { Component } from 'react';
import { View, TextInput, Dimensions } from 'react-native';
import colors from 'config/colors';
import PropTypes from 'prop-types';

class RoundTextInput extends Component {

    render() {
        //The class will take in properties that are the value that the textinput will hold when it 
        //is first accessed, i.e, the instructions for what the user should type. It will also 
        //contain a height & width for how big the textInput will be along with some functions to
        //retrieve the input
        const { width, height, placeholder, onChangeText, value } = this.props;
        return (
            //Creates a view that includes the interior TextInput so that the curvature doesn't 
            //impact the text
            <View style={{
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                height: height,
                width: width,
                borderRadius: (Dimensions.get('window').height * 0.0292825769)
            }} >
                <TextInput
                    style={{ height: (height - 5), width: (width - 15) }}
                    multiline={true}
                    textAlignVertical='top'
                    placeholder={placeholder}
                    placeholderTextColor={colors.gray}
                    onChangeText={(input) => onChangeText(input)}
                    value={value}
                    returnKeyType={'done'}
                    blurOnSubmit={true} />
            </View>
        );
    }

}

//These are the proptypes for the RoundTextInput componenet, showing which are required and
//which are not
RoundTextInput.propTypes = {
    //A height & width is required for this component to render
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    placeHolder: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.string
}

export default RoundTextInput;
