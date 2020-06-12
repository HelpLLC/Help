//This component is the round blue action button that will be used throughout the
//application
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native-web';
import PropTypes from 'prop-types';
import './HelpButtonGradient.css';
import HelpButtonStyle from './HelpButtonStyle';
import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';
import ReactLoading from 'react-loading';

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
		height,
		isSmallButton,
		isSmallButton2,
		fontStyle,
	} = props;

	//sets up what properties the custom component should take in, which in this case
	//is a title for the button and a style along with an onPress function for what the button
	//should do when clicked. Will also take an optional isLoading to show if the screen is loading so the button
	//doesn't display
	if (isLoading === true) {
		//Loading state
		return (
			<View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
				<ReactLoading type={'bars'} color={colors.lightBlue} width='5vw' />
			</View>
		);
	} else {
		return (
			<button
				className={
					isLightButton
						? 'whiteDiv'
						: isRedButton
						? 'redDiv'
						: isSmallButton
						? 'gradientDivSmall'
						: isSmallButton2
						? 'gradientDivSmall2'
						: 'gradientDiv'
				}
				onClick={onPress}
				disabled={disabled ? disabled : false}
				style={
					isCircleBlueButton
						? {
								...HelpButtonStyle.CircleBlueButton,
								width,
								height: height,
								borderRadius: width,
						  }
						: {
								...HelpButtonStyle.MainButton,
								width: width ? width : '20vw',
								height: height ? height : '8.78vh',
						  }
				}>
				<Text
					style={
						fontStyle
							? fontStyle
							: isLightButton
							? {
									...fontStyles.mainTextStyle,
									...fontStyles.blue,
									...fontStyles.bold,
									textAlign: 'center',
							  }
							: {
									...fontStyles.mainTextStyle,
									...fontStyles.white,
									...fontStyles.bold,
									textAlign: 'center',
							  }
					}>
					{title}
				</Text>
			</button>
		);
	}
}
