//This screen represents the product page which contains information about the product
//as well as any current requests. You will also be able to access history & edit the product from this
//screen
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, FlatList, Alert, SafeAreaView } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../../components/TopBanner';
import colors from 'config/colors';
import { BoxShadow } from 'react-native-shadow';
import LoadingSpinner from '../../components/LoadingSpinner';

//The class representing the screen
class productScreen extends Component {

    //Initializes the loading state
    constructor() {
        super();
        this.state = {
            isLoading: true,
            currentRequests: [],
            product: ""
        }
    }

    //fetches the data about this particular product
    async componentDidMount() {
        const { productID } = this.props.navigation.state.params;
        FirebaseFunctions.getServiceByID(productID).then((service) => {
            this.setState({
                isLoading: false,
                currentRequests: service.requests.currentRequests,
                product: service
            });
        });
    }

    //This method will take in an ID of a requester and go to the chat screen associated with them
    messageRequester(providerID, requesterID) {
        this.props.navigation.push("MessagingScreen", {
            title: FirebaseFunctions.getRequesterByID(requesterID).username,
            providerID: providerID,
            requesterID: requesterID,
            userID: providerID + "p"
        });
    }

    //This method will complete a specific request based on the passed in requester ID
    markAsComplete(productID, requesterID) {
        //Will make sure the user wants to mark this request as complete
        Alert.alert(
            'Complete Request',
            'Are you sure you want to complete this request?',
            [
                {
                    text: 'Complete', onPress: () => {
                        FirebaseFunctions.completeRequest(productID, requesterID);
                        //Updates the state of the screen to remove the product from
                        //the screen
                        const oldArray = this.state.currentRequests;
                        const indexOfRequest = oldArray.findIndex((request) => {
                            return request.requesterID === requesterID;
                        });
                        oldArray.splice(indexOfRequest, 1);
                        this.setState({ currentRequests: oldArray });
                    }
                },

                { text: 'Cancel', style: 'cancel' },
            ]
        );
    }

    //This method will delete the request WITHOUT completing it based on the passed in ID
    deleteRequest(productID, requesterID) {

        //Will make sure the user wants to delete this request
        Alert.alert(
            'Delete Request',
            'Are you sure you want to delete this request?',
            [
                {
                    text: 'Delete', onPress: () => {
                        FirebaseFunctions.deleteRequest(productID, requesterID);
                        //Updates the state of the screen to remove the product from
                        //the screen
                        const oldArray = this.state.currentRequests;
                        const indexOfRequest = oldArray.findIndex((request) => {
                            return request.requesterID === requesterID;
                        });
                        oldArray.splice(indexOfRequest, 1);
                        this.setState({ currentRequests: oldArray });
                    }
                },

                { text: 'Cancel', style: 'cancel' },
            ]
        );
    }

    //renders the UI
    render() {

        //fetches the params passed in (the product, productID)
        const { productID, providerID } = this.props.navigation.state.params;
        const { isLoading, product, currentRequests } = this.state;

        //If the state is still loading, the spinner will appear
        if (isLoading === true) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner
                            title={strings.Service}
                            leftIconName="angle-left"
                            leftOnPress={() => this.props.navigation.goBack()} />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                        <LoadingSpinner isVisible={isLoading} />
                    </View>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner
                            title={strings.Service}
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
                        paddingBottom: 15,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                            <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                                {product.serviceTitle}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('ProviderEditProductScreen', {
                                        product,
                                        productID
                                    });
                                }}>
                                <Text style={[fontStyles.subTextStyleGray, { paddingBottom: 10 }]}>
                                    {strings.EditService}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('ProviderProductHistoryScreen', {
                                        product
                                    });
                                }}>
                                <Text style={fontStyles.subTextStyleGray}>
                                    {strings.History}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ paddingBottom: 10 }}>
                            <BoxShadow setting={{
                                width: 140,
                                height: 110,
                                color: colors.gray,
                                border: 10,
                                radius: 50,
                                opacity: 0.2,
                                x: 0,
                                y: 5
                            }}>
                                <Image
                                    source={product.imageSource}
                                    style={{
                                        width: 140,
                                        height: 110,
                                        borderColor: colors.lightBlue,
                                        borderWidth: 6,
                                        borderRadius: 50
                                    }} />
                            </BoxShadow>
                        </View>
                    </View>
                    <View style={{
                        paddingTop: 20,
                        paddingRight: 14,
                        paddingLeft: 14,
                        borderColor: colors.lightGray,
                        borderBottomColor: colors.black,
                        borderWidth: 0.5,
                        width: Dimensions.get('window').width - 40,
                    }}>
                        <Text style={fontStyles.subTextStyleBlack}>
                            {product.serviceDescription}</Text>

                        <Text style={[fontStyles.bigTextStyleBlack, {
                            alignSelf: 'center',
                            paddingTop: 20,
                            paddingBottom: 20
                        }]}>
                            {product.pricing}
                        </Text>
                    </View>

                    {   //Checks if the current product has any current requests and displays them if
                        //it does
                        currentRequests.length > 0 ? (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                                alignSelf: 'center',
                                paddingTop: 20,
                                paddingBottom: 20,
                                alignItems: 'center'
                            }}>
                                <View style={{ paddingBottom: 20 }}>
                                    <Text style={fontStyles.mainTextStyleRed}>
                                        {currentRequests.length}
                                        {
                                            currentRequests.length > 1 ?
                                                (' Requests') : (' Request')
                                        }</Text>
                                </View>
                                <FlatList
                                    data={currentRequests}
                                    keyExtractor={(item, index) => (index + "")}
                                    renderItem={({ item, index }) => (
                                        <View style={{ paddingBottom: 20, alignItems: 'center' }}>
                                            <View style={{
                                                flexDirection: 'column',
                                                justifyContent: 'space-evenly',
                                                width: Dimensions.get('window').width,
                                                height: 80,
                                                backgroundColor: colors.white,
                                                paddingLeft: 20
                                            }}>
                                                <Text style={fontStyles.mainTextStyleBlack}>
                                                    {item.requesterName}</Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-evenly',
                                                alignItems: 'center',
                                                width: Dimensions.get('window').width,
                                                height: 70,
                                                backgroundColor: colors.white,
                                                borderBottomStartRadius: 35,
                                                borderBottomEndRadius: 35
                                            }}>
                                                <TouchableOpacity
                                                    onPress={() => this.messageRequester(providerID, item.requesterID)}>
                                                    <Text style={fontStyles.subTextStyleBlue}>
                                                        {strings.Message}</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{
                                                        height: 70,
                                                        justifyContent: 'center',
                                                        padding: 15
                                                    }}
                                                    onPress={() => this.markAsComplete(productID, item.requesterID)}>
                                                    <Text style={fontStyles.subTextStyleBlue}>
                                                        {strings.MarkAsComplete}</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => this.deleteRequest(productID, item.requesterID)}>
                                                    <Text style={fontStyles.subTextStyleRed}>
                                                        {strings.Delete}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />
                            </ScrollView>
                        ) : (
                                <View style={{
                                    alignSelf: 'center',
                                    paddingTop: 20,
                                    paddingBottom: 20
                                }}>
                                    <Text style={fontStyles.bigTextStyleBlack}>
                                        {strings.NoCurrentRequests}
                                    </Text>
                                </View>
                            )

                    }

                </SafeAreaView>
            );
        }
    }
}

//Exports the screen
export default productScreen;