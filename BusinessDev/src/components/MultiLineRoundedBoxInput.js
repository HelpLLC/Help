//This component will represent the TextInput that will be rounded and allow users to type
//multiple lines within it.
import React from 'react';
import { View, TextInput } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import PropTypes from 'prop-types';

//The function will take in properties that are the value that the textinput will hold when it
//is first accessed, i.e, the instructions for what the user should type. It will also
//contain a height & width for how big the textInput will be along with some functions to
//retrieve the input, and a max length that can be entered
export default function MultiLineRoundedBoxInput(props) {
	
	//These are the proptypes for the MultiLineRoundedBoxInput component, showing which are required and
	//which are not
	MultiLineRoundedBoxInput.propTypes = {
		//A height & width is required for this component to render
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		placeHolder: PropTypes.string,
		onChangeText: PropTypes.func.isRequired,
		value: PropTypes.string,
		maxLength: PropTypes.number,
	};

	const { width, height, placeholder, onChangeText, value, maxLength } = props;
	return (
		//Creates a view that includes the interior TextInput so that the curvature doesn't
		//impact the text
		<View
			style={{
				backgroundColor: colors.white,
				alignItems: 'center',
				justifyContent: 'center',
				height: height,
				width: width,
				borderRadius: screenHeight * 0.0292825769,
				borderWidth: 3,
				borderColor: colors.lightBlue,
			}}>
			<TextInput
				style={{
					height: height * 0.9,
					width: width * 0.935,
					color: colors.black,
				}}
				multiline={true}
				keyboardType={'default'}
				textAlignVertical='top'
				placeholder={placeholder}
				placeholderTextColor={colors.gray}
				onChangeText={(input) => onChangeText(input)}
				value={value}
				returnKeyType={'done'}
				maxLength={maxLength}
				blurOnSubmit={true}
			/>
		</View>
	);
}
