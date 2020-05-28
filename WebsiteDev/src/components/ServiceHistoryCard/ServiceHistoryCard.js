import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../HelpButton/HelpButton';
import PropTypes from 'prop-types';
import fontStyles from '../../config/fontStyles';
import strings from '../../config/strings';
import { useHistory } from 'react-router-dom';
import ServiceHistoryCardStyle from './ServiceHistoryCardStyle';

export default function ServiceHistoryCard(props) {
	//Starts out the loading state as true until the image is downloaded from the database
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [image, setImage] = useState(props.image);
	const history = useHistory();

	const loadImage = async () => {
		const { imageFunction } = props;
		const url = await imageFunction();
		setIsImageLoading(false);
		setImage(url);
	};

	// Loads the image (async)
	useEffect(() => {
		loadImage();
	}, []);

	ServiceHistoryCard.propTypes = {
		height: PropTypes.number,
		width: PropTypes.number,
		image: PropTypes.string,
		service: PropTypes.string,
		paymentStatus: PropTypes.string,
		name: PropTypes.string,
		completedDate: PropTypes.string,
		total: PropTypes.string,
	};

	const { width, height, service, paymentStatus, name, completedDate, total } = props;

	return (
		<View>
			<View style={{ ...ServiceHistoryCardStyle.card }}>
				<View style={{ ...ServiceHistoryCardStyle.row }}>
					<Text
						style={{
							...fontStyles.bigSubTitleStyle,
							...fontStyles.darkBlue,
						}}>
						{service}
					</Text>
					<View style={{ ...ServiceHistoryCardStyle.paymentStatus }}>
						<Text
							style={{
								...fontStyles.mainTextStyle,
								...fontStyles.white,
							}}>
							{paymentStatus}
						</Text>
					</View>
				</View>
				<View style={{ ...ServiceHistoryCardStyle.row }}>
					<Image
						style={{ ...ServiceHistoryCardStyle.profileImage }}
						source={image}
					/>
					<View style={{ ...ServiceHistoryCardStyle.firstInfoRow }}>
						<View style={{ ...ServiceHistoryCardStyle.row }}>
							<Text style={{ ...ServiceHistoryCardStyle.requestFromText }}>
								{strings.RequestFromHeader}
							</Text>
							<Text style={{ ...ServiceHistoryCardStyle.completedText }}>
								{strings.CompletedColon} {completedDate}
							</Text>
						</View>
						<View style={{ ...ServiceHistoryCardStyle.row }}>
							<Text style={{ ...ServiceHistoryCardStyle.nameText }}>{name}</Text>
							<Text style={{ ...ServiceHistoryCardStyle.totalText }}>
								{strings.TotalColonDollar}
								{total}
							</Text>
						</View>
					</View>
				</View>
				<View style={{ ...ServiceHistoryCardStyle.viewMoreButton }}>
					<HelpButton
						title='View More'
						width='10vw'
						onPress={() =>
							history.push({
								pathname: '/viewrequest',
							})
						}
					/>
				</View>
			</View>
		</View>
	);
}
