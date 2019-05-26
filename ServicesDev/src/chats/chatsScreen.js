//This screen will represent all the chats belonging to this current user
import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import ChatCard from '../components/ChatCard';
import { connect } from 'react-redux';

class chatsScreen extends Component {

    //This method will take in a messages object and will return the most recent message sent message in
    //that conversation. NOTE: This doesn't return the message object, but the actual string text that
    //was sent by the user
    getMostRecentText(messagesObject) {

        //Will fetch the conversation history
        let conversationMessages = messagesObject.conversationMessages;

        //Will sort the array of messages by date
        conversationMessages = conversationMessages.sort((a, b) => {
            d1 = new Date(a.createdAt);
            d2 = new Date(b.createdAt);
            return d2.getTime() - d1.getTime();
        });

        //Will return the most recent text in the chat (the literal string)
        return conversationMessages[0].text;

    }

    //This method will take in a requester ID and then return all of the associated chats that include
    //that requester. If the requester doesn't have any current existing chats with any providers, then
    //the returned array of message objects will be empty
    getRequesterMessages(requesterID, allMessages) {

        //Instantiates the array that will be returned
        const requesterMessages = [];

        //Searches through all of the messages until it finds a message object that includes this
        //providerID and then pushes it to the array of providerMessages
        allMessages.forEach((messageObject) => {

            if (messageObject.requesterID === requesterID) {
                requesterMessages.push(messageObject);
            }

        });

        //Returns the final array
        return requesterMessages;

    }

    //This method will take in a provider ID and then return all of the associated chats that include
    //that provider. If the provider doesn't have any current existing chats with any requesters, then
    //the returned array of message objects will be empty
    getProviderMessages(providerID, allMessages) {

        //Instantiates the array that will be returned
        const providerMessages = [];

        //Searches through all of the messages until it finds a message object that includes this
        //providerID and then pushes it to the array of providerMessages
        allMessages.forEach((messageObject) => {

            if (messageObject.providerID === providerID) {
                providerMessages.push(messageObject);
            }

        });

        //Returns the final array
        return providerMessages;

    }

    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Chats} />
                </View>

                { //Tests whether or not the provider has any conversations
                    this.props.messages.length === 0 ?
                        (
                            <View style={{ paddingTop: 180 }}>
                                <Text style={fontStyles.mainTextStyleBlack}>{strings.NoMessagesYet}</Text>
                            </View>
                        ) : (
                            <View>
                                <FlatList
                                    data={this.props.messages}
                                    keyExtractor={(item, index) => {
                                        return ("Provider #" + item.providerID + " + Requester #" + item.requesterID);
                                    }}
                                    renderItem={({ item, index }) => (
                                        <View style={{ marginTop: 45 }}>
                                            <ChatCard
                                                username={
                                                    //Will test if this is the provider or the requester in
                                                    //order to know which username to display
                                                    this.props.providerID ? (
                                                        item.requesterName
                                                    ) : (
                                                            item.companyName
                                                        )
                                                }
                                                previewText={this.getMostRecentText(this.props.messages[index])}
                                                onPress={() => {
                                                    this.props.navigation.push("MessagingScreen", {
                                                        title:
                                                            this.props.provider ? (
                                                                item.requesterName
                                                            ) : (
                                                                    item.companyName
                                                                ),
                                                        providerID: item.providerID,
                                                        requesterID: item.requesterID,
                                                        userID: this.props.provider ? (
                                                            item.providerID + "p"
                                                        ) : (
                                                                item.requesterID + "r"
                                                            ),
                                                    });

                                                }}
                                            />
                                        </View>
                                    )}
                                />
                            </View>
                        )
                }
            </SafeAreaView>
        )
    }
}


//Connects this screens' props with the current user of the app
const mapStateToProps = (state, props) => {

    //Tests whether the current user is a provider or a requester, in order to fetch the correct data
    if (props.navigation.state.params.providerID) {

        //Fetches the current provider's ID
        const { providerID } = props.navigation.state.params;

        //Gets the current provider of the app
        const provider = FirebaseFunctions.getProviderByID(providerID, state.providerReducer);

        //Fetches the messages that belong to this user
        const messages = this.getProviderMessages(providerID, state.messageReducer);

        return { provider, messages, providerID };

    } else {

        //Fetches the current requester's ID
        const { requesterID } = props.navigation.state.params;

        //Gets the current requester of the app
        const requester = FirebaseFunctions.getRequesterByID(requesterID, state.requesterReducer);

        //Fetches the messages that belong to this user
        const messages = FirebaseFunctions.getRequesterMessages(requesterID, state.messageReducer);

        //Fetches all producers so we can get the name of each one

        return { requester, messages, requesterID };

    }
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(chatsScreen);