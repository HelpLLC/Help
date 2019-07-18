//The screen will contain the entire privacy policy
import React, { Component } from 'react';
import { Text } from 'react-native';
import strings from 'config/strings';
import { ScrollView } from 'react-native-gesture-handler';

class aboutScreen extends Component {
    render() {
        return (
            <ScrollView>
                <Text>{strings.PrivacyPolicy}</Text>
            </ScrollView >
        )
    }
}

export default aboutScreen;