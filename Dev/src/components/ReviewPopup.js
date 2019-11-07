//This component will represent the default pop up that will appear when the user needs to make a decision
//The component will ask a question, and there will be a confirm button and a cancel button, which custom
//texts passed in as props. Based on the clicked option, a function is called, also passed in as a prop
import React, { Component } from 'react';
import { Modal, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import AwesomeAlert from 'react-native-awesome-alerts';
import colors from 'config/colors';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ImageWithBorder from '../components/ImageWithBorder';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';
import strings from 'config/strings';

//The class that will render the alert
class ReviewPopup extends Component {
	render() {
		const {
			isVisible,
			confirmText,
			cancelText,
			confirmOnPress,
			cancelOnPress,
			title,
			message,
			oneOption,
			clickOutside,
			value,
			placeholder
		} = this.props;
		return (
			<View>
				<Modal visible={isVisible} transparent={true}>
					<AwesomeAlert
						show={isVisible}
						title={title}
						message={message}
						closeOnTouchOutside={clickOutside}
						customView={
							<View
								style={
									((width = Dimensions.get('window').height * 0.65),
									(height = Dimensions.get('window').height * 0.65))
								}>
								<View
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										paddingVertical: Dimensions.get('window').height * 0.025
									}}>
									<ImageWithBorder
										style={{
											flex: 1
										}}
										width={Dimensions.get('window').height * 0.075}
										height={Dimensions.get('window').height * 0.075}
										imageFunction={async () => {
											//Passes in the function to retrieve the image of this product
											return await FirebaseFunctions.getProfilePictureByID(
												this.props.requester.providerId
											);
										}}
									/>
								</View>
								<Rating />
								<MultiLineRoundedBoxInput
									stle={{ flex: 3 }}
									width={Dimensions.get('window').width * 0.6}
									height={Dimensions.get('window').height * 0.14641}
									placeholder={placeholder}
									onChangeText={(input) => onChangeText(input)}
									value={value}
									maxLength={350}
								/>
							</View>
						}
						showCancelButton={oneOption === true ? false : true}
						showConfirmButton={true}
						confirmButtonColor={colors.lightBlue}
						cancelButtonColor={colors.gray}
						confirmText={confirmText}
						cancelText={cancelText}
						onConfirmPressed={() => {
							confirmOnPress();
						}}
						onCancelPressed={() => {
							cancelOnPress();
						}}
						onDismiss={() => {
							cancelOnPress();
						}}
					/>
				</Modal>
			</View>
		);
	}
}

//Defines the types of props that this component should take. For this, it should only take the state
//to determine whether it shows or not, as well as the onPress method for the confirm message.
//It will take an optional prop to only take in one button making it just an alert
ReviewPopup.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	confirmText: PropTypes.string.isRequired,
	cancelText: PropTypes.string,
	confirmOnPress: PropTypes.func.isRequired,
	cancelOnPress: PropTypes.func,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	onChangeText: PropTypes.func.isRequired,
	value: PropTypes.string,
	placeholder: PropTypes.string
};

//Exports the module
export default ReviewPopup;
