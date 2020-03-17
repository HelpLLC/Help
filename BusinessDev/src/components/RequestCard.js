//This component will represent the card which which will display a service as the narrow card.
//The card will only be accessible from requester side. Cicking on the service would allow them to view
//the service and request it if they need it.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import requestCardStyle from 'config/styles/componentStyles/requestCardStyle';
import FastImage from 'react-native-fast-image';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';
import strings from 'config/strings';

//The component class
class RequestCard extends Component {
	//Renders the component
	render() {
		//The props for the RequestCard.
		const { serviceTitle, time, onPress, customerName, image } = this.props;
		//Returns the rendered component
		return (
			<TouchableOpacity
				onPress={() => onPress()}
				style={{
					width: Dimensions.get('window').width * 0.7,
					height: Dimensions.get('window').height * 0.135,
					marginBottom: Dimensions.get('window').height * 0.01,
					alignItems: 'center',
					justifyContent: 'center'
				}}>
				<View style={requestCardStyle.style}>
					<View style={{ flexDirection: 'row' }}>
						<View>
							<View
								style={{
									marginLeft: Dimensions.get('window').width * 0.025,
									marginTop: Dimensions.get('window').height * 0.01
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>{time}</Text>
							</View>
							<View
								style={{
									marginLeft: Dimensions.get('window').width * 0.025,
									marginTop: Dimensions.get('window').height * 0.01
								}}>
								<Text style={fontStyles.subTextStyleBlack}>{serviceTitle}</Text>
							</View>
							<View
								style={{
									marginLeft: Dimensions.get('window').width * 0.025,
									marginTop: Dimensions.get('window').height * 0.01
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
								marginRight: Dimensions.get('window').width * 0.025,
								marginTop: Dimensions.get('window').height * 0.01
							}}>
							<FastImage
								style={{
									width: Dimensions.get('window').height * 0.07,
									height: Dimensions.get('window').height * 0.07,
									borderRadius: Dimensions.get('window').height * 0.035
								}}
								source={image}
							/>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

//These are the propTypes for the component
RequestCard.propTypes = {
	serviceTitle: PropTypes.string.isRequired,
	time: PropTypes.string.isRequired,
	customerName: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	image: PropTypes.object.isRequired
};

//exports the module
export default RequestCard;
