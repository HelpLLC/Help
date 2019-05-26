//This screen will represent the actual screen where two users communicate with each other. It will be 
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import colors from 'config/colors';
import { View } from 'react-native';

class messagingScreen extends Component {

    //should be set the messages of this user with the other user
    state = {
        messages: this.props.messages
    }

    //sends a message to the reciever by adding it to their end and t
    sendMessage(message) {
        //refreshes the state so that the new message is displayed
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, message)
        }));

        //Adds the message to the database of messages
        this.props.sendMessage(
            this.props.providerID, 
            this.props.requesterID, 
            message, this.props.provider.companyName, 
            this.props.requester.username);

    }

    //Renders the screen using the gifted chat module and binding it with the props of the screen
    render(props) {
        return (
            <View style={{ backgroundColor: colors.lightGray, flex: 1 }}>
                <GiftedChat
                    {...props}
                    messages={this.state.messages}
                    placeholder={"Type a message..."}
                    user={{
                        _id: this.props.userID
                    }}
                    renderAvatar={null}
                    onSend={(message) => { this.sendMessage(message) }} />
            </View>
        )
    }
}

export default messagingScreen;