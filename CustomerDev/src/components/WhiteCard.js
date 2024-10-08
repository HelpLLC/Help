//This component will represent the generic card that will hold text on the left side and some
//icon or button on the right side.
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import PropTypes from 'prop-types';
import colors from 'config/colors';

export default function WhiteCard(props) {
	//These are the properties that will be passed into the component when it is created
	//A style for the button that includes its height and color, text and subtext, and some
	//component on the right side
	const { text, mainTextStyle, onPress, comp } = props;

	//This function describes the PropTypes and whether they area required or not for the white
	//card component
	WhiteCard.propTypes = {
		style: PropTypes.object.isRequired,
		text: PropTypes.string,
		mainTextStyle: PropTypes.object,
		iconName: PropTypes.string,
		onPress: PropTypes.func.isRequired,
	};

	return (
		//The component will render a view based on the given style which should always be text
		//on the left, and some icon or component on the right
		<TouchableOpacity
			style={{
				height: screenHeight * 0.07,
				width: screenWidth,
				backgroundColor: colors.white,
				alignItems: 'center',
			}}
			onPress={() => {
				onPress();
			}}>
			<View
				style={{
					height: screenHeight * 0.07,
					width: screenWidth - 30,
					backgroundColor: colors.white,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<View style={{ flexDirection: 'column' }}>
					<Text style={mainTextStyle}>{text}</Text>
				</View>
				<View style={{}}>{comp}</View>
			</View>
			<Text> </Text>
		</TouchableOpacity>
	);
}
