//This class will represent the "yardwork" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, FlatList, ScrollView, SafeAreaView } from 'react-native';
import ServiceCard from '../../../components/ServiceCard';
import Functions from 'config/Functions';
import screenStyle from 'config/styles/screenStyle';

export default class Yardwork extends Component {

    render() {

        //Fetches this requester and all the products currently in the market
        const { yardwordProducts, requester } = this.props;

        return (
            <SafeAreaView style={screenStyle.container}>
                <ScrollView
                    style={{ paddingTop: 30 }}
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
                                offeredByOnPress={() => {
                                    Functions.getProviderByID(item.offeredByID).then((provider) => {
                                        this.props.navigation.push('RequesterCompanyProfileScreen', {
                                            provider,
                                        });
                                    })  
                                }}
                                //Passes all of the necessary props to the actual screen that contains
                                //more information about the service
                                onPress={() => {
                                    this.props.navigation.push('RequesterServiceScreen', {
                                        providerID: item.offeredByID,
                                        product: item,
                                        requester
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
