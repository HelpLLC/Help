//This component will represent the card which which will display a service as the narrow card.
//The card will only be accessible from requester side. Cicking on the service would allow them to view
//the service and request it if they need it.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import requestCardStyle from 'config/styles/componentStyles/requestCardStyle';
import FastImage from 'react-native-fast-image';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';
import strings from 'config/strings';

//The component function
export default function RequestCard(props) {
	//The props for the RequestCard.
	const { serviceTitle, time, onPress, customerName, image } = props;

	//These are the propTypes for the component
	RequestCard.propTypes = {
		serviceTitle: PropTypes.string.isRequired,
		time: PropTypes.string.isRequired,
		customerName: PropTypes.string.isRequired,
		onPress: PropTypes.func.isRequired,
		image: PropTypes.object.isRequired,
	};

	//Returns the rendered component
	return (
		<TouchableOpacity
			onPress={() => onPress()}
			style={{
				width: screenWidth * 0.7,
				height: screenHeight * 0.135,
				marginBottom: screenHeight * 0.01,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<View style={requestCardStyle.style}>
				<View style={{ flexDirection: 'row' }}>
					<View>
						<View
							style={{
								marginLeft: screenWidth * 0.025,
								marginTop: screenHeight * 0.01,
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{time}</Text>
						</View>
						<View
							style={{
								marginLeft: screenWidth * 0.025,
								marginTop: screenHeight * 0.01,
							}}>
							<Text style={fontStyles.subTextStyleBlack}>{serviceTitle}</Text>
						</View>
						<View
							style={{
								marginLeft: screenWidth * 0.025,
								marginTop: screenHeight * 0.01,
							}}>
							<Text style={fontStyles.subTextStyleBlack}>
								{strings.RequestedBy} {customerName}
							</Text>
						</View>
					</View>
					<View
						style={{
							alignItems: 'flex-end',
							flex: 1,
							marginRight: screenWidth * 0.025,
							marginTop: screenHeight * 0.01,
						}}>
						<FastImage
							style={{
								width: screenHeight * 0.07,
								height: screenHeight * 0.07,
								borderRadius: screenHeight * 0.035,
							}}
							source={image}
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}
