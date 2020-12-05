//This component is the round blue action button that will be used throughout the
//application
import React from 'react';
import { TouchableOpacity, Text, View, Platform } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';
import HelpButtonStyle from './HelpButtonStyle';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import LinearGradient from 'react-native-linear-gradient';

export default function HelpButton(props) {
	//This function makes sure that the correct props are passed into the component
	//It says that a button title is required, an onPress function is optional, along
	//with a style that is also optional, and a disabled functionality that is also optional
	HelpButton.propTypes = {
		title: PropTypes.string.isRequired,
		isLoading: PropTypes.bool,
		disabled: PropTypes.bool,
		bold: PropTypes.bool,
		bigText: PropTypes.bool,
		biggerText: PropTypes.bool,
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
		height,
		bold,
		bigText,
		biggerText,
		isLightButton,
		isRedButton,
		isCircleBlueButton,
	} = props;

	//sets up what properties the custom component should take in, which in this case
	//is a title for the button and a style along with an onPress function for what the button
	//should do when clicked. Will also take an optional isLoading to show if the screen is loading so the button
	//doesn't display
	//If button is loading, LoadingSpinner will appear
	const textStyle = [];
	if(biggerText) textStyle.push(fontStyles.biggerTextStyle);
	else if(bigText) textStyle.push(fontStyles.bigTextStyle);
	else textStyle.push(width < screenWidth * 0.3 ? fontStyles.mainTextStyle : fontStyles.bigTextStyle);
	textStyle.push(isLightButton ? fontStyles.darkBlue : fontStyles.white);
	if(bold) textStyle.push(fontStyles.bold);

	if (isLoading === true) {
		return <LoadingSpinner isVisible={true} />;
	} else {
		return (
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={[
					[
						{
							width: width,
							height: height
								? height
								: isCircleBlueButton
								? screenHeight * 0.0732
								: screenHeight * 0.0878,
						},
						isLightButton
							? HelpButtonStyle.LightButton
							: isRedButton
							? HelpButtonStyle.RedButton
							: isCircleBlueButton
							? HelpButtonStyle.CircleBlueButton
							: HelpButtonStyle.BlueButton,
					],
				]}
				colors={isLightButton ? [colors.white,colors.white] : isRedButton ? [colors.red,colors.red] : [colors.green, colors.blue]}>
				<TouchableOpacity
					style={[
						[
							{
								width: width,
								height: height
									? height
									: isCircleBlueButton
									? screenHeight * 0.0732
									: screenHeight * 0.0878,
							},
							isLightButton
								? HelpButtonStyle.LightButton
								: isRedButton
								? HelpButtonStyle.RedButton
								: isCircleBlueButton
								? HelpButtonStyle.CircleBlueButton
								: HelpButtonStyle.BlueButton,
						],
					]}
					onPress={onPress}
					disabled={disabled ? disabled : false}>
					<Text
						style={textStyle}>
						{title}
					</Text>
				</TouchableOpacity>
			</LinearGradient>
		);
	}
}
