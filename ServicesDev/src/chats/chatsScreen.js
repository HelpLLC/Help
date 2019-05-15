//This screen will represent all the chats belonging to this current user
import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import Functions from 'config/Functions';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';
import { connect } from 'react-redux';

class chatsScreen extends Component {
    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Chats} />
                </View>

                { //Tests whether or not the provider has any conversations
                    this.props.providerMessages.length === 0 ?
                        (
                            <View>

                            </View>
                        ) : (
                            <View>

                            </View>
                        )
                }
            </SafeAreaView>
        )
    }
}


//Connects this screens' props with the current user of the app
const mapStateToProps = (state, props) => {

    //Fetches the current provider's ID
    const { providerID } = props.navigation.state.params;

    //Gets the current provider of the app
    const provider = Functions.getProviderByID(providerID, state.providerReducer);

    //Fetches products that are offered by this specifc provider
    const providerMessages = Functions.getProviderMessages(providerID, state.messageReducer);

    return { provider, providerMessages, providerID };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(chatsScreen);