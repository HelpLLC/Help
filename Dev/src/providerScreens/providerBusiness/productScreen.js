//This screen represents the product page which contains information about the product
//as well as any current requests. You will also be able to access history & edit the product from this
//screen
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import colors from 'config/colors';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import HelpView from '../../components/HelpView';
import OptionPicker from '../../components/OptionPicker';
import ImageWithBorder from '../../components/ImageWithBorder';

//The class representing the screen
class productScreen extends Component {

    //Initializes the loading state
    constructor() {
        super();
        this.state = {
            isLoading: true,
            currentRequests: [],
            product: "",
            isErrorVisible: false,
            isCompleteRequestVisible: false,
            currentRequestID: "",
            isDeleteRequestVisible: false
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

    //renders the UI
    render() {

        //fetches the params passed in (the product, productID)
        const { productID, providerID } = this.props.navigation.state.params;
        const { isLoading, product, currentRequests, isCompleteRequestVisible, isErrorVisible, isDeleteRequestVisible } = this.state;

        //If the state is still loading, the spinner will appear
        if (isLoading === true) {
            return (
                <HelpView style={screenStyle.container}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                        <LoadingSpinner isVisible={isLoading} />
                    </View>
                    <ErrorAlert
                        isVisible={this.state.isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                </HelpView>
            )
        } else {
            return (
                <HelpView style={screenStyle.container}>
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
                            flex: 0.75
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
                            <ImageWithBorder
                                width={(Dimensions.get('window').width * 0.25)}
                                height={(Dimensions.get('window').width * 0.25)}
                                imageFunction={async () => {
                                    //Passes in the function to retrieve the image of this product
                                    return await FirebaseFunctions.getImageByID(productID);
                                }} />
                        </View>
                        <View style={{ flex: 0.025 }}></View>
                        <View style={{
                            borderColor: colors.lightGray,
                            borderBottomColor: colors.black,
                            borderWidth: 0.5,
                            width: Dimensions.get('window').width - 40,
                            alignSelf: 'center',
                            flex: 1
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
                                                <Text style={fontStyles.mainTextStyleBlack}>
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
                                                            height: (Dimensions.get('window').height * 0.073),
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
                                                            height: (Dimensions.get('window').height * 0.1024),
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
                                                                    height: (Dimensions.get('window').height * 0.1024),
                                                                    justifyContent: 'center',
                                                                }}
                                                                onPress={() => {
                                                                    this.setState({
                                                                        currentRequestID: item.requesterID,
                                                                        isCompleteRequestVisible: true,
                                                                    });
                                                                }}>
                                                                <Text style={fontStyles.subTextStyleBlue}>
                                                                    {strings.MarkAsComplete}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.setState({
                                                                        currentRequestID: item.requesterID,
                                                                        isDeleteRequestVisible: true,
                                                                    })
                                                                }}>
                                                                <Text style={fontStyles.subTextStyleRed}>
                                                                    {strings.Delete}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ height: (Dimensions.get('window').height * 0.02928) }}></View>
                                                </View>
                                            )}
                                        />
                                    </ScrollView>
                                </View>
                            ) : (
                                    <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Text style={fontStyles.bigTextStyleBlack}>
                                            {strings.NoCurrentRequests}
                                        </Text>
                                    </View>
                                )

                        }
                    </View>
                    <OptionPicker
                        isVisible={isCompleteRequestVisible}
                        title={strings.CompleteRequest}
                        message={strings.AreYouSureCompleteRequest}
                        confirmText={strings.Complete}
                        cancelText={strings.Cancel}
                        confirmOnPress={async () => {
                            this.setState({ isCompleteRequestVisible: false });
                            //This method will complete a specific request based on the passed in requester ID
                            try {
                                this.setState({ isLoading: true });
                                await FirebaseFunctions.completeRequest(productID, this.state.currentRequestID);
                                //Updates the state of the screen to remove the request from
                                //the screen & add it to the history
                                this.fetchDatabaseData();
                            } catch (error) {
                                this.setState({ isLoading: false, isErrorVisible: true });
                                FirebaseFunctions.logIssue(error);
                            }
                        }}
                        cancelOnPress={() => { this.setState({ isCompleteRequestVisible: false }); }} />
                    <OptionPicker
                        isVisible={isDeleteRequestVisible}
                        title={strings.DeleteRequest}
                        message={strings.AreYouSureDeleteRequest}
                        confirmText={strings.Delete}
                        cancelText={strings.Cancel}
                        confirmOnPress={async () => {
                            this.setState({ isDeleteRequestVisible: false });
                            //This method will delete a specific request based on the passed in requester ID
                            try {
                                this.setState({ isLoading: true });
                                await FirebaseFunctions.deleteRequest(productID, this.state.currentRequestID);
                                //Updates the state of the screen to remove the request from
                                //the screen
                                this.fetchDatabaseData();
                            } catch (error) {
                                this.setState({ isLoading: false, isErrorVisible: true });
                                FirebaseFunctions.logIssue(error);
                            }
                        }}
                        cancelOnPress={() => { this.setState({ isDeleteRequestVisible: false }); }} />
                    <ErrorAlert
                        isVisible={isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                </HelpView>
            );
        }
    }
}

//Exports the screen
export default productScreen;