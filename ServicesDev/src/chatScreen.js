//This screen will represent the actual screen where two users communicate with each other. It will be 
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

class chatScreen extends Component {
    render() {
        return (
            <GiftedChat
                placeholder={"Type a message"} />
        )
    }
}

export default chatScreen;