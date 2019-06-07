//The screen will contain the entire privacy policy
import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';
import { ScrollView } from 'react-native-gesture-handler';

class aboutScreen extends Component {
    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.Privacy}
                        leftIconName="angle-left"
                        leftOnPress={() => this.props.navigation.goBack()} />
                </View>

                <ScrollView>
                    <Text style={{ padding: 20 }}>{strings.PrivacyPolicy}</Text>
                </ScrollView>

            </SafeAreaView>
        )
    }
}

export default aboutScreen;