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

	// const loadImage = async () => {
	// 	const { imageFunction } = props;
	// 	const url = await imageFunction();
	// 	setIsImageLoading(false);
	// 	setImage(url);
	// };

	// // Loads the image (async)
	// useEffect(() => {
	// 	loadImage();
	// }, []);

	EmployeeListItem.propTypes = {
		height: PropTypes.number,
		width: PropTypes.number,
		image: PropTypes.string,
		name: PropTypes.string,
	};

	const { width, height, name } = props;

	return (
		<View>
			<View style={{ ...EmployeeListItemStyle.listItem }}>
				<View style={{ ...EmployeeListItemStyle.row }}>
					<Image style={{ ...EmployeeListItemStyle.profileImage }} source={image} />
					<Text style={{ ...EmployeeListItemStyle.nameText }}>
						{props.name}
					</Text>
				</View>
				<View style={{ ...EmployeeListItemStyle.assignButton }}>
					{(!assigned ? (<HelpButton
						title={strings.Assign}
						width='9vw'
						onPress={() => {
							history.push({
								pathname: '/viewrequest',
							})
							setAssigned(true);
						}
						}
					/>) : (
						<Text style={{ ...EmployeeListItemStyle.assignedText }}>
							{strings.Assigned}
						</Text>
					))}
				</View>
			</View>
		</View>
	);
}
