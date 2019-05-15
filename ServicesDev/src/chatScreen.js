//This screen will represent the actual screen where two users communicate with each other. It will be 
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import colors from 'config/colors';
import { View } from 'react-native';
import { sendMessage } from './redux/message/messageActions/sendMessage';
import { connect } from 'react-redux';
import Functions from 'config/Functions';
import { bindActionCreators } from 'redux';

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

        //Adds the message to the database of messages
        this.props.sendMessage(this.props.providerID, this.props.requesterID, message);

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

//Connects the screen with the actions that will add data to the database. These actions will
//be the ones that create the accounts
export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            sendMessage,
        },
        dispatch
    );

//Connects this screens' props with messages belonging to the user
const mapStateToProps = (state, props) => {

    const { providerID, requesterID } = props.navigation.state.params;

    //If this is a new conversation, then messages will be set to an empty array, else it will
    //be set to the conversation history.
    const messages = (Functions.isNewConversation(providerID, requesterID, state.messageReducer) ? [] :
        Functions.getConversationByID(providerID, requesterID, state.messageReducer).conversationMessages.sort((a, b) => {
            d1 = new Date(a.createdAt);
            d2 = new Date(b.createdAt);
            return d2.getTime() - d1.getTime();
        }));
    return { messages, providerID, requesterID };

};

export default connect(mapStateToProps, mapDispatchToProps)(chatScreen);