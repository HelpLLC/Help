//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the 
//requester to request the service.
import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Image, Alert, SafeAreaView } from 'react-native';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import { BoxShadow } from 'react-native-shadow';
import LoadingSpinner from '../../components/LoadingSpinner';
import FirebaseFunctions from '../../../config/FirebaseFunctions';

class serviceScreen extends Component {

    //This constructor and componentDidMount will wait until all the products loaded if there are any
    constructor() {
        super();
        this.state = {
            isLoading: true,
            isRequested: ""
        }
    }

    //This will fetch the data about this provider and his products from firestore
    async componentDidMount() {
        const { product, requester } = this.props.navigation.state.params;
        const isRequested = product.requests.currentRequests.findIndex((request) => {
            return request.requesterID === requester.requesterID
        });

        if (isRequested === -1) {
            this.setState({
                isLoading: false,
                isRequested: false
            });
        } else {
            this.setState({
                isLoading: false,
                isRequested: true
            });
        }
    }

    //This method will request this service from the company providing it by pushing the request to the
    //provider.
    //After confirming to the requester that the request has been processed, the program will
    //automatically send a message to the provider with a default message saying that this requester wants
    //to buy this service. Then will push the requester to the chats screen.
    requestService() {

        //Will make sure that the user wants to request the service
        Alert.alert(
            'Request Service',
            'Are you sure you want to request this service?',
            [
                {
                    text: 'Request', onPress: () => {
                        const { product, requester } = this.props.navigation.state.params;
                        FirebaseFunctions.requestService(product.serviceID, requester);
                        this.setState({ isRequested: true });
                    }
                },

                { text: 'Cancel', style: 'cancel' },
            ]
        );
    }

    //This method will cancel the request by making sure the user wants to cancel it
    cancelRequest() {
        //Will make sure that the user wants to request the service
        Alert.alert(
            'Cancel Request',
            'Are you sure you want to cancel your request for this service?',
            [
                {
                    text: 'Yes', onPress: () => {
                        const { product, requester } = this.props.navigation.state.params;
                        FirebaseFunctions.deleteRequest(product.serviceID, requester.requesterID);
                        this.setState({ isRequested: false });
                    }
                },

                { text: 'No', style: 'cancel' },
            ]
        );
    }


    //Renders the UI
    render() {
        const { isLoading, isRequested } = this.state;
        const { product, requester, provider } = this.props.navigation.state.params;
        if (isLoading === true || isRequested === "") {
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
                        paddingBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                            <Text style={[fontStyles.bigTextStyleBlack, { paddingBottom: 10 }]}>
                                {product.serviceTitle}</Text>

                            <Text style={[fontStyles.subTextStyleGray, { paddingTop: 10 }]}>
                                {strings.OfferedBy}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('RequesterCompanyProfileScreen', {
                                        provider,
                                        requester
                                    });
                                }}>
                                <Text style={fontStyles.subTextStyleBlue}>
                                    {provider.companyName}</Text>
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

                    { //Tests if this service has already been requested by the current user
                        this.state.isRequested === false ? (
                            <View style={{ marginTop: 60 }}>
                                <RoundBlueButton
                                    title={strings.Request}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={() => { this.requestService() }} />
                            </View>
                        ) : (
                                <View style={{ marginTop: 60, alignItems: 'center' }}>
                                    <Text style={fontStyles.bigTextStyleBlue}>{strings.ServiceRequested}</Text>
                                    <TouchableOpacity
                                        onPress={() => this.cancelRequest()}
                                        style={{ paddingTop: 30 }}>
                                        <Text style={fontStyles.mainTextStyleRed}>{strings.CancelRequest}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                    }
                </SafeAreaView>
            );
        }
    }
}

//Exports the screen
export default serviceScreen;