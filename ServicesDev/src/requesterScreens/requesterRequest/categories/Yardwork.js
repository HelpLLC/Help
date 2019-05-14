//This class will represent the "yardwork" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, FlatList, ScrollView, SafeAreaView } from 'react-native';
import ServiceCard from '../../../components/ServiceCard';
import Functions from 'config/Functions';
import screenStyle from 'config/styles/screenStyle';

export default class Yardwork extends Component {

    render() {

        //Fetches the current requester index which is passed in as a prop as well as the index
        const { thisRequester, thisRequesterID, products } = this.props;

        return (
            <SafeAreaView style={screenStyle.container}>
                <ScrollView
                    style={{ paddingTop: 30 }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={products}
                        keyExtractor={(item, index) => {
                            return (item.serviceID + "");
                        }}
                        renderItem={({ item, index }) => (
                            <ServiceCard
                                key={index}
                                serviceTitle={item.serviceTitle}
                                offeredBy={Functions.getProviderByID(item.offeredBy, this.props.providers).companyName}
                                pricing={item.pricing}
                                image={item.imageSource}
                                numCurrentRequests={0}
                                offeredByOnPress={() => {
                                    this.props.navigation.push('RequesterCompanyProfileScreen', {
                                        companyID: item.offeredBy,
                                        thisRequesterID: thisRequesterID
                                    });
                                }}
                                //Passes all of the necessary props to the actual screen that contains
                                //more information about the service
                                onPress={() => {
                                    this.props.navigation.push('RequesterServiceScreen', {
                                        offeredByID: item.offeredBy,
                                        productID: item.serviceID,
                                        thisRequesterID: thisRequesterID
                                    });
                                }}
                            />
                        )}
                    />
                    <View style={{ height: 40 }}></View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
