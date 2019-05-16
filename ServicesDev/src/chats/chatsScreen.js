//This screen will represent all the chats belonging to this current user
import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import Functions from 'config/Functions';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import ChatCard from '../components/ChatCard';
import { connect } from 'react-redux';

class chatsScreen extends Component {
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
                                                previewText={Functions.getMostRecentText(this.props.messages[index])}
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
        const provider = Functions.getProviderByID(providerID, state.providerReducer);

        //Fetches the messages that belong to this user
        const messages = Functions.getProviderMessages(providerID, state.messageReducer);

        return { provider, messages, providerID };

    } else {

        //Fetches the current requester's ID
        const { requesterID } = props.navigation.state.params;

        //Gets the current requester of the app
        const requester = Functions.getRequesterByID(requesterID, state.requesterReducer);

        //Fetches the messages that belong to this user
        const messages = Functions.getRequesterMessages(requesterID, state.messageReducer);

        //Fetches all producers so we can get the name of each one

        return { requester, messages, requesterID };

    }
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(chatsScreen);