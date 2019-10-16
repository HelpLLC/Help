//This class will represent a tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import ServicesList from '../components/ServicesList';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ErrorAlert from '../components/ErrorAlert';
import strings from 'config/strings';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';

export default class requestTab extends Component {

    componentDidMount() {
        FirebaseFunctions.setCurrentScreen(this.props.serviceType, "requestTab");
    }

    state = {
        isErrorVisible: false,
        isLoading: false
    }

    render() {

        //Fetches this requester and all the products currently in the market
        const { products, requester } = this.props;

        //If there are no current products available in the market, then a message will be displayed saying
        //there are no current products
        if (products.length === 0) {
            return (
                <HelpView style={screenStyle.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={[fontStyles.mainTextStyleBlack, { textAlign: 'center' }]}>{strings.NoCurrentServices}</Text>
                    </View>
                </HelpView>
            )
        }

        return (
            <HelpView style={screenStyle.container}>
                <ServicesList services={products} requester={requester} />
                <ErrorAlert
                    isVisible={this.state.isErrorVisible}
                    onPress={() => { this.setState({ isErrorVisible: false }) }}
                    title={strings.Whoops}
                    message={strings.SomethingWentWrong}
                />
            </HelpView>
        )
    }
}
