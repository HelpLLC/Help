import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../HelpButton/HelpButton';
import PropTypes from 'prop-types';
import fontStyles from '../../config/fontStyles';
import strings from '../../config/strings';
import { useHistory } from 'react-router-dom';
import EmployeeListItemStyle from './EmployeeListItemStyle';

export default function EmployeeListItem(props) {
	//Starts out the loading state as true until the image is downloaded from the database
	const [isImageLoading, setIsImageLoading] = useState(true);
	const [image, setImage] = useState(props.image);
	const [assigned, setAssigned] = useState(false);
	const history = useHistory();

	const loadImage = async () => {
		const { imageFunction } = props;
		const url = await imageFunction();
		setIsImageLoading(false);
		setImage(url);
	};

	// Loads the image (async)
	useEffect(() => {
		// loadImage();
	}, []);

	EmployeeListItem.propTypes = {
		height: PropTypes.number,
		widthEntered: PropTypes.string,
		image: PropTypes.string,
		name: PropTypes.string,
		buttonText: PropTypes.string,
		buttonWidth: PropTypes.string,
	};

	const { widthEntered, height, name, buttonText, buttonWidth } = props;

	return (
		<View>
			<View style={{ ...EmployeeListItemStyle.listItem }}>
				<View style={{ ...EmployeeListItemStyle.row }}>
					<Image style={{ ...EmployeeListItemStyle.profileImage }} source={image} />
					<Text style={{ ...EmployeeListItemStyle.nameText }}>{props.name}</Text>
				</View>
				<View style={{ ...EmployeeListItemStyle.assignButton }}>
					{!assigned ? (
						<HelpButton
							title={buttonText != null ? buttonText : strings.Assign}
							width={buttonWidth != null ? buttonWidth : '9vw'}
							onPress={() => {
								history.push({
									pathname: '/viewrequest',
								});
								setAssigned(true);
							}}
						/>
					) : (
						<Text style={{ ...EmployeeListItemStyle.assignedText }}>{strings.Assigned}</Text>
					)}
				</View>
			</View>
		</View>
	);
}
