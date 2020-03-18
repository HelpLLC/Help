//This component is the round blue action button that will be used throughout the
//application
import React, { Component } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { screenWidth, screenHeight } from 'config/dimensions';
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";

class RoundBlueButton extends Component {
  render() {
    //sets up what properties the custom component should take in, which in this case
    //is a title for the button and a style along with an onPress function for what the button
    //should do when clicked. Will also take an optional isLoading to show if the screen is loading so the button
    //doesn't display
    const {
      title,
      onPress,
      style,
      textStyle,
      disabled,
      isLoading
    } = this.props;
    return (
      //If button is loading, LoadingSpinner will appear
      <View style={{ alignItems: "center" }}>
        {isLoading && isLoading === true ? (
          <LoadingSpinner isVisible={true} />
        ) : (
          //creates the button, styles it, and initializes it with the correct text and
          //what the button should do when pressed.
          <TouchableOpacity
            onPress={onPress}
            style={style}
            disabled={disabled ? disabled : false}
          >
            <Text style={textStyle}>{title}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

//This function makes sure that the correct props are passed into the component
//It says that a button title is required, an onPress function is optional, along
//with a style that is also optional, and a disabled functionality that is also optional
RoundBlueButton.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  textStyle: PropTypes.object
};

//exports the module
export default RoundBlueButton;
