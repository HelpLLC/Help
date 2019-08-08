//This is the screen that will display if the account has not yet been verified
//This class will represent the "other" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions'


export default class accountNotVerified extends Component {

    componentDidMount() {
        FirebaseFunctions.setCurrentScreen("AccountNotVerifiedScreen", "accountNotVerifiedScreen");
    }

    render() {
        return (
            <HelpView style={screenStyle.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width * 0.8 }}>
                    <Text style={fontStyles.bigTextStyleBlack}>{strings.AccountNotVerified}</Text>
                </View>
            </HelpView>
        );
    }
}