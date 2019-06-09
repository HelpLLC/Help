//The screen will contain the entire privacy policy
import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import { ScrollView } from 'react-native-gesture-handler';

class aboutScreen extends Component {
    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <ScrollView>
                    <View>
                        <Text>{strings.PrivacyPolicy}</Text>
                    </View>
                </ScrollView>

            </SafeAreaView>
        )
    }
}

export default aboutScreen;