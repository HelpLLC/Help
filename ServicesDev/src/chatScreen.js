//This screen will represent the actual screen where two users communicate with each other. It will be 
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import colors from 'config/colors';
import { View } from 'react-native';
import { connect } from 'react-redux';

class chatScreen extends Component {

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
        console.log(this.state.messages);
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
                        _id: 1
                    }}
                    renderAvatar={null}
                    onSend={(message) => { this.sendMessage(message) }} />
            </View>
        )
    }
}

//Connects this screens' props with messages belonging to the user
const mapStateToProps = state => {
    const messages = state.providerReducer.messages[0].conversationMessages;
    return { messages };
};
export default connect(mapStateToProps)(chatScreen);