//This component is the round blue action button that will be used throughout the
//application
import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

class RoundBlueButton extends Component {
    render() {
        //sets up what properties the custom component should take in, which in this case
        //is a title for the button and a style along with an onPress function for what the button
        //should do when clicked
        const { title, onPress, style, textStyle } = this.props;
        return (
            //creates the button, styles it, and initializes it with the correct text and 
            //what the button should do when pressed.
            <TouchableOpacity onPress={onPress} style={style}>
                <Text style={textStyle}>{title}</Text>
            </TouchableOpacity>
        );
    }
}

//This function makes sure that the correct props are passed into the component
//It says that a button title is required, an onPress function is optional, along
//with a style that is also optional
RoundBlueButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    textStyle: PropTypes.object,
}

//exports the module
export default RoundBlueButton;