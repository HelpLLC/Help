import React, { Component } from 'react';
import { View, Text } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';

class chatsScreen extends Component {
    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Chats} />
                </View>
                <Text>Provider Chats Screen Placeholder</Text>
            </View>
        )
    }
}

export default chatsScreen;