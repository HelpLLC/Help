//This component will represest a single lined text input that will have a bottom border
//color and a placeholder
import React from 'react';
import { View, TextInput } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import PropTypes from 'prop-types';

export default function OneLineRoundedBoxInput(props) {
	//The one prop this will take is a placeholder text which will disappear when the user
	//starts typing as well as onChangeText function and a value
	const {
		placeholder,
		onChangeText,
		value,
		maxLength,
		width,
		password,
		autoCompleteType,
		keyboardType,
		autoCapitalize,
		additionalIcon,
	} = props;

	//This function makes sure that the correct props are passed into the component
	//A placeholder can be passed in as a prop & it is not required
	//A onChangeText function can be passed as prop but not required
	//There are many other optional ones
	OneLineRoundedBoxInput.propTypes = {
		placeholder: PropTypes.string,
		onChangeText: PropTypes.func,
		value: PropTypes.string,
		maxLength: PropTypes.number,
		width: PropTypes.number,
		password: PropTypes.bool,
		autoCompleteType: PropTypes.string,
		keyboardType: PropTypes.string,
		autoCapitalize: PropTypes.string,
	};

	return (
		<View
			style={{
				borderWidth: 3,
				borderColor: colors.lightBlue,
				width: width ? width : screenWidth * 0.6,
				height: screenHeight * 0.06,
				borderRadius: 20,
				paddingLeft: 10,
				backgroundColor: colors.white,
				alignItems: 'center',
				flexDirection: 'row',
			}}>
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={colors.gray}
				onChangeText={(input) => onChangeText(input)}
				style={{
					color: colors.black,
					width: width
						? additionalIcon
							? width * 0.8
							: width
						: additionalIcon
						? screenWidth * 0.48
						: screenWidth * 0.55,
					height: screenHeight * 0.06,
				}}
				secureTextEntry={password}
				keyboardType={keyboardType ? keyboardType : 'default'}
				blurOnSubmit={true}
				returnKeyType={'done'}
				value={value}
				autoCompleteType={autoCompleteType ? autoCompleteType : 'off'}
				autoCapitalize={
					autoCompleteType === 'email' ||
					autoCompleteType === 'password' ||
					autoCapitalize === 'none'
						? 'none'
						: 'sentences'
				}
				maxLength={maxLength}
			/>
			{additionalIcon ? additionalIcon : <View />}
		</View>
	);
}
