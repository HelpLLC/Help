//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the 
//requester to request the service.
import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Image } from 'react-native';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import { requestProduct } from '../../redux/requester/requesterActions/requestProduct';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BoxShadow } from 'react-native-shadow';

class serviceScreen extends Component {

    //This method will return true if the service has already been requested by this requester
    isServiceAlreadyRequested() {

        const { thisRequesterIndex, product } = this.props;

        //If the value is -1, this means that this requester doesn't have a current request on this service
        const indexOfRequest = product.requests.currentRequests.findIndex((request) => {
            return request.requesterID === thisRequesterIndex;
        });

        return (indexOfRequest === -1 ? false : true);

    }

    //The state controls whether or not the button to request the service will be displayed
    state = {
        serviceRequested: this.isServiceAlreadyRequested()
    }

    //This method will request this service from the company providing it by pushing the request to the
    //provider.
    //After confirming to the requester that the request has been processed, the program will
    //automatically send a message to the provider with a default message saying that this requester wants
    //to buy this service. Then will push the requester to the chats screen.
    requestService() {

        //It will simply call the action and request the product
        const { product, thisRequesterIndex } = this.props;

        this.props.requestProduct(product.serviceID, {
            requesterID: thisRequesterIndex,
            dateRequested: new Date().toLocaleDateString("en-US")
        });

        this.setState({ serviceRequested: true });
    }


    //Renders the UI
    render() {
        return (
            <View style={screenStyle.container}>
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
                            {this.props.product.serviceTitle}</Text>

                        <Text style={[fontStyles.subTextStyleGray, { paddingTop: 10 }]}>
                            {strings.OfferedBy}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('RequesterCompanyProfileScreen', {
                                    companyID: this.props.offeredByID,
                                    thisRequesterIndex: this.props.thisRequesterIndex
                                });
                            }}>
                            <Text style={fontStyles.subTextStyleBlue}>
                                {this.props.provider.companyName}</Text>
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
                                source={this.props.product.imageSource}
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
                        {this.props.product.serviceDescription}</Text>

                    <Text style={[fontStyles.bigTextStyleBlack, {
                        alignSelf: 'center',
                        paddingTop: 20,
                        paddingBottom: 20
                    }]}>
                        {this.props.product.pricing}
                    </Text>
                </View>

                { //Tests if this service has already been requested by the current user
                    this.state.serviceRequested === false ? (
                        <View style={{ marginTop: 60 }}>
                            <RoundBlueButton
                                title={strings.Request}
                                style={roundBlueButtonStyle.MediumSizeButton}
                                textStyle={fontStyles.bigTextStyleWhite}
                                onPress={() => { this.requestService() }} />
                        </View>
                    ) : (
                            <View style={{ marginTop: 60 }}>
                                <Text style={fontStyles.bigTextStyleBlue}>{strings.ServiceRequested}</Text>
                            </View>
                        )
                }
            </View>
        );
    }
}

//Maps the state to the current product being viewed & the company offering it as well as this requester's
//index to the props.
const mapStateToProps = (state, props) => {
    const { offeredByID, productID, thisRequesterIndex } = props.navigation.state.params;

    //Fetches this product
    const product = state.providerReducer.products.find((product) => {
        return product.serviceID === productID;
    });

    //Fethches this provider
    const provider = state.providerReducer.accounts.find((provider) => {
        return provider.providerID === offeredByID;
    });

    //Returns all of the data
    return { product, productID, provider, offeredByID, thisRequesterIndex };
};

//Connects the screen with the actions that will interact with the database.
//this action will edit the provider's company information
export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            requestProduct,
        },
        dispatch
    );

//connects the screen with the redux persist state
export default connect(mapStateToProps, mapDispatchToProps)(serviceScreen);