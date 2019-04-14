import React, { Component } from 'react';
import { View, Text } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import { connect } from 'react-redux';
import strings from 'config/strings';

class requestScreen extends Component {
    render() {
        return (
            <View style={screenStyle.container}>
                <View>
                    <TopBanner title={strings.Request} />
                </View>
                <Text>{this.props.requester.username}</Text>
            </View>
        )
    }
}

//Connects this screens' props with the current user of the app
const mapStateToProps = (state, props) => {
    const requester = state.requesterReducer[props.navigation.state.params.userIndex];
    return { requester };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(requestScreen);