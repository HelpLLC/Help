//This screen will represent all the chats belonging to this current user
import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList, ScrollView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import ChatCard from '../components/ChatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';

class chatsScreen extends Component {

    //The constructor that initializes the loading screen to make sure all of the chats have been loaded
    constructor() {
        super();
        this.state = {
            isLoading: true,
            userID: "",
            userConversations: "",
            isRequester: ""
        }
    }

    //The method that is called to load all of the data
    async componentDidMount() {
        //First determines whether this is a requester or a provider and then sets the userID
        if (this.props.navigation.state.params.providerID) {
            //Fetches all the conversations that this user has done and stores them in an array
            const convos = await FirebaseFunctions.getAllUserConversations(this.props.navigation.state.params.providerID, false);
            this.setState({
                userID: this.props.navigation.state.params.providerID,
                isRequester: false,
                userConversations: convos,
                isLoading: false
            });
        } else {
            //Fetches all the conversations that this user has done and stores them in an array
            const convos = FirebaseFunctions.getAllUserConversations(this.props.navigation.state.params.requester.requesterID, true);
            this.setState({
                userID: this.props.navigation.state.params.requester.requesterID,
                isRequester: true,
                userConversations: convos,
                isLoading: false
            });
        }
    }

    render() {
        if (this.state.isLoading === true) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner title={strings.Chats} />
                    </View>
                    <View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingSpinner isVisible={this.state.isLoading} />
                        </View>
                    </View>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner title={strings.Chats} />
                    </View>
                    <View>
                        { //Tests whether or not the provider has any conversations
                            this.state.userConversations.length === 0 ?
                                (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={fontStyles.mainTextStyleBlack}>{strings.NoMessagesYet}</Text>
                                    </View>
                                ) : (
                                    <View>
                                        <ScrollView style={{ flex: 1 }}>
                                            <FlatList
                                                data={this.state.userConversations}
                                                keyExtractor={(item, index) => {
                                                    return ("Provider #" + item.providerID + " + Requester #" + item.requesterID);
                                                }}
                                                renderItem={({ item, index }) => (
                                                    <ChatCard
                                                        username={
                                                            //Will test if this is the provider or the requester in
                                                            //order to know which username to display
                                                            this.state.isRequester ? (
                                                                item.providerName
                                                            ) : (
                                                                    item.requesterName
                                                                )
                                                        }
                                                        previewText={item.conversationMessages[item.conversationMessages.length - 1].text}
                                                        onPress={() => {
                                                            this.props.navigation.push("MessagingScreen", {
                                                                title:
                                                                    this.state.isRequester ? (
                                                                        item.providerName
                                                                    ) : (
                                                                            item.requesterName
                                                                        ),
                                                                providerID: item.providerID,
                                                                requesterID: item.requesterID,
                                                                userID: this.state.isRequester ? (
                                                                    item.requesterID
                                                                ) : (
                                                                        item.providerID
                                                                    ),
                                                            });
                                                        }}
                                                    />
                                                )} />
                                        </ScrollView>
                                    </View>
                                )
                        }
                    </View>
                </SafeAreaView>
            )
        }
    }
}

//exports the screen
export default chatsScreen;