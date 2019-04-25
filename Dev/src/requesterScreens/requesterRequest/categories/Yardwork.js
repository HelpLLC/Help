//This class will represent the "yardwork" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import ServiceCard from '../../../components/ServiceCard';
import screenStyle from 'config/styles/screenStyle';

export default class Yardwork extends Component {

    //method returns the name of the company offering a particular product based on the ID of the company
    getCompanyNameByID(id) {

        //fetches all of the providers
        const { providers } = this.props;

        //searches for the provider with this particular ID
        const thisProvider = providers.find((provider) => {
            return provider.providerID === id;
        });

        //Returns the company name of this provider
        return thisProvider.companyName;
    }

    render() {

        //Fetches the current requester index which is passed in as a prop as well as the index
        const { thisRequester, thisRequesterIndex, products } = this.props;

        return (
            <View style={screenStyle.container}>
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
                                offeredBy={this.getCompanyNameByID(item.offeredBy)}
                                pricing={item.pricing}
                                image={item.imageSource}
                                numCurrentRequests={0}
                                offeredByOnPress={() => {
                                    this.props.navigation.push('RequesterCompanyProfileScreen', {
                                        companyID: item.offeredBy
                                    });
                                }}
                                //Passes all of the necessary props to the actual screen that contains
                                //more information about the service
                                onPress={() => {
                                    this.props.navigation.push('RequesterServiceScreen', {
                                        offeredByID: item.offeredBy,
                                        productID: item.serviceID,
                                        thisRequesterIndex: thisRequesterIndex
                                    });
                                }}
                            />
                        )}
                    />
                    <View style={{ height: 40 }}></View>
                </ScrollView>
            </View>
        )
    }
}
