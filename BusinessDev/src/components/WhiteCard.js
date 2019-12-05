//This component will represent the generic card that will hold text on the left side and some
//icon or button on the right side.
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import colors from 'config/colors';

class WhiteCard extends Component {
	render() {
		//These are the properties that will be passed into the component when it is created
		//A style for the button that includes its height and color, text and subtext, and some
		//component on the right side
		const { style, text, mainTextStyle, onPress, comp } = this.props;
		return (
			//The component will render a view based on the given style which should always be text
			//on the left, and some icon or component on the right
			<TouchableOpacity
				style={{
					height: Dimensions.get('window').height * 0.07,
					width: Dimensions.get('window').width,
					backgroundColor: colors.white,
					alignItems: 'center'
				}}
				onPress={() => {
					onPress();
				}}>
				<View style={style}>
					<View style={{ flexDirection: 'column' }}>
						<Text style={mainTextStyle}>{text}</Text>
					</View>
					<View style={{}}>{comp}</View>
				</View>
				<Text> </Text>
			</TouchableOpacity>
		);
	}
}

//This function describes the PropTypes and whether they area required or not for the white
//card component
WhiteCard.propTypes = {
	style: PropTypes.object.isRequired,
	text: PropTypes.string,
	mainTextStyle: PropTypes.object,
	iconName: PropTypes.string,
	onPress: PropTypes.func.isRequired
};

//exports the module
export default WhiteCard;
