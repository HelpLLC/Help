//This screen will be where the requester will be able to view a profile of a company offering services.
//They'll see its name & description, be able to message it and view all of its specific products.
//In the future we want to add reviews and such features.
//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the 
//requester to request the service.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import ServiceCard from '../../components/ServiceCard';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import { Icon } from 'react-native-elements';
import LoadingSpinner from '../../components/LoadingSpinner';

class companyProfileScreen extends Component {

    //This constructor and componentDidMount will wait until all the products loaded if there are any
    constructor() {
        super();
        this.state = {
            isLoading: true,
            serviceIDsLength: 0,
            providerProducts: []
        }
    }

    //Fetches the data associated with this screen
    async fetchDatabaseData() {

        const { provider } = this.props.navigation.state.params;
        this.setState({ provider });
        if (provider.serviceIDs.length === 0) {
            this.setState({ isLoading: false });
        } else {
            const serviceIDs = provider.serviceIDs;
            await serviceIDs.forEach(async (ID) => {
                const service = await FirebaseFunctions.getServiceByID(ID);
                const newArrayOfProducts = this.state.providerProducts;
                newArrayOfProducts.push(service);
                this.setState({
                    providerProducts: newArrayOfProducts
                });
            });
            this.setState({
                isLoading: false,
                serviceIDsLength: serviceIDs.length,
            });
        }
        return 0;
    }


    //This will fetch the data about this provider and his products from firestore
    async componentDidMount() {

        this.setState({ isLoading: true });
        //Adds the listener to add the listener to refetch the data once this component is returned to
        this.willFocusListener = this.props.navigation.addListener('willFocus', async () => {
            await this.fetchDatabaseData();
            this.setState({ isLoading: false });
        });

    }

    //Removes the listener when the screen is switched away from 
    componentWillUnmount() {

        this.willFocusListener.remove();

    }

    //This method will open a chat with the provider and go to that chat
    messageProvider() {
        const { provider, requester } = this.props.navigation.state.params;
        this.props.navigation.push("MessagingScreen", {
            title: provider.companyName,
            providerID: provider.providerID,
            requesterID: requester.requesterID,
            userID: requester.requesterID
        });
    }

    render() {
        const { isLoading, providerProducts, serviceIDsLength } = this.state;
        if (isLoading === true || (providerProducts.length == 0 && serviceIDsLength > 0)) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <LoadingSpinner isVisible={isLoading} />
                    </View>
                </SafeAreaView>
            )
        } else {
            const { provider, requester } = this.props.navigation.state.params;
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <View style={{ flex: 0.025 }}></View>
                        <View style={{
                            flexDirection: 'row',
                            width: Dimensions.get('window').width - 40,
                            borderColor: colors.lightGray,
                            borderBottomColor: colors.black,
                            borderWidth: 0.5,
                            alignSelf: 'center',
                            flex: 0.15
                        }}>
                            <View style={{ flexDirection: 'column', flex: 2 }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={fontStyles.bigTextStyleBlack}>
                                        {provider.companyName}</Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={fontStyles.subTextStyleBlack}>
                                        {provider.companyDescription}</Text>
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.messageProvider()}>
                                    <Icon
                                        name="comment"
                                        type="font-awesome"
                                        size={40}
                                        color={colors.lightBlue}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 0.025 }}></View>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                            showsVerticalScrollIndicator={false}>
                            <FlatList
                                data={providerProducts}
                                keyExtractor={(item, index) => {
                                    return (provider.companyName + " Product #" + index);
                                }}
                                renderItem={({ item, index }) => (
                                    <ServiceCard
                                        key={index}
                                        serviceTitle={item.serviceTitle}
                                        serviceDescription={item.serviceDescription}
                                        pricing={item.pricing}
                                        image={item.imageSource}
                                        numCurrentRequests={0}
                                        //Passes all of the necessary props to the actual screen that contains
                                        //more information about the service
                                        onPress={() => {
                                            this.props.navigation.push('RequesterServiceScreen', {
                                                product: item,
                                                requester,
                                                provider
                                            });
                                        }}
                                    />
                                )}
                            />
                            <View style={{ flex: 0.025 }}></View>
                        </ScrollView>
                    </View>
                </SafeAreaView >
            );
        }
    }
}

//Exports the screen
export default companyProfileScreen;