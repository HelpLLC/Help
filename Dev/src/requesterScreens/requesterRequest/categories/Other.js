//This class will represent the "other" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import { View, Text } from 'react-native';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';


export default class other extends Component {
    render() {
        return (
            <View style={screenStyle.container}>
                <View style={{ paddingTop: 180 }}>
                    <Text style={fontStyles.mainTextStyleBlack}>{strings.MoreCategoriesComingSoonExclamation}</Text>
                </View>
            </View>
        );
    }
}