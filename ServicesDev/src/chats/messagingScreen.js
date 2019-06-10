//This screen will represent the actual screen where two users communicate with each other. It will be 
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';

class messagingScreen extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            messages: "",
            isNewConversation: "",
        }
    }

    async componentDidMount() {

        const { providerID, requesterID } = this.props.navigation.state.params;
        //Fetches the conversation, if it is a new one, it will set a boolean to true
        FirebaseFunctions.getConversationByID(providerID, requesterID).then((conversation) => {
            this.setState({
                isLoading: false,
                messages: conversation.conversationMessages,
                isNewConversation: (conversation.conversationMessages.length === 0 ? true : false)
            });
        });

    }

    //sends a message to the reciever by adding it to their end and t
    sendMessage(message) {
        //refreshes the state so that the new message is displayed
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, message)
        }));

        this.setState({ isNewConversation: false });

        const { providerID, requesterID } = this.props.navigation.state.params; 

        //Adds the message to the database of messages
        FirebaseFunctions.sendMessage(
            providerID,
            requesterID,
            message,
            this.state.isNewConversation);

    }

    //Renders the screen using the gifted chat module and binding it with the props of the screen
    render(props) {
        const { userID } = this.props.navigation.state.params;
        return (
            <View style={{ backgroundColor: colors.lightGray, flex: 1 }}>
                {
                    this.state.isLoading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LoadingSpinner isVisible={this.state.isLoading} />
                        </View>
                    ) : (
                            <GiftedChat
                                {...props}
                                messages={this.state.messages}
                                placeholder={"Type a message..."}
                                user={{
                                    _id: userID
                                }}
                                renderAvatar={null}
                                onSend={(message) => { this.sendMessage(message) }} />
                        )
                }
            </View>
        )
    }
}

export default messagingScreen;