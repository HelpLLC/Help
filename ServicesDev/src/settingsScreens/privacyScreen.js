//The screen will contain the entire privacy policy
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import strings from 'config/strings';
import { ScrollView } from 'react-native-gesture-handler';
import HelpView from '../components/HelpView';
import screenStyle from 'config/screenStyle';

class aboutScreen extends Component {
    render() {
        return (
            <HelpView style={screenStyle.container}>
                <ScrollView>
                    <View>
                        <Text>{strings.PrivacyPolicy}</Text>
                    </View>
                </ScrollView>
            </HelpView>
        )
    }
}

export default aboutScreen;