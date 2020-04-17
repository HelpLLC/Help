import React, { useEffect, useState } from 'react';
import { Image } from 'react-native-web';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './BusinessServiceCard.css';
import { Divider } from '@material-ui/core';
import image from '../images/download.jpg';
import fontStyles from '../config/fontStyles.js';

function BusinessServiceCard(props) {
	const {
		title,
		image,
		totalReviews,
		averageRating,
		priceText,
		serviceDescription,
		numCurrentRequests,
	} = props;
	const [loaded, setLoaded] = useState();
	const [loadedImage, setLoadedImage] = useState();

	//This method is going to load the image and set it to the state
	const loadImage = async () => {
		const loadedImage = await image();
		setLoadedImage(loadedImage);
	};

	useEffect(() => {
		loadImage();
	}, []);

	return (
		<Card class='cardcontainer'>
			<CardContent style={fontStyles.mainTextStyleBlack}>
				<Typography class='house'>{title}</Typography>
				<Divider varient='middle' />
				<Image style={{ height: 50, width: 50 }} source={loadedImage} />
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent class='body1' style={fontStyles.mainTextStyleBlack}>
				<Typography class='rating'>Rating</Typography>
				<Divider varient='middle' />
				<Typography>{averageRating} stars</Typography>
				<Typography>{totalReviews} reviews</Typography>
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent class='body2' style={fontStyles.mainTextStyleBlack}>
				<Typography class='price'>Price</Typography>
				<Divider varient='middle' />
				<Typography>{priceText}</Typography>
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent class='body3' style={fontStyles.mainTextStyleBlack}>
				<Typography class='description'>Description</Typography>
				<Divider varient='middle' />
				<Typography>{serviceDescription}</Typography>
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent class='body4' style={fontStyles.mainTextStyleBlack}>
				<Typography class='requests'>Requests</Typography>
				<Divider varient='middle' />
				<Typography>{numCurrentRequests} upcoming requests</Typography>
			</CardContent>

			<Divider orientation='vertical' flexItem />
		</Card>
	);
}

export default BusinessServiceCard;
