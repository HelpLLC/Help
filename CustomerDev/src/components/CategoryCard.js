//This component will represent the card which which will display a category.
//The card will only be accessible from requester side. Cicking on the category would allow them to view
//the category and view services that are part of this category.
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { BoxShadow } from 'react-native-shadow';
import FastImage from 'react-native-fast-image';

//The component function
export default function CategoryCard(props) {
	//Starts out the loading state as true until the image is downloaded from the database
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [image, setImage] = useState('');

	//These are the propTypes for the topBanner component. It defines whether they are required or not
	//and what their types should be
	CategoryCard.propTypes = {
		categoryTitle: PropTypes.string.isRequired,
		imageFunction: PropTypes.func.isRequired,
		onPress: PropTypes.func.isRequired,
	};

	const loadImage = async () => {
		const { imageFunction } = props;
		const url = await imageFunction();

		setIsImageLoading(false);
		setImage(url);
	};

	//Loads the image (async)
	useEffect(() => {
		loadImage()
	}, []);

	//The props for the CategoryCard. It will take in a category title, an
	//image to display, and an onPress method.
	const { categoryTitle, onPress } = props;

	//Returns the component
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
						height: screenHeight * 0.275,
						color: colors.gray,
						border: 10,
						radius: screenHeight * 0.0439238653,
						opacity: 0.2,
						x: 0,
						y: 10,
					}}>
					<View
						style={{
							width: screenWidth * 0.45,
							height: screenHeight * 0.275,
							flexDirection: 'column',
							backgroundColor: colors.white,
							borderColor: colors.lightBlue,
							borderWidth: 6,
							borderRadius: screenHeight * 0.0439238653,
						}}>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
									source={image}
									style={{
										width: screenWidth * 0.25,
										height: screenWidth * 0.25,
									}}
								/>
							)}
						</View>
						<View
							style={{
								flexDirection: 'column',
								flex: 0.5,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Text style={[fontStyles.mainTextStyle, fontStyles.black ]}>{categoryTitle}</Text>
						</View>
					</View>
				</BoxShadow>
			</View>
		</TouchableOpacity>
	);
}
