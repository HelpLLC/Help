//This component is the round blue action button that will be used throughout the
//application
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native-web';
import { screenWidth, screenHeight } from '../../config/dimensions';
import PropTypes from 'prop-types';
import './HelpButtonGradient.css';
import HelpButtonStyle from './HelpButtonStyle';
import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';

export default function HelpButton(props) {
	//This function makes sure that the correct props are passed into the component
	//It says that a button title is required, an onPress function is optional, along
	//with a style that is also optional, and a disabled functionality that is also optional
	HelpButton.propTypes = {
		title: PropTypes.string.isRequired,
		isLoading: PropTypes.bool,
		disabled: PropTypes.bool,
		onPress: PropTypes.func,
		isLightButton: PropTypes.bool,
		isRedButton: PropTypes.bool,
		isCircleBlueButton: PropTypes.bool,
	};

	const {
		isLoading,
		title,
		disabled,
		onPress,
		width,
		isLightButton,
		isRedButton,
		isCircleBlueButton,
	} = props;

	//sets up what properties the custom component should take in, which in this case
	//is a title for the button and a style along with an onPress function for what the button
	//should do when clicked. Will also take an optional isLoading to show if the screen is loading so the button
	//doesn't display
	if (isLoading === true) {
		//Loading state
		return <View></View>;
	} else {
		return (
			<div
				className={isLightButton ? 'whiteDiv' : isRedButton ? 'redDiv' : 'gradientDiv'}
				style={
					isCircleBlueButton
						? { ...HelpButtonStyle.CircleBlueButton, width }
						: { ...HelpButtonStyle.MainButton, width }
				}>
				<TouchableOpacity
					style={
						isCircleBlueButton
							? { ...HelpButtonStyle.CircleBlueButton, width }
							: { ...HelpButtonStyle.MainButton, width }
					}
					onPress={onPress}
					disabled={disabled ? disabled : false}>
					<Text
						style={
							isLightButton
								? width < screenWidth * 0.3
									? { ...fontStyles.mainTextStyleBlue, textAlign: 'center' }
									: { ...fontStyles.bigTextStyleBlue, textAlign: 'center' }
								: width < screenWidth * 0.3
								? { ...fontStyles.mainTextStyleWhite, textAlign: 'center' }
								: { ...fontStyles.bigTextStyleWhite, textAlign: 'center' }
						}>
						{title}
					</Text>
				</TouchableOpacity>
			</div>
		);
	}
}
