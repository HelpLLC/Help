//This screen will represent the main business screen for any given provider. It will contain the
//business's profile and will be the landing screen for the user when they login. If this is the
//first time that the user logs in or if they do not yet have products, then the screen will 
//display prompting the user to sign in.
import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import images from 'config/images/images';
import RoundBlueButton from '../../components/RoundBlueButton';
import TopBanner from '../../components/TopBanner';
import ServiceCard from '../../components/ServiceCard';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import fontStyles from 'config/styles/fontStyles';
import { BoxShadow } from 'react-native-shadow';
import LoadingSpinner from '../../components/LoadingSpinner';

class businessScreen extends Component {

    //This constructor and componentDidMount will wait until all the products loaded if there are any
    constructor() {
        super();
        this.state = {
            isLoading: true,
            serviceIDsLength: 0,
            provider: "",
            providerProducts: []
        }
    }

    //This will fetch the data about this provider and his products from firestore
    async componentDidMount() {
        const { providerID } = this.props.navigation.state.params;
        FirebaseFunctions.getProviderByID(providerID).then(async (provider) => {
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
        });
    }

    render() {

        //Gets the provider & the products from the state
        const { isLoading, providerProducts, serviceIDsLength, provider } = this.state;
        //Stores the top part of this view
        const topView = (
            <View style={{ alignItems: 'center' }}>
                <View>
                    <TopBanner title={strings.Business} />
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: Dimensions.get('window').width - 40,
                    borderColor: colors.lightGray,
                    borderBottomColor: colors.black,
                    borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20
                }}>

                    <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                        <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                            {provider.companyName}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('ProviderEditCompanyProfileScreen', {
                                    providerID: provider.providerID,
                                    provider
                                });
                            }}>
                            <Text style={fontStyles.subTextStyleGray}>
                                {strings.EditCompanyProfile}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: 10 }}>
                        <RoundBlueButton
                            title={strings.PlusSign}
                            textStyle={fontStyles.bigTextStyleWhite}
                            style={roundBlueButtonStyle.BusinessScreenPlusButton}
                            onPress={() => {
                                this.props.navigation.push('ProviderCreateProductScreen', {
                                    providerID: provider.providerID,
                                    provider,
                                    providerProducts
                                })
                            }} />
                    </View>
                </View>
            </View>
        );

        //If the screen is loading, then the loading icon will appear. If the provider does not yet have
        //any products, then the "Create first product" thing will appear. If none of that is true, then
        //the provider's normal products will be displayed. 
        if (isLoading === true || (providerProducts.length == 0 && serviceIDsLength > 0) || provider === "") {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ alignItems: 'center' }}>
                        <LoadingSpinner isVisible={isLoading} />
                    </View>
                </SafeAreaView>
            )
        } else if (serviceIDsLength === 0) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    {topView}
                    <View style={
                        {
                            flexDirection: 'column',
                            paddingTop: 30,
                            alignItems: 'center'
                        }}>
                        <Text style={fontStyles.bigTextStyleBlack}>
                            {strings.CreateYourFirstProductNowExclamation}</Text>

                        <View style={{ marginBottom: 20, marginTop: 20 }}>
                            <BoxShadow setting={{
                                width: 280,
                                height: 160,
                                color: colors.gray,
                                border: 10,
                                radius: 50,
                                opacity: 0.2,
                                x: 0,
                                y: 5
                            }}>
                                <Image
                                    source={images.LawnMowing}
                                    style={{
                                        width: 280,
                                        height: 160,
                                        borderColor: colors.lightBlue,
                                        borderWidth: 6,
                                        borderRadius: 50,
                                    }} />
                            </BoxShadow>
                        </View>
                        <RoundBlueButton
                            title={strings.Create}
                            style={roundBlueButtonStyle.MediumSizeButton}
                            textStyle={fontStyles.bigTextStyleWhite}
                            onPress={() => {
                                this.props.navigation.push('ProviderCreateProductScreen', {
                                    providerID: provider.providerID,
                                    provider,
                                    providerProducts
                                });
                            }} />
                    </View>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={screenStyle.container}>
                    {topView}
                    <ScrollView
                        style={{ paddingTop: 30 }}
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
                                    numCurrentRequests={item.requests.currentRequests.length}
                                    onPress={() => {
                                        this.props.navigation.push('ProviderProductScreen', {
                                            productID: item.serviceID,
                                            providerID: provider.providerID
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
export default businessScreen;