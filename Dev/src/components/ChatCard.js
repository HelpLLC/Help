//This component will represent the preview card where a chat with another user will be displayed. 
//It will show the username of the person you are chatting with along with a preview of the most recent
//message. It will also have some compoenent on the right to indicate an onPress method
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import chatCardStyle from 'config/styles/componentStyles/chatCardStyle';
import PropTypes from 'prop-types';
import fontStyles from 'config/styles/fontStyles';
import colors from '../../config/colors';

//The component
class ChatCard extends Component {

    //Returns the string that represents when the message was sent. If it was sent today,
    //the time is displayed, if it was sent within the last week, the day is displayed,
    //if it was sent longer than a week ago, the date is displayed
    getTimeTextString(timeText) {
        todayDate = new Date();
        dateSent = new Date(timeText);

        //Same day
        if (todayDate.getDate() === dateSent.getDate()) {
            dateSent = dateSent.toLocaleTimeString();
            dateSent = dateSent.substring(0, dateSent.lastIndexOf(":")) + " " + dateSent.charAt(dateSent.length - 2) + dateSent.charAt(dateSent.length - 1);
            return dateSent;
        } else {
            dateString = dateSent.toDateString();
            return dateString.substring(dateString.indexOf(" "));
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

                <View style={{ width: Dimensions.get('window').width, backgroundColor: colors.white, alignItems: 'center' }}>
                    <View style={chatCardStyle.style}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}>
                            <Text style={fontStyles.mainTextStyleBlack}>{username}</Text>
                            <Text style={fontStyles.subTextStyleGray}>{
                                previewText.length > 35 ? (previewText.substring(0, 35) + "...") :
                                previewText}</Text>
                        </View>
                        <View style={{
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
}

//These are the propTypes for the topBanner component. It defines whether they are required or not
//and what their types should be
ChatCard.propTypes = {
    username: PropTypes.string.isRequired,
    previewText: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    timeText: PropTypes.number.isRequired
}

//exports the module
export default ChatCard;