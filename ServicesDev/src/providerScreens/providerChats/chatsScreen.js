import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';

class chatsScreen extends Component {
    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Chats} />
                </View>
                <Text>Provider Chats Screen Placeholder</Text>
            </SafeAreaView>
        )
    }
}

export default chatsScreen;