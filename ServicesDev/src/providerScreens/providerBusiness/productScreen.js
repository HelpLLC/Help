//This screen represents the product page which contains information about the product
//as well as any current requests. You will also be able to access history & edit the product from this
//screen
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, FlatList, Alert, SafeAreaView } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import colors from 'config/colors';
import { BoxShadow } from 'react-native-shadow';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

//The class representing the screen
class productScreen extends Component {

    //Initializes the loading state
    constructor() {
        super();
        this.state = {
            isLoading: true,
            currentRequests: [],
            product: "",
            isErrorVisible: false
        }
    }

    //Fetches the data associated with this screen
    async fetchDatabaseData() {

        try {
            const { productID } = this.props.navigation.state.params;
            const service = await FirebaseFunctions.getServiceByID(productID);
            this.setState({
                isLoading: false,
                currentRequests: service.requests.currentRequests,
                product: service
            });
        } catch (error) {
            this.setState({ isLoading: false, isErrorVisible: true });
            FirebaseFunctions.logIssue(error);
        }

        return 0;

    }

    //This will fetch the data about this product from the database
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

    //This method will take in an ID of a requester and go to the chat screen associated with them
    messageRequester(providerID, requesterID, requesterName) {
        this.props.navigation.push("MessagingScreen", {
            title: requesterName,
            providerID: providerID,
            requesterID: requesterID,
            userID: providerID
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
                        try {
                            FirebaseFunctions.completeRequest(productID, requesterID);
                            //Updates the state of the screen to remove the product from
                            //the screen
                            const oldArray = this.state.currentRequests;
                            const indexOfRequest = oldArray.findIndex((request) => {
                                return request.requesterID === requesterID;
                            });
                            oldArray.splice(indexOfRequest, 1);
                            this.setState({ currentRequests: oldArray });
                        } catch (error) {
                            this.setState({ isLoading: false, isErrorVisible: true });
                            FirebaseFunctions.logIssue(error);
                        }

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
                        try {
                            FirebaseFunctions.deleteRequest(productID, requesterID);
                            //Updates the state of the screen to remove the product from
                            //the screen
                            const oldArray = this.state.currentRequests;
                            const indexOfRequest = oldArray.findIndex((request) => {
                                return request.requesterID === requesterID;
                            });
                            oldArray.splice(indexOfRequest, 1);
                            this.setState({ currentRequests: oldArray });
                        } catch (error) {
                            this.setState({ isLoading: false, isErrorVisible: true });
                            FirebaseFunctions.logIssue(error);
                        }
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
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                        <LoadingSpinner isVisible={isLoading} />
                    </View>
                    <ErrorAlert
                        isVisible={this.state.isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                    />
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            width: Dimensions.get('window').width - 40,
                            borderColor: colors.lightGray,
                            borderBottomColor: colors.black,
                            borderWidth: 0.5,
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            flex: (currentRequests.length > 0 ? 0.35 : 0.5)
                        }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text style={fontStyles.bigTextStyleBlack}>
                                        {product.serviceTitle}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.push('ProviderEditProductScreen', {
                                            product,
                                            productID,
                                            providerID
                                        });
                                    }}
                                    style={{ flex: 0.5, justifyContent: 'flex-end' }}>
                                    <Text style={fontStyles.subTextStyleGray}>
                                        {strings.EditService}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.push('ProviderProductHistoryScreen', {
                                            product
                                        });
                                    }}
                                    style={{ flex: 0.5, justifyContent: 'flex-start' }}>
                                    <Text style={fontStyles.subTextStyleGray}>
                                        {strings.History}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{}}>
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
                        <View style={{ flex: 0.025 }}></View>
                        <View style={{
                            borderColor: colors.lightGray,
                            borderBottomColor: colors.black,
                            borderWidth: 0.5,
                            width: Dimensions.get('window').width - 40,
                            alignSelf: 'center',
                            height: 120
                        }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                <Text style={fontStyles.subTextStyleBlack}>
                                    {product.serviceDescription}</Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={fontStyles.bigTextStyleBlack}>
                                    {product.pricing}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 0.025 }}></View>

                        {   //Checks if the current product has any current requests and displays them if
                            //it does
                            currentRequests.length > 0 ? (
                                <View style={{ flex: 1 }}>
                                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <View>
                                            <View style={{ flex: 0 }}>
                                                <Text style={fontStyles.mainTextStyleRed}>
                                                    {currentRequests.length}
                                                    {
                                                        currentRequests.length > 1 ?
                                                            (' Requests') : (' Request')
                                                    }</Text>
                                            </View>
                                            <View style={{ flex: 0.03 }}></View>
                                        </View>
                                        <FlatList
                                            data={currentRequests}
                                            keyExtractor={(item, index) => (index + "")}
                                            renderItem={({ item, index }) => (
                                                <View>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            width: Dimensions.get('window').width,
                                                            height: 50,
                                                            alignItems: 'center',
                                                            backgroundColor: colors.white,
                                                        }}>

                                                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
                                                                <View style={{ flex: 0.1 }}></View>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={fontStyles.mainTextStyleBlack}>
                                                                        {item.requesterName}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-evenly',
                                                            alignItems: 'center',
                                                            width: Dimensions.get('window').width,
                                                            height: 70,
                                                            backgroundColor: colors.white,
                                                            borderBottomStartRadius: 35,
                                                            borderBottomEndRadius: 35,
                                                            flex: 1
                                                        }}>
                                                            <TouchableOpacity
                                                                onPress={() => this.messageRequester(providerID, item.requesterID, item.requesterName)}>
                                                                <Text style={fontStyles.subTextStyleBlue}>
                                                                    {strings.Message}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                style={{
                                                                    height: 70,
                                                                    justifyContent: 'center',
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
                                                    <View style={{ height: 20 }}></View>
                                                </View>
                                            )}
                                        />
                                    </ScrollView>
                                </View>
                            ) : (
                                    <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={fontStyles.bigTextStyleBlack}>
                                            {strings.NoCurrentRequests}
                                        </Text>
                                    </View>
                                )

                        }
                    </View>
                    <ErrorAlert
                        isVisible={this.state.isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                    />
                </SafeAreaView>
            );
        }
    }
}

//Exports the screen
export default productScreen;