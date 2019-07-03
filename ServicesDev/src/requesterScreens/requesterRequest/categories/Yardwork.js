//This class will represent the "yardwork" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, FlatList, ScrollView, SafeAreaView } from 'react-native';
import ServiceCard from '../../../components/ServiceCard';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import ErrorAlert from '../../../components/ErrorAlert';
import strings from 'config/strings';

export default class Yardwork extends Component {

    state = {
        isErrorVisible: false
    }

    render() {

        //Fetches this requester and all the products currently in the market
        const { yardwordProducts, requester } = this.props;

        return (
            <SafeAreaView style={screenStyle.container}>
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
            </SafeAreaView>
        )
    }
}
