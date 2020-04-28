import React, { useEffect, useState } from 'react';
import { Image } from 'react-native-web';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import BusinessServiceCardStyle from './BusinessServiceCardStyle';
import { Divider } from '@material-ui/core';
// import image from '../images/download.jpg';
import fontStyles from '../../config/fontStyles.js';

export default function BusinessServiceCard(props) {
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

	// This method is going to load the image and set it to the state
	const loadImage = async () => {
		const loadedImage = await image();
		setLoadedImage(loadedImage);
	};

	useEffect(() => {
		loadImage();
	}, []);

	return (
		<Card style={{...BusinessServiceCardStyle.cardcontainer}}>
			<CardContent style={{...fontStyles.mainTextStyleBlack}}>
				<Typography style={{...BusinessServiceCardStyle.house}}>{title}</Typography>
				<Divider varient='middle' />
				{/* <Image style={{ height: 50, width: 50 }} source={loadedImage} /> */}
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent style={{...BusinessServiceCardStyle.body1, ...fontStyles.mainTextStyleBlack}}>
				<Typography style={{...BusinessServiceCardStyle.rating}}>Rating</Typography>
				<Divider varient='middle' />
				<Typography>{averageRating} stars</Typography>
				<Typography>{totalReviews} reviews</Typography>
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent style={{...BusinessServiceCardStyle.body2, ...fontStyles.mainTextStyleBlack}}>
				<Typography style={{...BusinessServiceCardStyle.price}}>Price</Typography>
				<Divider varient='middle' />
				<Typography>{priceText}</Typography>
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent style={{...BusinessServiceCardStyle.body3, ...fontStyles.mainTextStyleBlack}}>
				<Typography style={{...BusinessServiceCardStyle.description}}>Description</Typography>
				<Divider varient='middle' />
				<Typography>{serviceDescription}</Typography>
			</CardContent>
			<Divider orientation='vertical' flexItem />
			<CardContent style={{...BusinessServiceCardStyle.body4, ...fontStyles.mainTextStyleBlack}}>
				<Typography style={{...BusinessServiceCardStyle.requests}}>Requests</Typography>
				<Divider varient='middle' />
				<Typography>{numCurrentRequests} upcoming requests</Typography>
			</CardContent>
			<Divider orientation='vertical' flexItem />
		</Card>
	);
}