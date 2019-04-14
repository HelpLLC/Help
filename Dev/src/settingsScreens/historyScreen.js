//This will be the history screen which will display all of the past requests that have been done
//Screen is both available from the provider and requester side
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';

class historyScreen extends Component {
    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner
                        title={strings.History}
                        leftIconName="angle-left"
                        leftOnPress={() => this.props.navigation.goBack()} />
                </View>
                <Text>History Screen Placeholder</Text>
            </View>
        )
    }
}

export default historyScreen;