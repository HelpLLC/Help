//This class will represent the "other" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import { View, Text, SafeAreaView } from 'react-native';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';


export default class other extends Component {
    render() {
        return (
            <SafeAreaView style={screenStyle.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={fontStyles.mainTextStyleBlack}>{strings.MoreCategoriesComingSoonExclamation}</Text>
                </View>
            </SafeAreaView>
        );
    }
}