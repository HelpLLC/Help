//The screen will contain the entire privacy policy
import React, { Component } from 'react';
import { Text } from 'react-native';
import strings from 'config/strings';
import { ScrollView } from 'react-native-gesture-handler';
import FirebaseFunctions from 'config/FirebaseFunctions';

class privacyScreen extends Component {

    componentDidMount() {
        FirebaseFunctions.setCurrentScreen("PrivacyPolicyScreen", "privacyScreen");
    }

    render() {
        return (
            <ScrollView>
                <Text>{strings.PrivacyPolicy}</Text>
            </ScrollView >
        )
    }
}

export default privacyScreen;