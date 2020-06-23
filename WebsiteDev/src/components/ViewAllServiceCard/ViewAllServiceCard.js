import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../HelpButton/HelpButton';
import PropTypes from 'prop-types';
import fontStyles from '../../config/fontStyles';
import strings from '../../config/strings';
import { useHistory } from 'react-router-dom';
import UnconfirmedServiceCardStyle from './ViewAllServiceCardStyle';
import guy from './guy.png';

export default function UnconfirmedServiceCard(props) {
	//Starts out the loading state as true until the image is downloaded from the database
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [image, setImage] = useState();
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

	UnconfirmedServiceCard.propTypes = {
		height: PropTypes.number,
		width: PropTypes.number,
		// image: PropTypes.string,
		service: PropTypes.string,
		paymentStatus: PropTypes.string,
		name: PropTypes.string,
		completedDate: PropTypes.string,
		total: PropTypes.string,
	};

	const { service, name, date, time } = props;

	return (
		<View>
			<View style={{ ...UnconfirmedServiceCardStyle.card }}>
				<View style={{ ...UnconfirmedServiceCardStyle.row }}>
					<Text
						style={{
							...fontStyles.mainTextStyle,
							...fontStyles.darkBlue,
						}}>
						{service}
					</Text>
				</View>

				<View style={{ ...UnconfirmedServiceCardStyle.col }}>
				<View style={{ ...UnconfirmedServiceCardStyle.row }}>
					<Image style={{ ...UnconfirmedServiceCardStyle.profileImage }} source={image} />
					<View style={{ ...UnconfirmedServiceCardStyle.firstInfoRow }}>
						<View style={{ ...UnconfirmedServiceCardStyle.row }}>
							<Text style={{ ...UnconfirmedServiceCardStyle.requestFromText }}>
								{strings.RequestFrom}
							</Text>
							<Text style={{ ...UnconfirmedServiceCardStyle.dateText }}>
								{date}
							</Text>
						</View>
					</View>
				</View>

				<View style={{ ...UnconfirmedServiceCardStyle.secondInfoRow }}>
					<View style={{ ...UnconfirmedServiceCardStyle.row }}>
						<Text style={{ ...UnconfirmedServiceCardStyle.nameText }}>{name}</Text>
						<Text style={{ ...UnconfirmedServiceCardStyle.timeText }}>{time}</Text>
					</View>
				</View>
				<View style={{ ...UnconfirmedServiceCardStyle.viewMoreButton }}>
					<HelpButton
						title='View More'
						width='16.5vw'
						onPress={() =>
							history.push({
								pathname: '/viewrequest',
							})
						}
					/>
				</View>
            </View>
			</View>
		</View>
	);
}
