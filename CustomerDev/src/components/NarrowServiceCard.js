//This component will represent the card which which will display a service as the narrow card.
//The card will only be accessible from requester side. Cicking on the service would allow them to view
//the service and request it if they need it.
import React, { Component, useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import narrowServiceCardStyle from 'config/styles/componentStyles/narrowServiceCardStyle';
import FastImage from 'react-native-fast-image';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import { Rating, AirbnbRating } from 'react-native-ratings';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { BoxShadow } from 'react-native-shadow';

//The component class
export default function NarrowServiceCardFunction(props) {
	//Starts out the loading state as true until the image is downloaded from the database
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [image, setImage] = useState('');

	// useEffect can't return a promise so this async function returns it, which is called in useEffect
	loadImage = async () => {
		const { imageFunction } = props;
		const url = await imageFunction();
		setImage(url);
		setIsImageLoading(false);
	};

	//Loads the image
	useEffect(() => {
		loadImage();
	});

	//These are the propTypes for the topBanner component. It defines whether they are required or not
	//and what their types should be
	NarrowServiceCardFunction.propTypes = {
		serviceTitle: PropTypes.string.isRequired,
		price: PropTypes.string.isRequired,
		imageFunction: PropTypes.func.isRequired,
		onPress: PropTypes.func.isRequired,
	};

	//The props for the NarrowServiceCard. It will take in a service title, a price, and a
	//image to display, along with an onPress method. An additional prop is also how many current
	//requests this product currently has. This prop should only be used by the provider screens
	//It can also take the average reviews
	const { serviceTitle, price, onPress, averageRating, totalReviews } = props;

	//Fetches the image and the isImageLoading from the state
	// const { isImageLoading, image } = this.state;
	//Returns the rendered component
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				width: screenWidth * 0.45,
				height: screenHeight * 0.35,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<View>
				<BoxShadow
					setting={{
						width: screenWidth * 0.45,
						height: screenHeight * 0.26,
						color: colors.gray,
						border: 10,
						radius: screenHeight * 0.0439238653,
						opacity: 0.2,
						x: 0,
						y: 10,
					}}>
					<View style={narrowServiceCardStyle.style}>
						<View style={{ flex: 1 }}>
							{isImageLoading === true ? (
								<View
									style={{
										flex: 1,
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<LoadingSpinner isVisible={true} />
								</View>
							) : (
								<FastImage
									style={{
										width: screenWidth * 0.45 - 7,
										height: screenHeight * 0.13,
										borderRadius: screenHeight * 0.0439238653 - 3.5,
									}}
									source={image}
								/>
							)}
						</View>
						<View style={{ flex: 0.5 }}></View>
						<View
							style={{
								flexDirection: 'column',
								flex: 1.5,
								alignItems: 'flex-start',
								justifyContent: 'space-evenly',
							}}>
							<Text
								style={[
									fontStyles.mainTextStyleBlack,
									{
										paddingLeft: screenWidth * 0.025,
									},
								]}>
								{serviceTitle}
							</Text>
							{totalReviews > 0 ? (
								<View
									style={{
										flexDirection: 'row',
										paddingLeft: screenWidth * 0.025,
										alignItems: 'center',
									}}>
									<AirbnbRating
										count={5}
										size={15}
										isDisabled={true}
										defaultRating={averageRating}
										showRating={false}
									/>
									<Text style={fontStyles.subTextStyleBlack}>
										{' '}
										({totalReviews})
									</Text>
								</View>
							) : (
								<View></View>
							)}
							<Text
								style={[
									fontStyles.mainTextStyleBlack,
									{
										paddingLeft: screenWidth * 0.025,
									},
								]}>
								{price}
							</Text>
						</View>
					</View>
				</BoxShadow>
			</View>
		</TouchableOpacity>
	);
}
