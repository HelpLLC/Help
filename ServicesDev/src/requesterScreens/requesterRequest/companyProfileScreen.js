//This screen will be where the requester will be able to view a profile of a company offering services.
//They'll see its name & description, be able to message it and view all of its specific products.
//In the future we want to add reviews and such features.
//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the 
//requester to request the service.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import TopBanner from '../../components/TopBanner';
import ServiceCard from '../../components/ServiceCard';
import strings from 'config/strings';
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

    //This will fetch the data about this provider and his products from firestore
    async componentDidMount() {
        const { provider } = this.props.navigation.state.params;
        this.setState({ provider });
        if (provider.serviceIDs.length === 0) {
            this.setState({ isLoading: false });
        } else {
            const serviceIDs = provider.serviceIDs;
            await serviceIDs.forEach((ID) => {
                FirebaseFunctions.getServiceByID(ID).then((service) => {
                    const newArrayOfProducts = this.state.providerProducts;
                    newArrayOfProducts.push(service);
                    this.setState({
                        providerProducts: newArrayOfProducts
                    });
                })
            });
            this.setState({
                isLoading: false,
                serviceIDsLength: serviceIDs.length,
            });
        }
    }

    //This method will open a chat with the provider and go to that chat
    messageProvider() {
        const { provider, requester } = this.props.navigation.state.params;
        this.props.navigation.push("MessagingScreen", {
            title: provider.companyName,
            providerID: provider.providerID,
            requesterID: requester.requesterID,
            userID: requester.requesterID + "r"
        });
    }

    render() {
        if (isLoading === true || (providerProducts.length == 0 && serviceIDsLength > 0)) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ alignItems: 'center' }}>
                        <LoadingSpinner isVisible={isLoading} />
                    </View>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner
                            title={strings.CompanyProfile}
                            leftIconName="angle-left"
                            leftOnPress={() => this.props.navigation.goBack()} />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        width: Dimensions.get('window').width - 40,
                        borderColor: colors.lightGray,
                        borderBottomColor: colors.black,
                        borderWidth: 0.5,
                        marginTop: 20,
                        paddingBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ flexDirection: 'column', paddingBottom: 10, maxWidth: 260 }}>
                            <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                                {this.props.provider.companyName}</Text>

                            <Text style={[fontStyles.subTextStyleBlack, { paddingTop: 10 }]}>
                                {this.props.provider.companyDescription}</Text>
                        </View>

                        <View style={{ paddingBottom: 10 }}>
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

                    <ScrollView
                        style={{ paddingTop: 20 }}
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        showsVerticalScrollIndicator={false}>
                        <FlatList
                            data={this.props.providerProducts}
                            keyExtractor={(item, index) => {
                                return (this.props.provider.companyName + " Product #" + index);
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
                                            offeredByID: item.offeredBy,
                                            productID: item.serviceID,
                                            thisRequesterID: this.props.thisRequesterID
                                        });
                                    }}
                                />
                            )}
                        />
                        <View style={{ height: 40 }}></View>
                    </ScrollView>
                </SafeAreaView>
            );
        }
    }
}

//Exports the screen
export default companyProfileScreen;