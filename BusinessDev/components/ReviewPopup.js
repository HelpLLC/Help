//This component will represent the default pop up that will appear when the user needs to make a decision
//The component will ask a question, and there will be a confirm button and a cancel button, which custom
//texts passed in as props. Based on the clicked option, a function is called, also passed in as a prop
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import AwesomeAlert from 'react-native-awesome-alerts';
import colors from 'config/colors';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ImageWithBorder from '../components/ImageWithBorder';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';

//The class that will render the alert
class ReviewPopup extends Component {
	render() {
		const {
			isVisible,
			confirmText,
			cancelText,
			confirmOnPress,
			cancelOnPress,
			onChangeText,
			title,
			message,
			value,
			placeholder,
			imageFunction
		} = this.props;
		return (
			<AwesomeAlert
				show={isVisible}
				title={title}
				message={message}
				closeOnTouchOutside={false}
				customView={
					<View>
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
									return await imageFunction();
								}}
							/>
						</View>
						<AirbnbRating
							onFinishRating={(rating) => this.props.onFinishRating(rating)}
							count={this.props.stars}
							size={30}
							showRating={false}
							defaultRating={0}
						/>
						<View style={{ paddingBottom: Dimensions.get('window').height * 0.025 }}></View>
						<MultiLineRoundedBoxInput
							width={Dimensions.get('window').width * 0.6}
							height={Dimensions.get('window').height * 0.1}
							placeholder={placeholder}
							onChangeText={(input) => onChangeText(input)}
							value={value}
							maxLength={350}
						/>
					</View>
				}
				showCancelButton={true}
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
		);
	}
}

//Defines the types of props that this component should take.
ReviewPopup.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	confirmText: PropTypes.string.isRequired,
	cancelText: PropTypes.string.isRequired,
	confirmOnPress: PropTypes.func.isRequired,
	cancelOnPress: PropTypes.func.isRequired,
	onChangeText: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	imageFunction: PropTypes.func.isRequired
};

//Exports the module
export default ReviewPopup;