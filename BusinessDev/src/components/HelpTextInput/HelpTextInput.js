//This component will represent the TextInput that will be used to users to type into
import React from 'react';
import { View, TextInput } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpTextInputStyle from './HelpTextInputStyle';
import colors from 'config/colors';
import PropTypes from 'prop-types';

//The function will take in properties that are the value that the textinput will hold when it
//is first accessed, i.e, the instructions for what the user should type. It will also
//contain a height & width for how big the textInput will be along with a function to
//retrieve the input, and a max length that can be entered
export default function HelpTextInput(props) {
	//These are the proptypes for the HelpTextInput component, showing which are required and
	//which are not
	HelpTextInput.propTypes = {
		//A height & width is required for this component to render. Along with whether it is multiline, and what
		//the onChangeText function will return
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		borderColor: PropTypes.string,
		placeHolder: PropTypes.string,
		onChangeText: PropTypes.func.isRequired,
		value: PropTypes.string,
		maxLength: PropTypes.number,
		isMultiline: PropTypes.bool.isRequired,
		password: PropTypes.bool,
		autoCompleteType: PropTypes.string,
		keyboardType: PropTypes.string,
		autoCapitalize: PropTypes.string,
		additionalIcon: PropTypes.element,
	};

	const {
		width,
		height,
		borderColor,
		placeholder,
		onChangeText,
		value,
		maxLength,
		isMultiline,
		password,
		autoCompleteType,
		keyboardType,
		autoCapitalize,
		additionalIcon,
	} = props;

	return (
		//Creates a view that includes the interior TextInput so that the curvature doesn't
		//impact the text
		<View
			style={[
				HelpTextInputStyle.textInputContainerStyle,
				{
					width: width,
					height: height,
					borderColor: borderColor,
				},
			]}>
			<TextInput
				style={[
					HelpTextInputStyle.textInputStyle,
					{
						height: height * 1.065,
						width: additionalIcon ? width * 0.8 : width * 0.935,
					},
				]}
				multiline={isMultiline}
				keyboardType={keyboardType ? keyboardType : 'default'}
				textAlignVertical='top'
				secureTextEntry={password}
				autoCompleteType={autoCompleteType ? autoCompleteType : 'off'}
				placeholder={placeholder}
				placeholderTextColor={colors.gray}
				onChangeText={(input) => onChangeText(input)}
				value={value}
				returnKeyType={'done'}
				autoCapitalize={
					autoCompleteType === 'email' ||
					autoCompleteType === 'password' ||
					autoCapitalize === 'none'
						? 'none'
						: 'sentences'
				}
				maxLength={maxLength}
				blurOnSubmit={true}
			/>
			{additionalIcon ? additionalIcon : <View />}
		</View>
	);
}
