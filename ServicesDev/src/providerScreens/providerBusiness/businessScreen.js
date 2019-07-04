//This screen will represent the main business screen for any given provider. It will contain the
//business's profile and will be the landing screen for the user when they login. If this is the
//first time that the user logs in or if they do not yet have products, then the screen will 
//display prompting the user to sign in.
import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
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
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import ImageWithBorder from '../../components/ImageWithBorder';

class businessScreen extends Component {

    //This constructor and componentDidMount will wait until all the products loaded if there are any
    constructor() {
        super();
        this.state = {
            isLoading: true,
            serviceIDsLength: 0,
            provider: "",
            providerProducts: [],
            isErrorVisible: false
        }
    }

    //Fetches the data associated with this screen
    async fetchDatabaseData() {

        try {
            const { providerID } = this.props.navigation.state.params;
            const provider = await FirebaseFunctions.getProviderByID(providerID);
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
                    serviceIDsLength: provider.serviceIDs.length,
                });
            }
        } catch (error) {
            this.setState({ isLoading: false, isErrorVisible: true });
            FirebaseFunctions.logIssue(error);
        }
        return 0;
    }

    //This will fetch the data about this provider and his products from firestore
    async componentDidMount() {

        //Adds the listener to add the listener to refetch the data once this component is returned to
        this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
            await this.fetchDatabaseData();
            this.setState({ isLoading: false });
        });

    }

    //Removes the listener when the screen is switched away from 
    componentWillUnmount() {

        this.willFocusListener.remove();

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
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{
                        flexDirection: 'row',
                        width: Dimensions.get('window').width - 40,
                        borderColor: colors.lightGray,
                        borderBottomColor: colors.black,
                        borderWidth: 0.5,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1
                    }}>

                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text style={fontStyles.bigTextStyleBlack}>
                                    {provider.companyName}</Text>
                            </View>

                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'flex-start' }}
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

                        <View style={{}}>
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
            </View>
        );

        //If the screen is loading, then the loading icon will appear. If the provider does not yet have
        //any products, then the "Create first product" thing will appear. If none of that is true, then
        //the provider's normal products will be displayed. 
        if (isLoading === true || (providerProducts.length == 0 && serviceIDsLength > 0) || provider === "") {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <LoadingSpinner isVisible={true} />
                    </View>
                    <ErrorAlert
                        isVisible={this.state.isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                </SafeAreaView>
            );
        } else if (serviceIDsLength === 0) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ flex: 1.1 }}>
                        {topView}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={fontStyles.bigTextStyleBlack}>
                            {strings.CreateYourFirstProductNowExclamation}</Text>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ImageWithBorder
                            width={Dimensions.get('window').width * 0.65}
                            height={Dimensions.get('window').height * 0.22}
                            imageSource={images.LawnMowing} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
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
                    <ErrorAlert
                        isVisible={this.state.isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ flex: 0.4 }}>
                        {topView}
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
                        <View style={{ flex: 0.025 }}></View>
                        <ErrorAlert
                            isVisible={this.state.isErrorVisible}
                            onPress={() => { this.setState({ isErrorVisible: false }) }}
                            title={strings.Whoops}
                            message={strings.SomethingWentWrong}
                        />
                    </ScrollView>
                </SafeAreaView>
            );
        }
    }
}

//Exports the screen
export default businessScreen;