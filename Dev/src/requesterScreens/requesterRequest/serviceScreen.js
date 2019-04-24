//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the 
//requester to request the service.
import React, { Component } from 'react';
import { View } from 'react-native';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';

export default class serviceScreen extends Component {

    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.Service}
                        leftIconName="angle-left"
                        leftOnPress={() => this.props.navigation.goBack()} />
                </View>
            </View>
        );
    }

}