//This screen will represent the actual screen where two users communicate with each other. It will be 
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import colors from 'config/colors';
import { View } from 'react-native';

class chatScreen extends Component {

    render(props) {
        return (
            <View style={{ backgroundColor: colors.lightGray, flex: 1 }}>
                <GiftedChat
                    {...props}
                    placeholder={"Type a message..."} />
            </View>
        )
    }
}

export default chatScreen;