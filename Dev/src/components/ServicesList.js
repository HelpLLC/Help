//This component will render a 2 column list of services using the narrowServiceCard. The only prop it will take is the array of
//services. Then it just uses that render the 2 column list.
import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import NarrowServiceCard from './NarrowServiceCard';
import PropTypes from 'prop-types';
import FirebaseFunctions from 'config/FirebaseFunctions';

//Defines the class
class ServicesList extends Component {

    render() {

        //Fetches the array of services from the props along with the requester object that is signed in
        const { services, requester } = this.props;

        const rowsOfServices = [];

        for (let i = 0; i < services.length; i += 2) {
            rowsOfServices.push(
                <View key={i} style={{
                    flexDirection: 'row',
                    height: (Dimensions.get('window').height * 0.35),
                    maxHeight: 255,
                }}>
                    <NarrowServiceCard
                        serviceTitle={services[i].serviceTitle}
                        price={services[i].pricing}
                        imageFunction={async () => {
                            //Passes in the function to retrieve the image of this product
                            return await FirebaseFunctions.getImageByID(services[i].serviceID)
                        }}
                        numCurrentRequests={0}
                        //Passes all of the necessary props to the actual screen that contains
                        //more information about the service
                        onPress={async () => {
                            try {
                                const provider = await FirebaseFunctions.getProviderByID(services[i].offeredByID);
                                this.props.navigation.push('RequesterServiceScreen', {
                                    productID: services[i].serviceID,
                                    requester,
                                    provider
                                });
                            } catch (error) {
                                this.setState({ isLoading: false, isErrorVisible: true });
                                FirebaseFunctions.logIssue(error, {
                                    screen: this.props.serviceType,
                                    userID: 'r-' + requester.requesterID
                                });
                            }

                        }} />
                    <View style={{ width: Dimensions.get('window').width * 0.03 }}></View>
                    <NarrowServiceCard
                        serviceTitle={services[i + 1].serviceTitle}
                        price={services[i + 1].pricing}
                        imageFunction={async () => {
                            //Passes in the function to retrieve the image of this product
                            return await FirebaseFunctions.getImageByID(services[i + 1].serviceID)
                        }}
                        numCurrentRequests={0}
                        //Passes all of the necessary props to the actual screen that contains
                        //more information about the service
                        onPress={async () => {
                            try {
                                const provider = await FirebaseFunctions.getProviderByID(services[i + 1].offeredByID);
                                this.props.navigation.push('RequesterServiceScreen', {
                                    productID: services[i + 1].serviceID,
                                    requester,
                                    provider
                                });
                            } catch (error) {
                                this.setState({ isLoading: false, isErrorVisible: true });
                                FirebaseFunctions.logIssue(error, {
                                    screen: this.props.serviceType,
                                    userID: 'r-' + requester.requesterID
                                });
                            }

                        }}
                    />
                </View>
            )
        }

        return (
            <ScrollView
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                {rowsOfServices}
            </ScrollView>
        )

    }
}

//Sets the PropTypes for this component. There will be and it is required. "services" which will be of type array & requester object
//who will be the one requesting the services
ServicesList.propTypes = {
    services: PropTypes.array.isRequired,
    requester: PropTypes.object.isRequired
}

//Exports the module
export default ServicesList;
