//This screen will represent the actual screen where two users communicate with each other. It will be 
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View } from 'react-native';
import TopBanner from './components/TopBanner';
import screenStyle from 'config/styles/screenStyle';

class chatScreen extends Component {

    render() {
        return (
            <GiftedChat
                placeholder={"Type a message..."} />
        )
    }
}

export default chatScreen;