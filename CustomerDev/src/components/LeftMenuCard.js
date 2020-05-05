//This component will represent each Touchable Text in the Left Menu accessed by the hamburger Icon.
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';

export default function LeftMenuCard(props) {
	const { onPress, text, textColor, renderBorder } = props;

	//This component will take four different props. The Text to display, the onPress method for when the touchable opacity is clicked,
	//the color of the text, and whether to render a border at the bottom of the touchable opacity
	LeftMenuCard.propTypes = {
		text: PropTypes.string.isRequired,
		onPress: PropTypes.func.isRequired,
		textColor: PropTypes.string.isRequired,
		renderBorder: PropTypes.bool.isRequired,
	};

	return (
		<TouchableOpacity
			style={
				renderBorder === true
					? {
							height: screenHeight * 0.075,
							width: screenWidth * 0.55,
							marginRight: screenWidth * 0.07,
							justifyContent: 'center',
							alignItems: 'flex-start',
							borderBottomWidth: 1,
							borderBottomColor: colors.black,
					  }
					: {
							height: screenHeight * 0.075,
							width: screenWidth * 0.55,
							marginRight: screenWidth * 0.07,
							justifyContent: 'center',
							alignItems: 'flex-start',
					  }
			}
			onPress={() => {
				onPress();
			}}>
			<Text style={[fontStyles.bigTextStyle, { color: textColor }]}>{text}</Text>
		</TouchableOpacity>
	);
}
