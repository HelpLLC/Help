//This class will represent the "yardwork" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, FlatList, ScrollView, Text } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import ServiceCard from '../../../components/ServiceCard';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ErrorAlert from '../../../components/ErrorAlert';
import strings from 'config/strings';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';

export default class Yardwork extends Component {

    state = {
        isErrorVisible: false,
        isLoading: false
    }

    render() {

        //Fetches this requester and all the products currently in the market
        const { yardwordProducts, requester } = this.props;

        //If there are no current products available in the market, then a message will be displayed saying
        //there are no current products
        if (yardwordProducts.length === 0) {
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
                <View style={{ flex: 0.025 }}></View>
                <ScrollView
                    style={{ flex: 50 }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={yardwordProducts}
                        keyExtractor={(item, index) => {
                            return (item.serviceID + "");
                        }}
                        renderItem={({ item, index }) => (
                            <ServiceCard
                                key={index}
                                serviceTitle={item.serviceTitle}
                                offeredBy={item.offeredByName}
                                pricing={item.pricing}
                                image={item.imageSource}
                                numCurrentRequests={0}
                                offeredByOnPress={async () => {
                                    try {
                                        const provider = await FirebaseFunctions.getProviderByID(item.offeredByID);
                                        this.props.navigation.push('RequesterCompanyProfileScreen', {
                                            provider,
                                            requester
                                        });
                                    } catch (error) {
                                        this.setState({ isErrorVisible: true });
                                        FirebaseFunctions.logIssue(error);
                                    }

                                }}
                                //Passes all of the necessary props to the actual screen that contains
                                //more information about the service
                                onPress={async () => {
                                    try {
                                        const provider = await FirebaseFunctions.getProviderByID(item.offeredByID);
                                        this.props.navigation.push('RequesterServiceScreen', {
                                            productID: item.serviceID,
                                            requester,
                                            provider
                                        });
                                    } catch (error) {
                                        this.setState({ isLoading: false, isErrorVisible: true });
                                        FirebaseFunctions.logIssue(error);
                                    }

                                }}
                            />
                        )}
                    />
                    <View style={{ flex: 0.2 }}></View>
                </ScrollView>
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
