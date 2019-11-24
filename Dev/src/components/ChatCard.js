//This component will represent the preview card where a chat with another user will be displayed.
//It will show the username of the person you are chatting with along with a preview of the most recent
//message. It will also have some compoenent on the right to indicate an onPress method
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import strings from 'config/strings';
import chatCardStyle from 'config/styles/componentStyles/chatCardStyle';
import PropTypes from 'prop-types';
import fontStyles from 'config/styles/fontStyles';
import colors from '../../config/colors';

//The component
class ChatCard extends Component {
	//Returns the string that represents when the message was sent. Needs to be changed to replicated
	//If it was sent today, it shows the time. If it was sent within a week, it says the day. Otherwise,
	//shows the date
	getTimeTextString(timeText) {
		let dateSent = new Date(timeText);
		let today = new Date();
		//If same day
		if (
			today.getFullYear() === dateSent.getFullYear() &&
			today.getMonth() === dateSent.getMonth() &&
			today.getDate() === dateSent.getDate()
		) {
			return strings.Today
		}
		//Less than 7 days ago
		else if (today.getTime() - dateSent.getTime() < 345600000) {
			return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
				dateSent.getDay()
			];
		} else {
			return dateSent.getMonth() + '/' + dateSent.getDate();
		}
	}

	//Renders the component
	render() {
		//The props for this component will be a username, preview text, and a component and an onPress
		//method
		const { username, previewText, onPress, timeText } = this.props;

		const timeTextToString = this.getTimeTextString(timeText);
		return (
			<TouchableOpacity onPress={onPress}>
				<View
					style={{
						width: Dimensions.get('window').width,
						backgroundColor: colors.white,
						alignItems: 'center'
					}}>
					<View style={chatCardStyle.style}>
						<View
							style={{
								flexDirection: 'column',
								justifyContent: 'flex-start'
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{username}</Text>
							<Text style={fontStyles.subTextStyleGray}>
								{previewText.length > 25 ? previewText.substring(0, 24).trim() + '...' : previewText}
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'column',
								justifyContent: 'flex-end'
							}}>
							<Text style={fontStyles.mainTextStyleGray}>{timeTextToString}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

//These are the propTypes for the topBanner component. It defines whether they are required or not
//and what their types should be
ChatCard.propTypes = {
	username: PropTypes.string.isRequired,
	previewText: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	timeText: PropTypes.number.isRequired
};

//exports the module
export default ChatCard;
