//This class will represent the "other" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';


export default class other extends Component {
    render() {
        return (
            <HelpView style={screenStyle.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={fontStyles.mainTextStyleBlack}>{strings.MoreCategoriesComingSoonExclamation}</Text>
                </View>
            </HelpView>
        );
    }
}