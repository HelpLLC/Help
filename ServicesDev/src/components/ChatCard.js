//This component will represent the preview card where a chat with another user will be displayed. 
//It will show the username of the person you are chatting with along with a preview of the most recent
//message. It will also have some compoenent on the right to indicate an onPress method
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import chatCardStyle from 'config/styles/componentStyles/chatCardStyle';
import PropTypes from 'prop-types';
import fontStyles from 'config/styles/fontStyles';

//The component
class ChatCard extends Component {

    //Renders the component
    render() {

        //The props for this component will be a username, preview text, and a component and an onPress
        //method
        const { username, previewText, comp, onPress } = this.props;

        return (
            <TouchableOpacity onPress={onPress}>

                <View style={chatCardStyle.style}>
                    <View style={{ 
                        flexDirection: 'column',
                        justifyContent: 'space-evenly', 
                        paddingLeft: 30 }}>
                        <Text style={[fontStyles.mainTextStyleBlack, {paddingBottom: 3}]}>{username}</Text>
                        <Text style={fontStyles.subTextStyleGray}>{previewText}</Text>
                    </View>
                    <View style={{ paddingRight: 30, paddingBottom: 10 }}>
                        {comp}
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
}

//exports the module
export default ChatCard;