import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import BusinessServiceCardStyle from './BusinessServiceCardStyle';
import { Divider } from '@material-ui/core';
// import image from '../images/download.jpg';
import fontStyles from '../../config/fontStyles.js';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native-web';
import HelpButton from '../HelpButton/HelpButton';
import StarRatings from 'react-star-ratings';
import colors from '../../config/colors';

export default function BusinessServiceCard(props) {
	const {
		title,
		image,
		totalReviews,
		averageRating,
		priceText,
		serviceDescription,
		onPress,
		numCurrentRequests,
	} = props;
	const [loaded, setLoaded] = useState();
	const [loadedImage, setLoadedImage] = useState();

	// This method is going to load the image and set it to the state
	const loadImage = async () => {
		const loadedImage = await image();
		setLoadedImage(loadedImage);
	};

	useEffect(() => {
		loadImage();
	}, []);

	return (
		<TouchableOpacity onPress={onPress} style={BusinessServiceCardStyle.cardcontainer}>
			<View>
				<Image style={BusinessServiceCardStyle.image} source={loadedImage} />
			</View>
			<View style={BusinessServiceCardStyle.titleContainer}>
				<View>
					<Text style={BusinessServiceCardStyle.title}>{title}</Text>
				</View>
				<View style={BusinessServiceCardStyle.requestsContainer}>
					<Text style={BusinessServiceCardStyle.requestsText}>
						Current Number of Requests: {numCurrentRequests}
					</Text>
				</View>
				<View style={BusinessServiceCardStyle.starsContainer}>
					<StarRatings
						rating={averageRating}
						numberOfStars={5}
						starRatedColor={colors.yellow}
						starDimension={'2vw'}
						starSpacing={'0.25vw'}
					/>
				</View>
				<View style={BusinessServiceCardStyle.requestsContainer}>
					<Text style={BusinessServiceCardStyle.reviewsText}>{totalReviews} reviews</Text>
				</View>
			</View>
			<View style={BusinessServiceCardStyle.bottomSectionContainer}>
				<View style={BusinessServiceCardStyle.priceContainer}>
					<Text style={BusinessServiceCardStyle.priceText}>{priceText}</Text>
				</View>
				<View style={BusinessServiceCardStyle.buttonContainer}>
					<HelpButton title={'Edit'} isSmallButton={true} height={'4vh'} />
				</View>
			</View>
		</TouchableOpacity>
	);
}
