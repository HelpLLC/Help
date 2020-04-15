//This component is the round blue action button that will be used throughout the
//application
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

export default function HelpButton(props) {
	//This function makes sure that the correct props are passed into the component
	//It says that a button title is required, an onPress function is optional, along
	//with a style that is also optional, and a disabled functionality that is also optional
	HelpButton.propTypes = {
		title: PropTypes.string.isRequired,
		isLoading: PropTypes.bool,
		disabled: PropTypes.bool,
		onPress: PropTypes.func,
		textStyle: PropTypes.object,
	};

	//sets up what properties the custom component should take in, which in this case
	//is a title for the button and a style along with an onPress function for what the button
	//should do when clicked. Will also take an optional isLoading to show if the screen is loading so the button
	//doesn't display
	return (
		//If button is loading, LoadingSpinner will appear
		<View style={{ alignItems: 'center' }}>
			{props.isLoading && props.isLoading === true ? (
				<LoadingSpinner isVisible={true} />
			) : (
				//creates the button, styles it, and initializes it with the correct text and
				//what the button should do when pressed.
				<TouchableOpacity
					onPress={props.onPress}
					style={props.style}
					disabled={props.disabled ? props.disabled : false}>
					<Text style={props.textStyle}>{props.title}</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}
