//This component will represent the preview card where a chat with another user will be displayed.
//It will show the username of the person you are chatting with along with a preview of the most recent
//message. It will also have some compoenent on the right to indicate an onPress method
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import strings from 'config/strings';
import { screenWidth, screenHeight } from 'config/dimensions';
import PropTypes from 'prop-types';
import fontStyles from 'config/styles/fontStyles';
import colors from '../../config/colors';

//The component
export default function ChatCard(props) {
	//These are the propTypes for the topBanner component. It defines whether they are required or not
	//and what their types should be
	ChatCard.propTypes = {
		username: PropTypes.string.isRequired,
		previewText: PropTypes.string.isRequired,
		onPress: PropTypes.func.isRequired,
		timeText: PropTypes.number.isRequired,
	};

	//The props for this component will be a username, preview text, and a component and an onPress
	//method
	const { username, previewText, onPress, timeText } = props;

	//Returns the string that represents when the message was sent. Needs to be changed to replicated
	//If it was sent today, it shows the time. If it was sent within a week, it says the day. Otherwise,
	//shows the date
	getTimeTextString = (timeText) => {
		let dateSent = new Date(timeText);
		let today = new Date();
		//If same day
		if (
			today.getFullYear() === dateSent.getFullYear() &&
			today.getMonth() === dateSent.getMonth() &&
			today.getDate() === dateSent.getDate()
		) {
			return strings.Today;
		}
		//Less than 7 days ago
		else if (today.getTime() - dateSent.getTime() < 345600000) {
			return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
				dateSent.getDay()
			];
		} else {
			return dateSent.getMonth() + '/' + dateSent.getDate();
		}
	};

	const timeTextToString = getTimeTextString(timeText);
	return (
		<TouchableOpacity onPress={onPress}>
			<View
				style={{
					width: screenWidth,
					backgroundColor: colors.white,
					alignItems: 'center',
				}}>
				<View
					style={{
						width: screenWidth * 0.9,
						backgroundColor: colors.white,
						flexDirection: 'row',
						height: screenHeight * 0.12,
						alignItems: 'center',
						justifyContent: 'space-between',
						borderColor: colors.lightGray,
						borderBottomWidth: 0,
						borderRightWidth: 0,
						borderLeftWidth: 0,
						borderTopWidth: 1,
					}}>
					<View
						style={{
							flexDirection: 'column',
							justifyContent: 'flex-start',
						}}>
						<Text style={fontStyles.mainTextStyleBlack}>{username}</Text>
						<Text style={fontStyles.subTextStyleGray}>
							{previewText.length > 25
								? previewText.substring(0, 24).trim() + '...'
								: previewText}
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'column',
							justifyContent: 'flex-end',
						}}>
						<Text style={fontStyles.mainTextStyleGray}>{timeTextToString}</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}
