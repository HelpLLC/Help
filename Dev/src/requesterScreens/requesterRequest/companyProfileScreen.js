//This screen will be where the requester will be able to view a profile of a company offering services.
//They'll see its name & description, be able to message it and view all of its specific products.
//In the future we want to add reviews and such features.
//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the 
//requester to request the service.
import React, { Component } from 'react';
import { View } from 'react-native';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';

export default class companyProfileScreen extends Component {

    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.CompanyProfile}
                        leftIconName="angle-left"
                        leftOnPress={() => this.props.navigation.goBack()} />
                </View>
            </View>
        );
    }

}